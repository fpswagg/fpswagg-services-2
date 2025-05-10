/*
  Warnings:

  - The `init_data` column on the `TelegramBot` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `data` column on the `TelegramBot` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TelegramBot" DROP COLUMN "init_data",
ADD COLUMN     "init_data" JSONB NOT NULL DEFAULT '{}',
DROP COLUMN "data",
ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}';
