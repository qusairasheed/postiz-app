-- CreateTable for PostedNews (missing table)
CREATE TABLE IF NOT EXISTS "PostedNews" (
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
CREATE INDEX IF NOT EXISTS "PostedNews_newsItemId_idx" ON "PostedNews"("newsItemId");
CREATE INDEX IF NOT EXISTS "PostedNews_postId_idx" ON "PostedNews"("postId");
CREATE INDEX IF NOT EXISTS "PostedNews_organizationId_idx" ON "PostedNews"("organizationId");
CREATE INDEX IF NOT EXISTS "PostedNews_postedAt_idx" ON "PostedNews"("postedAt");
CREATE UNIQUE INDEX IF NOT EXISTS "PostedNews_newsItemId_postId_key" ON "PostedNews"("newsItemId", "postId");

-- AddForeignKey
ALTER TABLE "PostedNews" ADD CONSTRAINT "PostedNews_newsItemId_fkey" FOREIGN KEY ("newsItemId") REFERENCES "NewsItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PostedNews" ADD CONSTRAINT "PostedNews_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PostedNews" ADD CONSTRAINT "PostedNews_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
