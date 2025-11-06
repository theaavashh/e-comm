import { Router, Request, Response } from 'express';
import { 
  convertFromNPR, 
  convertToNPR, 
  getExchangeRate, 
  formatPrice,
  getProductPriceInCurrency,
  CURRENCY_SYMBOLS 
} from '@/utils/currency';
import { AppError } from '@/middleware/errorHandler';

const router = Router();

// Get all supported currencies and their exchange rates
router.get('/rates', async (req: Request, res: Response) => {
  try {
    const rates = {
      NPR: 1,
      USD: getExchangeRate('NPR', 'USD'),
      AUD: getExchangeRate('NPR', 'AUD'),
      GBP: getExchangeRate('NPR', 'GBP'),
      CAD: getExchangeRate('NPR', 'CAD'),
      EUR: getExchangeRate('NPR', 'EUR'),
      INR: getExchangeRate('NPR', 'INR'),
      CNY: getExchangeRate('NPR', 'CNY'),
      JPY: getExchangeRate('NPR', 'JPY'),
      SGD: getExchangeRate('NPR', 'SGD'),
      AED: getExchangeRate('NPR', 'AED'),
    };

    const symbols = CURRENCY_SYMBOLS;

    res.json({
      success: true,
      data: {
        rates,
        symbols,
        baseCurrency: 'NPR',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    throw new AppError('Failed to fetch exchange rates', 500);
  }
});

// Convert amount between currencies
router.post('/convert', async (req: Request, res: Response) => {
  try {
    const { amount, from, to } = req.body;

    if (!amount || !from || !to) {
      throw new AppError('Amount, from currency, and to currency are required', 400);
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      throw new AppError('Invalid amount', 400);
    }

    let convertedAmount: number;

    if (from === 'NPR') {
      convertedAmount = convertFromNPR(numAmount, to);
    } else if (to === 'NPR') {
      convertedAmount = convertToNPR(numAmount, from);
    } else {
      // Convert through NPR
      const inNpr = convertToNPR(numAmount, from);
      convertedAmount = convertFromNPR(inNpr, to);
    }

    const exchangeRate = getExchangeRate(from, to);

    res.json({
      success: true,
      data: {
        from: {
          currency: from,
          amount: numAmount,
          formatted: formatPrice(numAmount, from),
        },
        to: {
          currency: to,
          amount: convertedAmount,
          formatted: formatPrice(convertedAmount, to),
        },
        exchangeRate,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to convert currency', 500);
  }
});

// Get product price in specific currency
router.get('/product/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { country, currency } = req.query;

    if (!country || !currency) {
      throw new AppError('Country and currency are required', 400);
    }

    const priceData = await getProductPriceInCurrency(
      productId,
      country as string,
      currency as string
    );

    if (!priceData) {
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      data: priceData,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch product price', 500);
  }
});

export default router;


