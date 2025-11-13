import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostedNewsRepository {
  constructor(
    private _postedNews: PrismaRepository<'postedNews'>
  ) {}

  createPostedNews(newsItemId: string, postId: string, orgId: string) {
    return this._postedNews.model.postedNews.create({
      data: {
        newsItem: {
          connect: {
            id: newsItemId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
        organization: {
          connect: {
            id: orgId,
          },
        },
      },
      select: {
        id: true,
        newsItemId: true,
        postId: true,
        postedAt: true,
      },
    });
  }

  getPostedNewsByNewsItemId(newsItemId: string) {
    return this._postedNews.model.postedNews.findMany({
      where: {
        newsItemId,
      },
      include: {
        post: {
          select: {
            id: true,
            state: true,
            publishDate: true,
            releaseURL: true,
            integration: {
              select: {
                name: true,
                providerIdentifier: true,
              },
            },
          },
        },
      },
    });
  }

  getPostedNewsByPostId(postId: string) {
    return this._postedNews.model.postedNews.findUnique({
      where: {
        newsItemId_postId: {
          newsItemId: postId,
          postId: postId,
        },
      },
      include: {
        newsItem: {
          select: {
            title: true,
            url: true,
            source: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  checkIfNewsItemPosted(newsItemId: string) {
    return this._postedNews.model.postedNews.findFirst({
      where: {
        newsItemId,
      },
      select: {
        id: true,
      },
    });
  }

  getRecentPostedNews(orgId: string, days: number = 7) {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    return this._postedNews.model.postedNews.findMany({
      where: {
        organizationId: orgId,
        postedAt: {
          gte: sinceDate,
        },
      },
      orderBy: {
        postedAt: 'desc',
      },
      include: {
        newsItem: {
          select: {
            title: true,
            url: true,
            source: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
        post: {
          select: {
            id: true,
            state: true,
            publishDate: true,
            releaseURL: true,
            integration: {
              select: {
                name: true,
                providerIdentifier: true,
              },
            },
          },
        },
      },
    });
  }
}
