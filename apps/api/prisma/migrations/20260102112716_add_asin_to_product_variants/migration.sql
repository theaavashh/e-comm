/*
  Warnings:

  - A unique constraint covering the columns `[asin]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "asin" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_asin_key" ON "product_variants"("asin");
