-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "dimensions" JSONB,
ADD COLUMN     "height" DECIMAL(8,2),
ADD COLUMN     "length" DECIMAL(8,2),
ADD COLUMN     "width" DECIMAL(8,2);
