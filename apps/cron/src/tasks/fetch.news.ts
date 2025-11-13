import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RssAggregationService } from '@gitroom/nestjs-libraries/services/rss-aggregation.service';

@Injectable()
export class FetchNewsTask {
  private readonly logger = new Logger(FetchNewsTask.name);

  constructor(
    private readonly rssAggregationService: RssAggregationService
  ) {}

  /**
   * Fetch news every hour
   * Runs at the start of every hour (0 minutes past)
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyFetch() {
    this.logger.log('Starting hourly news fetch...');

    try {
      const result = await this.rssAggregationService.fetchAllSources();

      this.logger.log(
        `Hourly news fetch complete: ${result.newItems} new items from ${result.successful}/${result.total} sources`
      );

      if (result.failed > 0) {
        this.logger.warn(`${result.failed} sources failed to fetch`);
      }
    } catch (error: any) {
      this.logger.error(`Hourly news fetch failed: ${error.message}`, error.stack);
    }
  }

  /**
   * Optional: More frequent fetch during business hours
   * Runs every 30 minutes between 9 AM and 5 PM
   */
  @Cron('*/30 9-17 * * 1-5') // Every 30 min, 9AM-5PM, Mon-Fri
  async handleBusinessHoursFetch() {
    this.logger.log('Starting business hours news fetch...');

    try {
      const result = await this.rssAggregationService.fetchAllSources();

      this.logger.log(
        `Business hours fetch complete: ${result.newItems} new items`
      );
    } catch (error: any) {
      this.logger.error(`Business hours fetch failed: ${error.message}`);
    }
  }
}
