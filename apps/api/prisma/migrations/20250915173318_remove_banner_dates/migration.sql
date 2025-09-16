/*
  Warnings:

  - You are about to drop the column `endDate` on the `top_banners` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `top_banners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "top_banners" DROP COLUMN "endDate",
DROP COLUMN "startDate";
