/**
 * Currency formatting utilities for NPR (Nepalese Rupee)
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPrice = (price: number): string => {
  return `NPR ${price.toLocaleString()}`;
};

export const formatPriceRange = (min: number, max: number): string => {
  return `NPR ${min.toLocaleString()} - NPR ${max.toLocaleString()}`;
};

export const CURRENCY_SYMBOL = 'NPR';
export const CURRENCY_CODE = 'NPR';
