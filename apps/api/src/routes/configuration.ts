import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { adminAuth } from '@/middleware/adminAuth';

const router = Router();
const prisma = new PrismaClient();

// Get all configuration
router.get('/', adminAuth, async (req, res) => {
  try {
    // Get system configuration
    const systemConfig = await prisma.systemConfig.findMany();
    
    // Get currency rates
    const currencyRates = await prisma.currencyRate.findMany({
      orderBy: { createdAt: 'asc' }
    });
    
    // Get units
    const units = await prisma.unit.findMany({
      orderBy: { type: 'asc' }
    });

    // Organize units by type
    const unitsByType = {
      weightUnits: units.filter(u => u.type === 'WEIGHT' && u.isActive).map(u => u.name),
      lengthUnits: units.filter(u => u.type === 'LENGTH' && u.isActive).map(u => u.name),
      clothingSizes: units.filter(u => u.type === 'CLOTHING_SIZE' && u.isActive).map(u => u.name),
      volumeUnits: units.filter(u => u.type === 'VOLUME' && u.isActive).map(u => u.name),
      temperatureUnits: units.filter(u => u.type === 'TEMPERATURE' && u.isActive).map(u => u.name),
      defaultWeightUnit: units.find(u => u.type === 'WEIGHT' && u.isDefault)?.name || 'kg',
      defaultLengthUnit: units.find(u => u.type === 'LENGTH' && u.isDefault)?.name || 'cm',
      defaultClothingSize: units.find(u => u.type === 'CLOTHING_SIZE' && u.isDefault)?.name || 'M',
    };

    // Get default currency
    const defaultCurrencyConfig = systemConfig.find(config => config.key === 'defaultCurrency');
    const defaultCurrency = defaultCurrencyConfig ? defaultCurrencyConfig.value as string : 'NPR';

    res.json({
      success: true,
      data: {
        units: unitsByType,
        currencyRates,
        defaultCurrency
      }
    });
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update units configuration
router.put('/units', adminAuth, async (req, res) => {
  try {
    const { 
      weightUnits, 
      lengthUnits, 
      clothingSizes, 
      volumeUnits, 
      temperatureUnits,
      defaultWeightUnit,
      defaultLengthUnit,
      defaultClothingSize
    } = req.body;

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Clear existing units
      await tx.unit.deleteMany();

      // Add new units
      const unitsToCreate = [
        ...weightUnits.map((unit: string) => ({
          type: 'WEIGHT' as const,
          name: unit,
          isDefault: unit === defaultWeightUnit,
          isActive: true
        })),
        ...lengthUnits.map((unit: string) => ({
          type: 'LENGTH' as const,
          name: unit,
          isDefault: unit === defaultLengthUnit,
          isActive: true
        })),
        ...clothingSizes.map((unit: string) => ({
          type: 'CLOTHING_SIZE' as const,
          name: unit,
          isDefault: unit === defaultClothingSize,
          isActive: true
        })),
        ...volumeUnits.map((unit: string) => ({
          type: 'VOLUME' as const,
          name: unit,
          isDefault: false,
          isActive: true
        })),
        ...temperatureUnits.map((unit: string) => ({
          type: 'TEMPERATURE' as const,
          name: unit,
          isDefault: false,
          isActive: true
        }))
      ];

      await tx.unit.createMany({
        data: unitsToCreate
      });
    });

    res.json({
      success: true,
      message: 'Units configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating units configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update units configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update currency rates
router.put('/currency-rates', adminAuth, async (req, res) => {
  try {
    const { currencyRates, defaultCurrency } = req.body;

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Clear existing currency rates
      await tx.currencyRate.deleteMany();

      // Add new currency rates
      if (currencyRates && currencyRates.length > 0) {
        await tx.currencyRate.createMany({
          data: currencyRates.map((rate: any) => ({
            country: rate.country,
            currency: rate.currency,
            symbol: rate.symbol,
            rateToNPR: rate.rateToNPR,
            isActive: rate.isActive
          }))
        });
      }

      // Update default currency
      await tx.systemConfig.upsert({
        where: { key: 'defaultCurrency' },
        update: { value: defaultCurrency },
        create: { key: 'defaultCurrency', value: defaultCurrency }
      });
    });

    res.json({
      success: true,
      message: 'Currency rates updated successfully'
    });
  } catch (error) {
    console.error('Error updating currency rates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update currency rates',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add single currency rate
router.post('/currency-rates', adminAuth, async (req, res) => {
  try {
    const { country, currency, symbol, rateToNPR, isActive = true } = req.body;

    // Validate required fields
    if (!country || !currency || !symbol || !rateToNPR) {
      return res.status(400).json({
        success: false,
        message: 'Country, currency, symbol, and rateToNPR are required'
      });
    }

    // Check if currency rate already exists
    const existingRate = await prisma.currencyRate.findFirst({
      where: {
        OR: [
          { country, currency },
          { currency }
        ]
      }
    });

    if (existingRate) {
      return res.status(400).json({
        success: false,
        message: 'Currency rate already exists for this country/currency'
      });
    }

    const currencyRate = await prisma.currencyRate.create({
      data: {
        country,
        currency,
        symbol,
        rateToNPR,
        isActive
      }
    });

    res.status(201).json({
      success: true,
      message: 'Currency rate added successfully',
      data: currencyRate
    });
  } catch (error) {
    console.error('Error adding currency rate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add currency rate',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update single currency rate
router.put('/currency-rates/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { country, currency, symbol, rateToNPR, isActive } = req.body;

    const currencyRate = await prisma.currencyRate.update({
      where: { id },
      data: {
        ...(country && { country }),
        ...(currency && { currency }),
        ...(symbol && { symbol }),
        ...(rateToNPR && { rateToNPR }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({
      success: true,
      message: 'Currency rate updated successfully',
      data: currencyRate
    });
  } catch (error) {
    console.error('Error updating currency rate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update currency rate',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete currency rate
router.delete('/currency-rates/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.currencyRate.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Currency rate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting currency rate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete currency rate',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

