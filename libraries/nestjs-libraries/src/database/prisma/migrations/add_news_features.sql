-- CreateEnum
CREATE TYPE "NewsItemStatus" AS ENUM ('PENDING', 'ENHANCED', 'SCHEDULED', 'POSTED', 'SKIPPED', 'ERROR');

-- CreateTable
CREATE TABLE "NewsSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "feedType" TEXT NOT NULL DEFAULT 'RSS',
    "category" TEXT,
    "organizationId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "fetchInterval" INTEGER NOT NULL DEFAULT 3600000,
    "lastFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "NewsSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "originalContent" TEXT NOT NULL,
    "enhancedContent" TEXT,
    "url" TEXT NOT NULL,
    "imageUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "NewsItemStatus" NOT NULL DEFAULT 'PENDING',
    "aiEnhanced" BOOLEAN NOT NULL DEFAULT false,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostedNews" (
    "id" TEXT NOT NULL,
    "newsItemId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostedNews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NewsSource_organizationId_idx" ON "NewsSource"("organizationId");

-- CreateIndex
CREATE INDEX "NewsSource_active_idx" ON "NewsSource"("active");

-- CreateIndex
CREATE INDEX "NewsSource_lastFetchedAt_idx" ON "NewsSource"("lastFetchedAt");

-- CreateIndex
CREATE INDEX "NewsSource_deletedAt_idx" ON "NewsSource"("deletedAt");

-- CreateIndex
CREATE INDEX "NewsItem_sourceId_idx" ON "NewsItem"("sourceId");

-- CreateIndex
CREATE INDEX "NewsItem_organizationId_idx" ON "NewsItem"("organizationId");

-- CreateIndex
CREATE INDEX "NewsItem_status_idx" ON "NewsItem"("status");

-- CreateIndex
CREATE INDEX "NewsItem_hash_idx" ON "NewsItem"("hash");

-- CreateIndex
CREATE INDEX "NewsItem_fetchedAt_idx" ON "NewsItem"("fetchedAt");

-- CreateIndex
CREATE INDEX "NewsItem_deletedAt_idx" ON "NewsItem"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NewsItem_hash_sourceId_key" ON "NewsItem"("hash", "sourceId");

-- CreateIndex
CREATE INDEX "PostedNews_newsItemId_idx" ON "PostedNews"("newsItemId");

-- CreateIndex
CREATE INDEX "PostedNews_postId_idx" ON "PostedNews"("postId");

-- CreateIndex
CREATE INDEX "PostedNews_organizationId_idx" ON "PostedNews"("organizationId");

-- CreateIndex
CREATE INDEX "PostedNews_postedAt_idx" ON "PostedNews"("postedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PostedNews_newsItemId_postId_key" ON "PostedNews"("newsItemId", "postId");

-- AddForeignKey
ALTER TABLE "NewsSource" ADD CONSTRAINT "NewsSource_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsItem" ADD CONSTRAINT "NewsItem_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "NewsSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsItem" ADD CONSTRAINT "NewsItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostedNews" ADD CONSTRAINT "PostedNews_newsItemId_fkey" FOREIGN KEY ("newsItemId") REFERENCES "NewsItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostedNews" ADD CONSTRAINT "PostedNews_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostedNews" ADD CONSTRAINT "PostedNews_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
