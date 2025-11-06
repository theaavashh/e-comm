/*
  Warnings:

  - You are about to drop the column `description` on the `media_items` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `media_items` table. All the data in the column will be lost.
  - Added the required column `linkTo` to the `media_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media_items" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "linkTo" TEXT NOT NULL;
