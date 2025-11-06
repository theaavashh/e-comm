/*
  Warnings:

  - You are about to drop the column `description` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `brands` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "brands_slug_key";

-- AlterTable
ALTER TABLE "brands" DROP COLUMN "description",
DROP COLUMN "isActive",
DROP COLUMN "slug",
DROP COLUMN "sortOrder";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "subCategoryId" TEXT;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
