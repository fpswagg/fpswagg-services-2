/*
  Warnings:

  - You are about to drop the `IDGGAFFetchedData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IDGGAFTelegramAction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IDGGAFTimeData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TelegramBot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IDGGAFFetchedData" DROP CONSTRAINT "IDGGAFFetchedData_actionId_fkey";

-- DropForeignKey
ALTER TABLE "IDGGAFTelegramAction" DROP CONSTRAINT "IDGGAFTelegramAction_botId_fkey";

-- DropForeignKey
ALTER TABLE "IDGGAFTimeData" DROP CONSTRAINT "IDGGAFTimeData_actionId_fkey";

-- DropTable
DROP TABLE "IDGGAFFetchedData";

-- DropTable
DROP TABLE "IDGGAFTelegramAction";

-- DropTable
DROP TABLE "IDGGAFTimeData";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "TelegramBot";

-- CreateTable
CREATE TABLE "Scheduler" (
    "id" TEXT NOT NULL,
    "detailedName" TEXT NOT NULL,

    CONSTRAINT "Scheduler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "schedulerId" TEXT NOT NULL,
    "creationTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toPostAt" TIMESTAMP(3) NOT NULL,
    "posted" BOOLEAN NOT NULL DEFAULT false,
    "webhook" TEXT,
    "content" TEXT NOT NULL,
    "details" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeBlueprint" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "CodeBlueprint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_schedulerId_fkey" FOREIGN KEY ("schedulerId") REFERENCES "Scheduler"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
