import prisma from '@/config/database';
import { logger } from '@/utils/logger';

// Static exchange rates (NPR to other currencies)
// In production, these should be fetched from a live API like exchangerate-api.com
const EXCHANGE_RATES: Record<string, number> = {
  NPR: 1,
  USD: 0.0075,    // 1 NPR = 0.0075 USD
  AUD: 0.011,     // 1 NPR = 0.011 AUD
  GBP: 0.0059,    // 1 NPR = 0.0059 GBP
  CAD: 0.010,     // 1 NPR = 0.010 CAD
  EUR: 0.0069,    // 1 NPR = 0.0069 EUR
  INR: 0.63,      // 1 NPR = 0.63 INR
  CNY: 0.054,     // 1 NPR = 0.054 CNY
  JPY: 1.15,      // 1 NPR = 1.15 JPY
  SGD: 0.010,     // 1 NPR = 0.010 SGD
  AED: 0.027,     // 1 NPR = 0.027 AED
};

// Currency symbols mapping
export const CURRENCY_SYMBOLS: Record<string, string> = {
  NPR: 'NPR',
  USD: '$',
  AUD: '$',
  GBP: '£',
  CAD: '$',
  EUR: '€',
  INR: '₹',
  CNY: '¥',
  JPY: '¥',
  SGD: '$',
  AED: 'د.إ',
};

/**
 * Convert NPR to another currency
 * @param nprAmount Amount in NPR
 * @param toCurrency Target currency code
 * @returns Converted amount
 */
export const convertFromNPR = (nprAmount: number, toCurrency: string): number => {
  const rate = EXCHANGE_RATES[toCurrency];
  if (!rate) {
    logger.warn(`Exchange rate not found for currency: ${toCurrency}`);
    return nprAmount;
  }
  return Math.round(nprAmount * rate * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert from any currency to NPR
 * @param amount Amount in source currency
 * @param fromCurrency Source currency code
 * @returns Amount in NPR
 */
export const convertToNPR = (amount: number, fromCurrency: string): number => {
  if (fromCurrency === 'NPR') {
    return amount;
  }
  
  const rate = EXCHANGE_RATES[fromCurrency];
  if (!rate) {
    logger.warn(`Exchange rate not found for currency: ${fromCurrency}`);
    return amount;
  }
  
  // Inverse the rate to convert back to NPR
  return Math.round((amount / rate) * 100) / 100;
};

/**
 * Get exchange rate for a currency pair
 * @param fromCurrency Source currency
 * @param toCurrency Target currency
 * @returns Exchange rate
 */
export const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) {
    return 1;
  }
  
  if (fromCurrency === 'NPR') {
    return EXCHANGE_RATES[toCurrency] || 1;
  }
  
  if (toCurrency === 'NPR') {
    const rate = EXCHANGE_RATES[fromCurrency];
    return rate ? 1 / rate : 1;
  }
  
  // Convert through NPR: from -> NPR -> to
  const fromRate = EXCHANGE_RATES[fromCurrency];
  const toRate = EXCHANGE_RATES[toCurrency];
  
  if (!fromRate || !toRate) {
    return 1;
  }
  
  return toRate / fromRate;
};

/**
 * Get currency symbol for a currency code
 * @param currency Currency code
 * @returns Currency symbol
 */
export const getCurrencySymbol = (currency: string): string => {
  return CURRENCY_SYMBOLS[currency] || currency;
};

/**
 * Format price with currency symbol
 * @param amount Price amount
 * @param currency Currency code
 * @returns Formatted price string
 */
export const formatPrice = (amount: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency);
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  // For currencies with symbols after the amount
  if (currency === 'NPR') {
    return `${symbol} ${formattedAmount}`;
  }
  
  return `${symbol}${formattedAmount}`;
};

/**
 * Get product price in specific currency
 * @param productId Product ID
 * @param country Customer's country
 * @param currency Desired currency
 * @returns Price object with currency info
 */
export const getProductPriceInCurrency = async (
  productId: string,
  country: string,
  currency: string
): Promise<{
  price: number;
  comparePrice?: number;
  currency: string;
  symbol: string;
  nprPrice: number;
  exchangeRate: number;
} | null> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        currencyPrices: {
          where: {
            country,
            isActive: true,
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    // Check if product has a specific price for this country
    if (product.currencyPrices && product.currencyPrices.length > 0) {
      const currencyPrice = product.currencyPrices[0];
      // Find NPR price from currencyPrices if available, otherwise use base price (deprecated)
      const nprPriceObj = product.currencyPrices.find((cp: any) => 
        cp.country.toLowerCase() === 'nepal' || cp.country.toLowerCase() === 'npr'
      );
      const nprPrice = nprPriceObj ? Number(nprPriceObj.price) : Number(product.price || 0);
      
      return {
        price: Number(currencyPrice.price),
        comparePrice: currencyPrice.comparePrice ? Number(currencyPrice.comparePrice) : undefined,
        currency,
        symbol: getCurrencySymbol(currency),
        nprPrice,
        exchangeRate: getExchangeRate('NPR', currency),
      };
    }

    // Fallback: Try to get NPR price from currencyPrices or use deprecated base price
    const nprPriceObj = product.currencyPrices?.find((cp: any) => 
      cp.country.toLowerCase() === 'nepal' || cp.country.toLowerCase() === 'npr'
    );
    const nprPrice = nprPriceObj ? Number(nprPriceObj.price) : Number(product.price || 0);
    
    if (nprPrice === 0) {
      logger.warn(`No pricing found for product ${productId} in country ${country}`);
      return null;
    }
    
    const convertedPrice = convertFromNPR(nprPrice, currency);
    const convertedComparePrice = product.comparePrice 
      ? convertFromNPR(Number(product.comparePrice), currency)
      : undefined;

    return {
      price: convertedPrice,
      comparePrice: convertedComparePrice,
      currency,
      symbol: getCurrencySymbol(currency),
      nprPrice,
      exchangeRate: getExchangeRate('NPR', currency),
    };
  } catch (error) {
    logger.error('Error getting product price in currency:', error);
    return null;
  }
};

/**
 * Calculate order totals in both customer currency and NPR
 * @param items Order items with prices
 * @param currency Customer's currency
 * @returns Order totals in both currencies
 */
export const calculateOrderTotals = (
  items: Array<{ price: number; quantity: number }>,
  currency: string
): {
  subtotal: number;
  nprSubtotal: number;
  exchangeRate: number;
} => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const nprSubtotal = currency === 'NPR' ? subtotal : convertToNPR(subtotal, currency);
  const exchangeRate = getExchangeRate(currency, 'NPR');

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    nprSubtotal: Math.round(nprSubtotal * 100) / 100,
    exchangeRate: Math.round(exchangeRate * 10000) / 10000,
  };
};


