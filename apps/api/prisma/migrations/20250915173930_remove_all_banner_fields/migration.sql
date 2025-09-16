/*
  Warnings:

  - You are about to drop the column `backgroundColor` on the `top_banners` table. All the data in the column will be lost.
  - You are about to drop the column `linkText` on the `top_banners` table. All the data in the column will be lost.
  - You are about to drop the column `linkUrl` on the `top_banners` table. All the data in the column will be lost.
  - You are about to drop the column `textColor` on the `top_banners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "top_banners" DROP COLUMN "backgroundColor",
DROP COLUMN "linkText",
DROP COLUMN "linkUrl",
DROP COLUMN "textColor";
