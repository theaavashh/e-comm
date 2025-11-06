# Order Multi-Currency Display Feature

This feature enables orders to display prices in both the customer's currency and NPR (Nepali Rupees), with automatic conversion.

## Overview

The order currency system allows:
- Orders to be placed in any supported currency
- Automatic conversion of all prices to NPR
- Display of both customer currency and NPR equivalent in admin panel
- Storage of exchange rates used for conversion
- Track customer's country for order context

## Database Schema Changes

### Order Model Updates

```prisma
model Order {
  // ... existing fields
  currency        String      @default("NPR")
  currencySymbol  String      @default("NPR")
  
  // NPR conversion for international orders
  nprSubtotal     Decimal?    @db.Decimal(10, 2)
  nprTaxAmount    Decimal?    @db.Decimal(10, 2)
  nprShippingAmount Decimal?  @db.Decimal(10, 2)
  nprDiscountAmount Decimal?  @db.Decimal(10, 2)
  nprTotalAmount  Decimal?    @db.Decimal(10, 2)
  exchangeRate    Decimal?    @db.Decimal(10, 4)
  customerCountry String?
  // ... rest of fields
}
```

### OrderItem Model Updates

```prisma
model OrderItem {
  // ... existing fields
  nprPrice  Decimal? @db.Decimal(10, 2)
  nprTotal  Decimal? @db.Decimal(10, 2)
  currency  String   @default("NPR")
  currencySymbol String @default("NPR")
  // ... rest of fields
}
```

## Currency Conversion Utility

A comprehensive currency utility has been created at `apps/api/src/utils/currency.ts`:

### Supported Currencies

| Currency | Code | Symbol | Rate to NPR |
|----------|------|--------|-------------|
| Nepali Rupee | NPR | NPR | 1 |
| US Dollar | USD | $ | 0.0075 |
| Australian Dollar | AUD | $ | 0.011 |
| British Pound | GBP | £ | 0.0059 |
| Canadian Dollar | CAD | $ | 0.010 |
| Euro | EUR | € | 0.0069 |
| Indian Rupee | INR | ₹ | 0.63 |
| Chinese Yuan | CNY | ¥ | 0.054 |
| Japanese Yen | JPY | ¥ | 1.15 |
| Singapore Dollar | SGD | $ | 0.010 |
| UAE Dirham | AED | د.إ | 0.027 |

### Key Functions

#### `convertFromNPR(nprAmount, toCurrency)`
Converts an amount from NPR to another currency.

```typescript
const usdAmount = convertFromNPR(1000, 'USD'); // Returns 7.50
```

#### `convertToNPR(amount, fromCurrency)`
Converts an amount from any currency to NPR.

```typescript
const nprAmount = convertToNPR(100, 'USD'); // Returns 13,333.33
```

#### `getExchangeRate(fromCurrency, toCurrency)`
Gets the exchange rate between two currencies.

```typescript
const rate = getExchangeRate('USD', 'NPR'); // Returns 133.33
```

#### `formatPrice(amount, currency)`
Formats a price with the appropriate currency symbol.

```typescript
const formatted = formatPrice(1000, 'USD'); // Returns "$1,000.00"
```

#### `getProductPriceInCurrency(productId, country, currency)`
Gets a product's price in a specific currency, checking for custom currency prices first.

```typescript
const priceData = await getProductPriceInCurrency('product-id', 'Australia', 'AUD');
// Returns:
// {
//   price: 80.00,
//   comparePrice: 100.00,
//   currency: 'AUD',
//   symbol: '$',
//   nprPrice: 7272.73,
//   exchangeRate: 0.011
// }
```

## API Endpoints

### 1. Get Exchange Rates
**GET** `/api/v1/currency/rates`

**Response:**
```json
{
  "success": true,
  "data": {
    "rates": {
      "NPR": 1,
      "USD": 0.0075,
      "AUD": 0.011,
      ...
    },
    "symbols": {
      "NPR": "NPR",
      "USD": "$",
      "AUD": "$",
      ...
    },
    "baseCurrency": "NPR",
    "lastUpdated": "2025-10-10T12:00:00.000Z"
  }
}
```

### 2. Convert Currency
**POST** `/api/v1/currency/convert`

**Request Body:**
```json
{
  "amount": 1000,
  "from": "NPR",
  "to": "USD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "from": {
      "currency": "NPR",
      "amount": 1000,
      "formatted": "NPR 1,000"
    },
    "to": {
      "currency": "USD",
      "amount": 7.50,
      "formatted": "$7.50"
    },
    "exchangeRate": 0.0075
  }
}
```

### 3. Get Product Price in Currency
**GET** `/api/v1/currency/product/:productId?country=Australia&currency=AUD`

**Response:**
```json
{
  "success": true,
  "data": {
    "price": 80.00,
    "comparePrice": 100.00,
    "currency": "AUD",
    "symbol": "$",
    "nprPrice": 7272.73,
    "exchangeRate": 0.011
  }
}
```

## Admin Panel Display

### Order Summary

When viewing an order in the admin panel, the interface now shows:

1. **Currency Indicator**: Shows the order currency and customer country
2. **Dual Price Display**: 
   - Main price in customer's currency
   - NPR equivalent below in smaller text
3. **Exchange Rate**: Displayed at the bottom of the order summary

**Example Display:**

