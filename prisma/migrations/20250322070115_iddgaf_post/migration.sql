-- CreateTable
CREATE TABLE "IddgafPost" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'telegram',
    "to_id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "content_type" TEXT NOT NULL DEFAULT 'link',
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "IddgafPost_pkey" PRIMARY KEY ("id")
);
