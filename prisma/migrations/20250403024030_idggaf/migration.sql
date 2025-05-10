/*
  Warnings:

  - You are about to drop the column `data` on the `TelegramBot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TelegramBot" DROP COLUMN "data";

-- CreateTable
CREATE TABLE "IDGGAFTelegramAction" (
    "id" SERIAL NOT NULL,
    "botId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "channels" TEXT[],

    CONSTRAINT "IDGGAFTelegramAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IDGGAFTimeData" (
    "actionId" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "time" INTEGER NOT NULL,

    CONSTRAINT "IDGGAFTimeData_pkey" PRIMARY KEY ("actionId","channel")
);

-- CreateTable
CREATE TABLE "IDGGAFFetchedData" (
    "actionId" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "IDGGAFFetchedData_pkey" PRIMARY KEY ("actionId","channel")
);

-- AddForeignKey
ALTER TABLE "IDGGAFTelegramAction" ADD CONSTRAINT "IDGGAFTelegramAction_botId_fkey" FOREIGN KEY ("botId") REFERENCES "TelegramBot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDGGAFTimeData" ADD CONSTRAINT "IDGGAFTimeData_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "IDGGAFTelegramAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IDGGAFFetchedData" ADD CONSTRAINT "IDGGAFFetchedData_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "IDGGAFTelegramAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
