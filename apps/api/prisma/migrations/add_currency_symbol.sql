-- Migration script to add currency and symbol fields to product_currency_prices table

-- First, add the columns as nullable to allow existing data
ALTER TABLE product_currency_prices 
ADD COLUMN currency VARCHAR(10),
ADD COLUMN symbol VARCHAR(10);

-- Update existing records based on country mapping
UPDATE product_currency_prices 
SET currency = CASE 
  WHEN country = 'Australia' THEN 'AUD'
  WHEN country = 'USA' THEN 'USD'
  WHEN country = 'UK' THEN 'GBP'
  WHEN country = 'Canada' THEN 'CAD'
  WHEN country = 'India' THEN 'INR'
  WHEN country = 'China' THEN 'CNY'
  WHEN country = 'Japan' THEN 'JPY'
  WHEN country = 'Singapore' THEN 'SGD'
  WHEN country = 'UAE' THEN 'AED'
  WHEN country IN ('Nepal', 'NPR') THEN 'NPR'
  ELSE 'NPR'
END,
symbol = CASE 
  WHEN country = 'Australia' THEN '$'
  WHEN country = 'USA' THEN '$'
  WHEN country = 'UK' THEN '£'
  WHEN country = 'Canada' THEN '$'
  WHEN country = 'India' THEN '₹'
  WHEN country = 'China' THEN '¥'
  WHEN country = 'Japan' THEN '¥'
  WHEN country = 'Singapore' THEN '$'
  WHEN country = 'UAE' THEN 'د.إ'
  WHEN country IN ('Nepal', 'NPR') THEN 'NPR'
  ELSE 'NPR'
END
WHERE currency IS NULL;

-- Now make the columns NOT NULL
ALTER TABLE product_currency_prices 
ALTER COLUMN currency SET NOT NULL,
ALTER COLUMN symbol SET NOT NULL;

-- Drop the old unique constraint and create a new one
ALTER TABLE product_currency_prices DROP CONSTRAINT IF EXISTS product_currency_prices_productid_country_unique;
ALTER TABLE product_currency_prices ADD CONSTRAINT product_currency_prices_productid_country_currency_unique UNIQUE (product_id, country, currency);