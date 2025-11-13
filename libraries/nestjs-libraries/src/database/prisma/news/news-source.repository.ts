import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsSourceRepository {
  constructor(
    private _newsSource: PrismaRepository<'newsSource'>
  ) {}

  createNewsSource(
    orgId: string,
    name: string,
    url: string,
    category?: string,
    fetchInterval?: number
  ) {
    return this._newsSource.model.newsSource.create({
      data: {
        name,
        url,
        category,
        fetchInterval: fetchInterval || 3600000,
        organization: {
          connect: {
            id: orgId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        url: true,
        category: true,
        active: true,
        fetchInterval: true,
        lastFetchedAt: true,
        createdAt: true,
      },
    });
  }

  getNewsSourceById(id: string, orgId: string) {
    return this._newsSource.model.newsSource.findUnique({
      where: {
        id,
        organizationId: orgId,
        deletedAt: null,
      },
      include: {
        newsItems: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            fetchedAt: 'desc',
          },
          take: 10,
        },
      },
    });
  }

  getNewsSources(orgId: string) {
    return this._newsSource.model.newsSource.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        url: true,
        category: true,
        active: true,
        fetchInterval: true,
        lastFetchedAt: true,
        createdAt: true,
        _count: {
          select: {
            newsItems: true,
          },
        },
      },
    });
  }

  getActiveNewsSources(orgId?: string) {
    return this._newsSource.model.newsSource.findMany({
      where: {
        active: true,
        deletedAt: null,
        ...(orgId ? { organizationId: orgId } : {}),
      },
      select: {
        id: true,
        name: true,
        url: true,
        category: true,
        fetchInterval: true,
        lastFetchedAt: true,
        organizationId: true,
      },
    });
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
    return this._newsSource.model.newsSource.update({
      where: {
        id,
        organizationId: orgId,
      },
      data,
      select: {
        id: true,
        name: true,
        url: true,
        category: true,
        active: true,
        fetchInterval: true,
        lastFetchedAt: true,
      },
    });
  }

  updateLastFetchedAt(id: string) {
    return this._newsSource.model.newsSource.update({
      where: {
        id,
      },
      data: {
        lastFetchedAt: new Date(),
      },
    });
  }

  deleteNewsSource(id: string, orgId: string) {
    return this._newsSource.model.newsSource.update({
      where: {
        id,
        organizationId: orgId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  toggleNewsSource(id: string, orgId: string, active: boolean) {
    return this._newsSource.model.newsSource.update({
      where: {
        id,
        organizationId: orgId,
      },
      data: {
        active,
      },
    });
  }
}
