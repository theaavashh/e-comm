import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearConfiguration() {
  try {
    console.log('🧹 Clearing configuration data...');

    // Clear all configuration data
    await prisma.unit.deleteMany();
    await prisma.currencyRate.deleteMany();
    await prisma.systemConfig.deleteMany();

    console.log('✅ Configuration data cleared successfully!');
    console.log('📊 All units, currency rates, and system configs removed');
    console.log('🎉 You can now start fresh with the admin panel!');

  } catch (error) {
    console.error('❌ Error clearing configuration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the clear function
if (require.main === module) {
  clearConfiguration()
    .then(() => {
      console.log('🎉 Configuration clearing completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Configuration clearing failed:', error);
      process.exit(1);
    });
}

export default clearConfiguration;







