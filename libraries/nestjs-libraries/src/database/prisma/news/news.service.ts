import { Injectable, BadRequestException } from '@nestjs/common';
import { NewsSourceRepository } from './news-source.repository';
import { NewsItemRepository } from './news-item.repository';
import { PostedNewsRepository } from './posted-news.repository';
import { NewsItemStatus } from '@prisma/client';

@Injectable()
export class NewsService {
  constructor(
    private _newsSourceRepository: NewsSourceRepository,
    private _newsItemRepository: NewsItemRepository,
    private _postedNewsRepository: PostedNewsRepository
  ) {}

  // News Source Management
  async createNewsSource(
    orgId: string,
    name: string,
    url: string,
    category?: string,
    fetchInterval?: number
  ) {
    // Validate RSS feed URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new BadRequestException('Invalid RSS feed URL');
    }

    return this._newsSourceRepository.createNewsSource(
      orgId,
      name,
      url,
      category,
      fetchInterval
    );
  }

  getNewsSourceById(id: string, orgId: string) {
    return this._newsSourceRepository.getNewsSourceById(id, orgId);
  }

  getNewsSources(orgId: string) {
    return this._newsSourceRepository.getNewsSources(orgId);
  }

  getActiveNewsSources(orgId?: string) {
    return this._newsSourceRepository.getActiveNewsSources(orgId);
  }

  updateNewsSource(
    id: string,
    orgId: string,
    data: {
      name?: string;
      url?: string;
      category?: string;
      active?: boolean;
      fetchInterval?: number;
    }
  ) {
    return this._newsSourceRepository.updateNewsSource(id, orgId, data);
  }

  deleteNewsSource(id: string, orgId: string) {
    return this._newsSourceRepository.deleteNewsSource(id, orgId);
  }

  toggleNewsSource(id: string, orgId: string, active: boolean) {
    return this._newsSourceRepository.toggleNewsSource(id, orgId, active);
  }

  // News Item Management
  async createNewsItem(data: {
    sourceId: string;
    orgId: string;
    title: string;
    originalContent: string;
    url: string;
    imageUrl?: string;
    publishedAt?: Date;
    hash: string;
  }) {
    // Check if news item already exists
    const exists = await this._newsItemRepository.checkNewsItemExists(
      data.hash,
      data.sourceId
    );

    if (exists) {
      return null; // Already exists, skip
    }

    return this._newsItemRepository.createNewsItem(data);
  }

  getNewsItemById(id: string, orgId: string) {
    return this._newsItemRepository.getNewsItemById(id, orgId);
  }

  getNewsItems(
    orgId: string,
    status?: NewsItemStatus,
    sourceId?: string,
    page: number = 1,
    limit: number = 20
  ) {
    return this._newsItemRepository.getNewsItems(
      orgId,
      status,
      sourceId,
      page,
      limit
    );
  }

  countNewsItems(orgId: string, status?: NewsItemStatus, sourceId?: string) {
    return this._newsItemRepository.countNewsItems(orgId, status, sourceId);
  }

  updateNewsItem(
    id: string,
    orgId: string,
    data: {
      enhancedContent?: string;
      status?: NewsItemStatus;
      aiEnhanced?: boolean;
    }
  ) {
    return this._newsItemRepository.updateNewsItem(id, orgId, data);
  }

  updateNewsItemStatus(id: string, status: NewsItemStatus) {
    return this._newsItemRepository.updateNewsItemStatus(id, status);
  }

  deleteNewsItem(id: string, orgId: string) {
    return this._newsItemRepository.deleteNewsItem(id, orgId);
  }

  getPendingNewsItems(orgId: string, limit: number = 10) {
    return this._newsItemRepository.getPendingNewsItems(orgId, limit);
  }

  getEnhancedNewsItems(orgId: string, limit: number = 10) {
    return this._newsItemRepository.getEnhancedNewsItems(orgId, limit);
  }

  // Posted News Management
  async createPostedNews(newsItemId: string, postId: string, orgId: string) {
    // Update news item status to POSTED
    await this.updateNewsItemStatus(newsItemId, 'POSTED');

    return this._postedNewsRepository.createPostedNews(
      newsItemId,
      postId,
      orgId
    );
  }

  getPostedNewsByNewsItemId(newsItemId: string) {
    return this._postedNewsRepository.getPostedNewsByNewsItemId(newsItemId);
  }

  checkIfNewsItemPosted(newsItemId: string) {
    return this._postedNewsRepository.checkIfNewsItemPosted(newsItemId);
  }

  getRecentPostedNews(orgId: string, days: number = 7) {
    return this._postedNewsRepository.getRecentPostedNews(orgId, days);
  }

  // Analytics
  async getNewsStats(orgId: string) {
    const [totalSources, pendingItems, enhancedItems, postedCount] =
      await Promise.all([
        this._newsSourceRepository.getNewsSources(orgId),
        this.countNewsItems(orgId, 'PENDING'),
        this.countNewsItems(orgId, 'ENHANCED'),
        this.countNewsItems(orgId, 'POSTED'),
      ]);

    return {
      totalSources: totalSources.length,
      activeSources: totalSources.filter((s) => s.active).length,
      pendingItems,
      enhancedItems,
      postedCount,
    };
  }
}
