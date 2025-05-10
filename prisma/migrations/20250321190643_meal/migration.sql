-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "tags" TEXT[],
    "youtube" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "imageSource" TEXT,
    "creativeCommonsConfirmed" TEXT,
    "dateModified" TIMESTAMP(3),

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "meal_id" TEXT NOT NULL,
    "ingredient" TEXT NOT NULL,
    "measure" TEXT NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NumberPost" (
    "id" SERIAL NOT NULL,
    "number_id" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_type" TEXT NOT NULL,
    "destination_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "NumberPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NumberRecord" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "keywords" TEXT[],
    "saved_as" TEXT,
    "reason" TEXT,
    "discussionFrequency" INTEGER,

    CONSTRAINT "NumberRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NumberPost" ADD CONSTRAINT "NumberPost_number_id_fkey" FOREIGN KEY ("number_id") REFERENCES "NumberRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
