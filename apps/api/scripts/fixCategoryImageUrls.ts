import { PrismaClient } from '@prisma/client';
import { env } from '../src/config/env';

const prisma = new PrismaClient();

async function fixCategoryImageUrls() {
  try {
    console.log('Fetching categories with image URLs...');
    
    // Get all categories that have images
    const categories = await prisma.category.findMany({
      where: {
        image: {
          not: null,
        },
      },
    });

    console.log(`Found ${categories.length} categories with images`);

    let updatedCount = 0;

    for (const category of categories) {
      if (category.image && category.image.includes('localhost:5000')) {
        // Replace port 5000 with the correct port
        const correctedImageUrl = category.image.replace('localhost:5000', `localhost:${env.PORT}`);
        
        console.log(`Updating category ${category.id}:`);
        console.log(`  From: ${category.image}`);
        console.log(`  To:   ${correctedImageUrl}`);

        // Update the category with the corrected URL
        await prisma.category.update({
          where: { id: category.id },
          data: { image: correctedImageUrl },
        });

        updatedCount++;
      }
    }

    console.log(`\nUpdated ${updatedCount} category image URLs`);
    console.log(`All category image URLs now use port ${env.PORT}`);
  } catch (error) {
    console.error('Error fixing category image URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCategoryImageUrls();