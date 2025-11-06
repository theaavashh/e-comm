# Multi-Currency Pricing Feature

This feature allows admins to set different prices for products in multiple currencies for different countries.

## Overview

The multi-currency pricing system enables you to:
- Set specific prices for different countries (e.g., Australia, USA, UK, etc.)
- Define currency codes (AUD, USD, GBP, etc.)
- Set currency symbols ($, £, €, etc.)
- Add compare prices for each currency to show discounts
- Enable/disable specific currency pricing

## Database Schema

A new table `product_currency_prices` has been added with the following structure:

```prisma
model ProductCurrencyPrice {
  id           String   @id @default(cuid())
  productId    String
  country      String   // e.g., "Australia", "USA", "UK"
  currency     String   // e.g., "AUD", "USD", "GBP"
  symbol       String   // e.g., "$", "£", "€"
  price        Decimal  @db.Decimal(10, 2)
  comparePrice Decimal? @db.Decimal(10, 2)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, country, currency])
  @@map("product_currency_prices")
}
```

## Admin Panel Usage

### Adding Currency Prices to a Product

1. Navigate to **Dashboard > Products**
2. Click **"Add Product"** or edit an existing product
3. Go to the **"Pricing"** tab
4. Scroll down to the **"International Pricing"** section
5. Click **"Add Currency"** button
6. Fill in the following fields:
   - **Country**: Select the target country (e.g., Australia, USA, UK)
   - **Currency**: Select the currency code (e.g., AUD, USD, GBP)
   - **Symbol**: Select the currency symbol (e.g., $, £, €)
   - **Price**: Enter the selling price in that currency
   - **Compare Price**: (Optional) Enter the original price to show discount
   - **Active**: Check to enable this currency pricing

7. Click **"Add Currency"** again to add more currencies
8. Click **"Save Product"** to save all changes

### Example Use Case

For a product priced at **NPR 1,000** (Nepali Rupees), you might add:

- **Australia**: AUD $15.00 (Compare: $20.00)
- **USA**: USD $10.00 (Compare: $15.00)
- **UK**: GBP £8.00 (Compare: £12.00)
- **India**: INR ₹900 (Compare: ₹1,200)

## API Integration

### Creating a Product with Currency Prices

**Endpoint**: `POST /api/v1/products`

**Request Body**:
```json
{
  "name": "Sample Product",
  "price": 1000,
  "categoryId": "category-id",
  "currencyPrices": [
    {
      "country": "Australia",
      "currency": "AUD",
      "symbol": "$",
      "price": 15.00,
      "comparePrice": 20.00,
      "isActive": true
    },
    {
      "country": "USA",
      "currency": "USD",
      "symbol": "$",
      "price": 10.00,
      "comparePrice": 15.00,
      "isActive": true
    }
  ]
}
```

### Updating Currency Prices

**Endpoint**: `PATCH /api/v1/products/:id`

**Request Body**:
```json
{
  "currencyPrices": [
    {
      "country": "Australia",
      "currency": "AUD",
      "symbol": "$",
      "price": 18.00,
      "comparePrice": 22.00,
      "isActive": true
    }
  ]
}
```

### Fetching Products with Currency Prices

**Endpoint**: `GET /api/v1/products/:id`

**Response**:
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "product-id",
      "name": "Sample Product",
      "price": 1000,
      "currencyPrices": [
        {
          "id": "price-id",
          "country": "Australia",
          "currency": "AUD",
          "symbol": "$",
          "price": 15.00,
          "comparePrice": 20.00,
          "isActive": true
        }
      ]
    }
  }
}
```

## Frontend Implementation (Future Enhancement)

To use currency prices on the frontend:

1. Detect user's country using IP geolocation
2. Check if product has `currencyPrices` for that country
3. If available, display the local currency price
4. If not available, fall back to the default NPR price

**Example Code**:
```typescript
const getCurrencyPrice = (product: Product, userCountry: string) => {
  const currencyPrice = product.currencyPrices?.find(
    cp => cp.country === userCountry && cp.isActive
  );
  
  if (currencyPrice) {
    return {
      price: currencyPrice.price,
      comparePrice: currencyPrice.comparePrice,
      symbol: currencyPrice.symbol,
      currency: currencyPrice.currency
    };
  }
  
  // Fallback to default NPR price
  return {
    price: product.price,
    comparePrice: product.comparePrice,
    symbol: 'NPR',
    currency: 'NPR'
  };
};
```

## Supported Countries and Currencies

Currently, the system supports the following country/currency combinations:

| Country       | Currency Code | Symbol |
|---------------|---------------|--------|
| Australia     | AUD           | $      |
| USA           | USD           | $      |
| UK            | GBP           | £      |
| Canada        | CAD           | $      |
| India         | INR           | ₹      |
| China         | CNY           | ¥      |
| Japan         | JPY           | ¥      |
| Singapore     | SGD           | $      |
| UAE           | AED           | د.إ    |
| Europe        | EUR           | €      |

You can easily add more countries and currencies by updating the dropdown options in the admin form.

## Notes

- Currency prices are stored separately from the main product price
- The main `price` field remains in NPR (Nepali Rupees) as the base currency
- Currency prices cascade delete when a product is deleted
- Each product can only have one price per country/currency combination (enforced by database unique constraint)
- When updating currency prices, all existing currency prices for that product are replaced with the new set
- Inactive currency prices are not returned in API responses by default

## Technical Files Modified

1. **Database Schema**: `apps/api/prisma/schema.prisma`
2. **Validation Schema**: `apps/admin/src/schemas/productSchema.ts`
3. **Product Controller**: `apps/api/src/controllers/productController.ts`
4. **Product Form**: `apps/admin/src/components/EnhancedProductForm.tsx`

## Migration

The database schema has been synced using `prisma db push`. To create a proper migration in the future, run:

```bash
cd apps/api
npx prisma migrate dev --name add_product_currency_prices
```


