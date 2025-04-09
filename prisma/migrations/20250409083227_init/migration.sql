-- CreateTable
CREATE TABLE "URL" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "url_hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "URL_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "URL_url_hash_key" ON "URL"("url_hash");

-- CreateIndex
CREATE INDEX "URL_url_hash_idx" ON "URL"("url_hash");
