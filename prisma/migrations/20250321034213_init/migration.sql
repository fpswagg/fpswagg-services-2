-- CreateTable
CREATE TABLE "TelegramBot" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "init_data" JSONB[],
    "data" JSONB[],

    CONSTRAINT "TelegramBot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "name" TEXT,
    "desc" TEXT,
    "works" JSONB[],
    "rate" BIGINT NOT NULL DEFAULT 0,
    "creationTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" TEXT NOT NULL DEFAULT 'normal',

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TelegramBot_token_key" ON "TelegramBot"("token");
