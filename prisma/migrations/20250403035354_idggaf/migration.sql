/*
  Warnings:

  - The primary key for the `IDGGAFFetchedData` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "IDGGAFFetchedData" DROP CONSTRAINT "IDGGAFFetchedData_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "IDGGAFFetchedData_pkey" PRIMARY KEY ("id");
