import { Injectable, Logger } from '@nestjs/common';
import Parser from 'rss-parser';
import { createHash } from 'crypto';
import { NewsService } from '@gitroom/nestjs-libraries/database/prisma/news/news.service';

interface RSSItem {
  title?: string;
  link?: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
  isoDate?: string;
  enclosure?: {
    url?: string;
  };
}

@Injectable()
export class RssAggregationService {
  private readonly logger = new Logger(RssAggregationService.name);
  private readonly parser: Parser;

  constructor(private readonly newsService: NewsService) {
    this.parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent': 'Postiz/1.0 (Mortgage News Aggregator)',
      },
    });
  }

  /**
   * Generate hash for duplicate detection
   */
  private generateHash(title: string, url: string): string {
    return createHash('sha256')
      .update(`${title}-${url}`)
      .digest('hex');
  }

  /**
   * Clean and extract content from RSS item
   */
  private extractContent(item: RSSItem): string {
    // Priority: content > contentSnippet > description
    let content = item.content || item.contentSnippet || '';

    // Strip HTML tags for clean text
    content = content.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    content = content
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // Trim and remove extra whitespace
    content = content.replace(/\s+/g, ' ').trim();

    return content;
  }

  /**
   * Extract image URL from RSS item
   */
  private extractImageUrl(item: RSSItem): string | undefined {
    // Try enclosure first (common in RSS feeds)
    if (item.enclosure?.url) {
      return item.enclosure.url;
    }

    // Try to extract from content
    const content = item.content || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }

    return undefined;
  }

  /**
   * Fetch and parse RSS feed
   */
  async fetchFeed(url: string): Promise<RSSItem[]> {
    try {
      this.logger.log(`Fetching RSS feed: ${url}`);
      const feed = await this.parser.parseURL(url);

      this.logger.log(`Fetched ${feed.items.length} items from ${url}`);
      return feed.items as RSSItem[];
    } catch (error: any) {
      this.logger.error(`Failed to fetch RSS feed ${url}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch news from a single source
   */
  async fetchFromSource(sourceId: string, orgId: string, url: string): Promise<number> {
    try {
      const items = await this.fetchFeed(url);
      let newItemsCount = 0;

      for (const item of items) {
        if (!item.title || !item.link) {
          this.logger.warn('Skipping item without title or link');
          continue;
        }

        const hash = this.generateHash(item.title, item.link);
        const content = this.extractContent(item);
        const imageUrl = this.extractImageUrl(item);

        // Parse publish date
        const publishedAt = item.isoDate || item.pubDate
          ? new Date(item.isoDate || item.pubDate!)
          : undefined;

        // Try to create news item (will return null if duplicate)
        const created = await this.newsService.createNewsItem({
          sourceId,
          orgId,
          title: item.title,
          originalContent: content,
          url: item.link,
          imageUrl,
          publishedAt,
          hash,
        });

        if (created) {
          newItemsCount++;
          this.logger.log(`Created news item: ${item.title}`);
        } else {
          this.logger.debug(`Duplicate news item skipped: ${item.title}`);
        }
      }

      this.logger.log(`Fetched ${newItemsCount} new items from source ${sourceId}`);
      return newItemsCount;
    } catch (error: any) {
      this.logger.error(`Error fetching from source ${sourceId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch news from all active sources for an organization
   */
  async fetchAllSources(orgId?: string): Promise<{
    total: number;
    successful: number;
    failed: number;
    newItems: number;
  }> {
    const sources = await this.newsService.getActiveNewsSources(orgId);

    this.logger.log(`Fetching from ${sources.length} active sources`);

    let successful = 0;
    let failed = 0;
    let newItems = 0;

    for (const source of sources) {
      try {
        const count = await this.fetchFromSource(
          source.id,
          source.organizationId,
          source.url
        );

        newItems += count;
        successful++;

        // Update last fetched timestamp
        await this.newsService.getNewsSourceById(source.id, source.organizationId);
      } catch (error: any) {
        failed++;
        this.logger.error(`Failed to fetch source ${source.name}: ${error.message}`);
      }
    }

    this.logger.log(
      `Fetch complete: ${successful}/${sources.length} sources successful, ${newItems} new items`
    );

    return {
      total: sources.length,
      successful,
      failed,
      newItems,
    };
  }

  /**
   * Test a feed URL without saving
   */
  async testFeed(url: string): Promise<{
    valid: boolean;
    itemCount?: number;
    title?: string;
    error?: string;
  }> {
    try {
      const feed = await this.parser.parseURL(url);

      return {
        valid: true,
        itemCount: feed.items.length,
        title: feed.title,
      };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }
}
