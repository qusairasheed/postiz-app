import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { NewsItemStatus } from '@prisma/client';

@Injectable()
export class NewsItemRepository {
  constructor(
    private _newsItem: PrismaRepository<'newsItem'>
  ) {}

  createNewsItem(data: {
    sourceId: string;
    orgId: string;
    title: string;
    originalContent: string;
    url: string;
    imageUrl?: string;
    publishedAt?: Date;
    hash: string;
  }) {
    return this._newsItem.model.newsItem.create({
      data: {
        title: data.title,
        originalContent: data.originalContent,
        url: data.url,
        imageUrl: data.imageUrl,
        publishedAt: data.publishedAt,
        hash: data.hash,
        source: {
          connect: {
            id: data.sourceId,
          },
        },
        organization: {
          connect: {
            id: data.orgId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        originalContent: true,
        url: true,
        imageUrl: true,
        status: true,
        fetchedAt: true,
      },
    });
  }

  getNewsItemById(id: string, orgId: string) {
    return this._newsItem.model.newsItem.findUnique({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null,
      },
      include: {
        source: {
          select: {
            id: true,
            name: true,
          },
        },
        postedNews: {
          include: {
            post: {
              select: {
                id: true,
                state: true,
                publishDate: true,
                releaseURL: true,
              },
            },
          },
        },
      },
    });
  }

  getNewsItems(
    orgId: string,
    status?: NewsItemStatus,
    sourceId?: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    return this._newsItem.model.newsItem.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        ...(status ? { status } : {}),
        ...(sourceId ? { sourceId } : {}),
      },
      orderBy: {
        fetchedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        originalContent: true,
        enhancedContent: true,
        url: true,
        imageUrl: true,
        status: true,
        aiEnhanced: true,
        fetchedAt: true,
        publishedAt: true,
        source: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        _count: {
          select: {
            postedNews: true,
          },
        },
      },
      skip,
      take: limit,
    });
  }

  async countNewsItems(
    orgId: string,
    status?: NewsItemStatus,
    sourceId?: string
  ) {
    return this._newsItem.model.newsItem.count({
      where: {
        organizationId: orgId,
        deletedAt: null,
        ...(status ? { status } : {}),
        ...(sourceId ? { sourceId } : {}),
      },
    });
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
    return this._newsItem.model.newsItem.update({
      where: {
        id,
        organizationId: orgId,
      },
      data,
    });
  }

  updateNewsItemStatus(id: string, status: NewsItemStatus) {
    return this._newsItem.model.newsItem.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  checkNewsItemExists(hash: string, sourceId: string) {
    return this._newsItem.model.newsItem.findUnique({
      where: {
        hash_sourceId: {
          hash,
          sourceId,
        },
      },
      select: {
        id: true,
      },
    });
  }

  deleteNewsItem(id: string, orgId: string) {
    return this._newsItem.model.newsItem.update({
      where: {
        id,
        organizationId: orgId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  getPendingNewsItems(orgId: string, limit: number = 10) {
    return this._newsItem.model.newsItem.findMany({
      where: {
        organizationId: orgId,
        status: 'PENDING',
        deletedAt: null,
      },
      orderBy: {
        fetchedAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        title: true,
        originalContent: true,
        url: true,
        imageUrl: true,
        source: {
          select: {
            name: true,
            category: true,
          },
        },
      },
    });
  }

  getEnhancedNewsItems(orgId: string, limit: number = 10) {
    return this._newsItem.model.newsItem.findMany({
      where: {
        organizationId: orgId,
        status: 'ENHANCED',
        deletedAt: null,
      },
      orderBy: {
        fetchedAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        title: true,
        enhancedContent: true,
        url: true,
        imageUrl: true,
        source: {
          select: {
            name: true,
            category: true,
          },
        },
      },
    });
  }
}
