/**
 * Currency formatting utilities for multi-currency support
 */

// Currency symbols mapping
export const CURRENCY_SYMBOLS: Record<string, string> = {
  NPR: "NPR",
  USD: "$",
  AUD: "$",
  GBP: "£",
  CAD: "$",
  EUR: "€",
  INR: "₹",
  CNY: "¥",
  JPY: "¥",
  SGD: "$",
  AED: "د.إ",
};

export const formatCurrency = (
  amount: number,
  currency: string = "NPR",
  symbol?: string,
): string => {
  const currencySymbol = symbol || CURRENCY_SYMBOLS[currency] || currency;

  if (currency === "NPR") {
    return `${currencySymbol} ${amount.toLocaleString()}`;
  }

  return `${currencySymbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatPrice = (
  price: number,
  currency: string = "NPR",
): string => {
  return formatCurrency(price, currency);
};

export const formatPriceRange = (
  min: number,
  max: number,
  currency: string = "NPR",
): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  if (currency === "NPR") {
    return `${symbol} ${min.toLocaleString()} - ${symbol} ${max.toLocaleString()}`;
  }

  return `${symbol}${min.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} - ${symbol}${max.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const CURRENCY_SYMBOL = "NPR";
export const CURRENCY_CODE = "NPR";

/**
 * Get currency symbol for a currency code
 */
export const getCurrencySymbol = (currency: string): string => {
  return CURRENCY_SYMBOLS[currency] || currency;
};