```
Order Summary (Australia)

Subtotal:        $80.00
                 NPR 7,272.73

Shipping:        $10.00
                 NPR 909.09

Tax:             $9.00
                 NPR 818.18

Total:           $99.00
                 NPR 9,000.00

Exchange Rate: 1 AUD = NPR 90.9091
```

### Order Items

Each order item displays:
- Item name and quantity
- Unit price in both currencies
- Total price in both currencies

**Example Display:**

```
[Image] Product Name
       Qty: 2
       Unit: $40.00 | NPR 3,636.36
                                    $80.00
                                    NPR 7,272.72
```

## Creating Orders with Currency

When creating an order, include currency information:

```typescript
const orderData = {
  // ... other order fields
  currency: 'AUD',
  currencySymbol: '$',
  subtotal: 80.00,
  taxAmount: 9.00,
  shippingAmount: 10.00,
  discountAmount: 0,
  totalAmount: 99.00,
  // NPR conversions
  nprSubtotal: convertToNPR(80, 'AUD'),
  nprTaxAmount: convertToNPR(9, 'AUD'),
  nprShippingAmount: convertToNPR(10, 'AUD'),
  nprDiscountAmount: 0,
  nprTotalAmount: convertToNPR(99, 'AUD'),
  exchangeRate: getExchangeRate('AUD', 'NPR'),
  customerCountry: 'Australia',
  items: [
    {
      productId: 'product-id',
      quantity: 2,
      price: 40.00,
      total: 80.00,
      nprPrice: convertToNPR(40, 'AUD'),
      nprTotal: convertToNPR(80, 'AUD'),
      currency: 'AUD',
      currencySymbol: '$',
    }
  ]
};
```

## Frontend Implementation Example

### Checkout Process

```typescript
// Detect user location
const userCountry = await detectUserCountry(); // 'Australia'
const userCurrency = getCurrencyForCountry(userCountry); // 'AUD'

// Get product prices in user currency
const productPriceData = await fetch(
  `/api/v1/currency/product/${productId}?country=${userCountry}&currency=${userCurrency}`
);

// Calculate order totals
const items = cartItems.map(item => ({
  productId: item.id,
  quantity: item.quantity,
  price: item.priceInUserCurrency,
  nprPrice: convertToNPR(item.priceInUserCurrency, userCurrency),
  currency: userCurrency,
  currencySymbol: getCurrencySymbol(userCurrency),
}));

// Create order with currency info
const order = {
  ...orderDetails,
  currency: userCurrency,
  currencySymbol: getCurrencySymbol(userCurrency),
  customerCountry: userCountry,
  items,
  // Include NPR conversions for all amounts
};
```

## Benefits

1. **Transparency**: Admins see both local and NPR prices
2. **Accurate Reporting**: All revenue can be reported in NPR
3. **Historical Record**: Exchange rates are stored with each order
4. **Flexible Pricing**: Supports custom prices per country or auto-conversion
5. **Easy Reconciliation**: NPR amounts help with accounting and tax purposes

## Exchange Rate Updates

Currently, exchange rates are static in the code. For production:

1. **Integrate with a live API** like:
   - ExchangeRate-API.com
   - Open Exchange Rates
   - Fixer.io

2. **Update the utility to fetch live rates**:

```typescript
import fetch from 'node-fetch';

const fetchLiveRates = async () => {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/NPR');
  const data = await response.json();
  return data.rates;
};
```

3. **Cache rates** and refresh periodically (e.g., daily)

## Testing

### Test Currency Conversion
```bash
curl -X POST http://localhost:5000/api/v1/currency/convert \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "from": "NPR", "to": "USD"}'
```

### Test Exchange Rates
```bash
curl http://localhost:5000/api/v1/currency/rates
```

### Test Product Price
```bash
curl "http://localhost:5000/api/v1/currency/product/PRODUCT_ID?country=Australia&currency=AUD"
```

## Files Modified

1. **Database Schema**: `apps/api/prisma/schema.prisma`
   - Added currency fields to Order model
   - Added NPR conversion fields to Order model
   - Added currency fields to OrderItem model

2. **Currency Utility**: `apps/api/src/utils/currency.ts` (NEW)
   - Conversion functions
   - Exchange rate management
   - Price formatting

3. **Currency API**: `apps/api/src/routes/currency.ts` (NEW)
   - Exchange rate endpoint
   - Conversion endpoint
   - Product price endpoint

4. **API Index**: `apps/api/src/index.ts`
   - Registered currency routes

5. **Admin Orders Page**: `apps/admin/src/app/dashboard/orders/page.tsx`
   - Updated Order interface
   - Updated formatCurrency function
   - Updated order summary display
   - Updated order items display

## Next Steps (Optional)

1. **Payment Gateway Integration**: Use customer's currency for payment
2. **Automatic Currency Detection**: Detect user's location and show prices in their currency
3. **Currency Selector**: Allow users to choose their preferred currency
4. **Live Exchange Rates**: Integrate with a real-time exchange rate API
5. **Multi-Currency Reports**: Generate revenue reports in different currencies
6. **Currency-Based Discounts**: Offer discounts based on customer's currency/country

## Notes

- All prices are stored with 2 decimal precision
- Exchange rates are stored with 4 decimal precision
- NPR remains the base currency for all calculations
- Orders in NPR don't have duplicate NPR conversion fields
- Exchange rates are captured at order creation time for historical accuracy


