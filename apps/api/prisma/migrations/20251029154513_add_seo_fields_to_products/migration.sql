-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "internalLink" TEXT;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'NPR',
ADD COLUMN     "currencySymbol" TEXT NOT NULL DEFAULT 'NPR',
ADD COLUMN     "nprPrice" DECIMAL(10,2),
ADD COLUMN     "nprTotal" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "currencySymbol" TEXT NOT NULL DEFAULT 'NPR',
ADD COLUMN     "customerCountry" TEXT,
ADD COLUMN     "exchangeRate" DECIMAL(10,4),
ADD COLUMN     "nprDiscountAmount" DECIMAL(10,2),
ADD COLUMN     "nprShippingAmount" DECIMAL(10,2),
ADD COLUMN     "nprSubtotal" DECIMAL(10,2),
ADD COLUMN     "nprTaxAmount" DECIMAL(10,2),
ADD COLUMN     "nprTotalAmount" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "focusKeyword" TEXT,
ADD COLUMN     "ogImage" TEXT;

-- CreateTable
CREATE TABLE "product_currency_prices" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "comparePrice" DECIMAL(10,2),
    "minDeliveryDays" INTEGER NOT NULL,
    "maxDeliveryDays" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_currency_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sliders" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "internalLink" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sliders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_currency_prices_productId_country_key" ON "product_currency_prices"("productId", "country");

-- AddForeignKey
ALTER TABLE "product_currency_prices" ADD CONSTRAINT "product_currency_prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
