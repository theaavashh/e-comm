/*
  Warnings:

  - You are about to drop the column `description` on the `top_banners` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `top_banners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "top_banners" DROP COLUMN "description",
DROP COLUMN "text";
