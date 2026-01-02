import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createBlackFridayBanner() {
  try {
    // First, deactivate all existing banners
    await prisma.topBanner.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create the new Black Friday banner
    const banner = await prisma.topBanner.create({
      data: {
        title: '<span style="color: white; font-weight: bold;">BLACK FRIDAY SALES AND FREE WORLDWIDE SHIPPING</span>',
        isActive: true,
      },
    });

    console.log('Successfully created Black Friday banner:');
    console.log(banner);
  } catch (error) {
    console.error('Error creating Black Friday banner:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createBlackFridayBanner();