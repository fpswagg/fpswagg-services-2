/*
  Warnings:

  - The primary key for the `NumberRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "NumberPost" DROP CONSTRAINT "NumberPost_number_id_fkey";

-- AlterTable
ALTER TABLE "NumberPost" ALTER COLUMN "number_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "NumberRecord" DROP CONSTRAINT "NumberRecord_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "NumberRecord_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "NumberRecord_id_seq";

-- AddForeignKey
ALTER TABLE "NumberPost" ADD CONSTRAINT "NumberPost_number_id_fkey" FOREIGN KEY ("number_id") REFERENCES "NumberRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
