/*
  Warnings:

  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Scheduler" ADD COLUMN     "author" TEXT NOT NULL DEFAULT 'system:unkown';

-- DropTable
DROP TABLE "Token";
