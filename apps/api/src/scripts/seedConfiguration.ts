import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedConfiguration() {
  try {
    console.log('🌱 Seeding configuration data...');

    // Clear existing data
    await prisma.unit.deleteMany();
    await prisma.currencyRate.deleteMany();
    await prisma.systemConfig.deleteMany();

    // Seed units
    const units = [
      // Weight units
      { type: 'WEIGHT' as const, name: 'kg', isDefault: true, isActive: true },
      { type: 'WEIGHT' as const, name: 'g', isDefault: false, isActive: true },
      { type: 'WEIGHT' as const, name: 'lb', isDefault: false, isActive: true },
      { type: 'WEIGHT' as const, name: 'oz', isDefault: false, isActive: true },
      { type: 'WEIGHT' as const, name: 'ton', isDefault: false, isActive: true },
      
      // Length units
      { type: 'LENGTH' as const, name: 'cm', isDefault: true, isActive: true },
      { type: 'LENGTH' as const, name: 'm', isDefault: false, isActive: true },
      { type: 'LENGTH' as const, name: 'mm', isDefault: false, isActive: true },
      { type: 'LENGTH' as const, name: 'in', isDefault: false, isActive: true },
      { type: 'LENGTH' as const, name: 'ft', isDefault: false, isActive: true },
      { type: 'LENGTH' as const, name: 'yd', isDefault: false, isActive: true },
      
      // Clothing sizes
      { type: 'CLOTHING_SIZE' as const, name: 'XS', isDefault: false, isActive: true },
      { type: 'CLOTHING_SIZE' as const, name: 'S', isDefault: false, isActive: true },
      { type: 'CLOTHING_SIZE' as const, name: 'M', isDefault: true, isActive: true },
      { type: 'CLOTHING_SIZE' as const, name: 'L', isDefault: false, isActive: true },
      { type: 'CLOTHING_SIZE' as const, name: 'XL', isDefault: false, isActive: true },
      { type: 'CLOTHING_SIZE' as const, name: 'XXL', isDefault: false, isActive: true },
      { type: 'CLOTHING_SIZE' as const, name: 'XXXL', isDefault: false, isActive: true },
      
      // Volume units
      { type: 'VOLUME' as const, name: 'ml', isDefault: false, isActive: true },
      { type: 'VOLUME' as const, name: 'l', isDefault: false, isActive: true },
      { type: 'VOLUME' as const, name: 'gal', isDefault: false, isActive: true },
      { type: 'VOLUME' as const, name: 'qt', isDefault: false, isActive: true },
      { type: 'VOLUME' as const, name: 'pt', isDefault: false, isActive: true },
      { type: 'VOLUME' as const, name: 'cup', isDefault: false, isActive: true },
      
      // Temperature units
      { type: 'TEMPERATURE' as const, name: '°C', isDefault: false, isActive: true },
      { type: 'TEMPERATURE' as const, name: '°F', isDefault: false, isActive: true },
      { type: 'TEMPERATURE' as const, name: 'K', isDefault: false, isActive: true },
    ];

    await prisma.unit.createMany({
      data: units
    });

    // Seed currency rates
    const currencyRates = [
      {
        country: 'Nepal',
        currency: 'NPR',
        symbol: 'रू',
        rateToNPR: 1.0000,
        isActive: true
      },
      {
        country: 'United States',
        currency: 'USD',
        symbol: '$',
        rateToNPR: 133.5000,
        isActive: true
      },
      {
        country: 'India',
        currency: 'INR',
        symbol: '₹',
        rateToNPR: 1.6000,
        isActive: true
      },
      {
        country: 'United Kingdom',
        currency: 'GBP',
        symbol: '£',
        rateToNPR: 170.2500,
        isActive: true
      },
      {
        country: 'European Union',
        currency: 'EUR',
        symbol: '€',
        rateToNPR: 145.8000,
        isActive: true
      },
      {
        country: 'Japan',
        currency: 'JPY',
        symbol: '¥',
        rateToNPR: 0.9000,
        isActive: true
      },
      {
        country: 'Australia',
        currency: 'AUD',
        symbol: 'A$',
        rateToNPR: 88.5000,
        isActive: true
      },
      {
        country: 'Canada',
        currency: 'CAD',
        symbol: 'C$',
        rateToNPR: 98.7500,
        isActive: true
      }
    ];

    await prisma.currencyRate.createMany({
      data: currencyRates
    });

    // Seed system configuration
    const systemConfigs = [
      {
        key: 'defaultCurrency',
        value: 'NPR'
      },
      {
        key: 'siteName',
        value: 'Gharsamma E-commerce'
      },
      {
        key: 'siteDescription',
        value: 'Your trusted online shopping destination'
      }
    ];

    await prisma.systemConfig.createMany({
      data: systemConfigs
    });

    console.log('✅ Configuration data seeded successfully!');
    console.log(`📊 Created ${units.length} units`);
    console.log(`💰 Created ${currencyRates.length} currency rates`);
    console.log(`⚙️ Created ${systemConfigs.length} system configs`);

  } catch (error) {
    console.error('❌ Error seeding configuration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedConfiguration()
    .then(() => {
      console.log('🎉 Configuration seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Configuration seeding failed:', error);
      process.exit(1);
    });
}

export default seedConfiguration;






