import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBanner() {
  try {
    // Create a sample banner similar to the image description
    const banner = await prisma.topBanner.create({
      data: {
        title: 'Free Delivery on orders over NPR.10000. Don\'t miss discount.',
        isActive: true,
      },
    });

    console.log('✅ Sample banner created successfully:', banner);
  } catch (error) {
    console.error('❌ Error creating banner:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBanner();


