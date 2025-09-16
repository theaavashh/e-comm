# Configuration API Documentation

## Overview
The Configuration API provides endpoints for managing system configuration including units and currency rates for the Gharsamma e-commerce platform.

## Base URL
```
http://localhost:5000/api/v1/configuration
```

## Authentication
All endpoints require admin authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-admin-token>
```

## Endpoints

### 1. Get All Configuration
**GET** `/configuration`

Returns all configuration data including units and currency rates.

**Response:**
```json
{
  "success": true,
  "data": {
    "units": {
      "weightUnits": ["kg", "g", "lb", "oz", "ton"],
      "lengthUnits": ["cm", "m", "mm", "in", "ft", "yd"],
      "clothingSizes": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      "volumeUnits": ["ml", "l", "gal", "qt", "pt", "cup"],
      "temperatureUnits": ["°C", "°F", "K"],
      "defaultWeightUnit": "kg",
      "defaultLengthUnit": "cm",
      "defaultClothingSize": "M"
    },
    "currencyRates": [
      {
        "id": "cmfkxtqlq000rl80xfaeme0g9",
        "country": "Nepal",
        "currency": "NPR",
        "symbol": "रू",
        "rateToNPR": "1",
        "isActive": true,
        "createdAt": "2025-09-15T09:44:43.502Z",
        "updatedAt": "2025-09-15T09:44:43.502Z"
      }
    ],
    "defaultCurrency": "NPR"
  }
}
```

### 2. Update Units Configuration
**PUT** `/configuration/units`

Updates the units configuration.

**Request Body:**
```json
{
  "weightUnits": ["kg", "g", "lb", "oz", "ton", "mg"],
  "lengthUnits": ["cm", "m", "mm", "in", "ft", "yd"],
  "clothingSizes": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  "volumeUnits": ["ml", "l", "gal", "qt", "pt", "cup"],
  "temperatureUnits": ["°C", "°F", "K"],
  "defaultWeightUnit": "kg",
  "defaultLengthUnit": "cm",
  "defaultClothingSize": "M"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Units configuration updated successfully"
}
```

### 3. Update Currency Rates
**PUT** `/configuration/currency-rates`

Updates all currency rates and default currency.

**Request Body:**
```json
{
  "currencyRates": [
    {
      "country": "United States",
      "currency": "USD",
      "symbol": "$",
      "rateToNPR": 133.50,
      "isActive": true
    }
  ],
  "defaultCurrency": "NPR"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Currency rates updated successfully"
}
```

### 4. Add Single Currency Rate
**POST** `/configuration/currency-rates`

Adds a new currency rate.

**Request Body:**
```json
{
  "country": "Japan",
  "currency": "JPY",
  "symbol": "¥",
  "rateToNPR": 0.90,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Currency rate added successfully",
  "data": {
    "id": "cmfkxtqlq000xl80xldu2z6kb",
    "country": "Japan",
    "currency": "JPY",
    "symbol": "¥",
    "rateToNPR": "0.9",
    "isActive": true,
    "createdAt": "2025-09-15T09:44:43.502Z",
    "updatedAt": "2025-09-15T09:44:43.502Z"
  }
}
```

### 5. Update Single Currency Rate
**PUT** `/configuration/currency-rates/:id`

Updates a specific currency rate.

**Request Body:**
```json
{
  "country": "Japan",
  "currency": "JPY",
  "symbol": "¥",
  "rateToNPR": 0.95,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Currency rate updated successfully",
  "data": {
    "id": "cmfkxtqlq000xl80xldu2z6kb",
    "country": "Japan",
    "currency": "JPY",
    "symbol": "¥",
    "rateToNPR": "0.95",
    "isActive": true,
    "createdAt": "2025-09-15T09:44:43.502Z",
    "updatedAt": "2025-09-15T09:44:43.502Z"
  }
}
```

### 6. Delete Currency Rate
**DELETE** `/configuration/currency-rates/:id`

Deletes a specific currency rate.

**Response:**
```json
{
  "success": true,
  "message": "Currency rate deleted successfully"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Usage Examples

### Get Admin Token
```bash
curl -X POST http://localhost:5000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gharsamma.com","password":"admin123"}'
```

### Get Configuration
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/v1/configuration
```

### Update Units
```bash
curl -X PUT http://localhost:5000/api/v1/configuration/units \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"weightUnits":["kg","g","lb"],"defaultWeightUnit":"kg"}'
```

## Database Models

### SystemConfig
- `id`: String (Primary Key)
- `key`: String (Unique)
- `value`: JSON
- `createdAt`: DateTime
- `updatedAt`: DateTime

### CurrencyRate
- `id`: String (Primary Key)
- `country`: String
- `currency`: String
- `symbol`: String
- `rateToNPR`: Decimal
- `isActive`: Boolean
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Unit
- `id`: String (Primary Key)
- `type`: UnitType (WEIGHT, LENGTH, CLOTHING_SIZE, VOLUME, TEMPERATURE)
- `name`: String
- `symbol`: String (Optional)
- `isDefault`: Boolean
- `isActive`: Boolean
- `createdAt`: DateTime
- `updatedAt`: DateTime






