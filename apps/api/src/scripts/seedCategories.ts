import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

interface CategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  internalLink?: string;
  children?: CategoryData[];
}

const categories: CategoryData[] = [
  {
    name: 'Foods',
    slug: 'foods',
    description: 'Traditional Nepali foods, pickles, and spices',
    internalLink: '/foods',
    children: [
      {
        name: 'Veg Achar',
        slug: 'veg-achar',
        description: 'Vegetarian pickles and preserves',
        internalLink: '/foods/veg-achar',
      },
      {
        name: 'Non-Veg Achar',
        slug: 'non-veg-achar',
        description: 'Non-vegetarian pickles and preserves',
        internalLink: '/foods/non-veg-achar',
      },
    ],
  },
  {
    name: 'Dress',
    slug: 'dress',
    description: 'Traditional and modern Nepali dresses',
    internalLink: '/products/dress',
    children: [
      {
        name: 'Sari',
        slug: 'sari',
        description: 'Traditional Nepali sari collection',
        internalLink: '/products/dress/sari',
      },
      {
        name: 'Lehenga',
        slug: 'lehenga',
        description: 'Beautiful lehenga collection',
        internalLink: '/products/dress/lehenga',
      },
      {
        name: 'Gown',
        slug: 'gown',
        description: 'Elegant gown collection',
        internalLink: '/products/dress/gown',
      },
    ],
  },
  {
    name: 'Puja Samagri',
    slug: 'puja-samagri',
    description: 'Religious items and puja materials',
    internalLink: '/products/puja-samagri',
    children: [
      {
        name: 'Rudrakshya',
        slug: 'rudrakshya',
        description: 'Rudrakshya beads and malas',
        internalLink: '/products/puja-samagri/rudrakshya',
      },
      {
        name: 'Singing Bowl',
        slug: 'singing-bowl',
        description: 'Tibetan singing bowls',
        internalLink: '/products/puja-samagri/singing-bowl',
      },
      {
        name: 'Statue',
        slug: 'statue',
        description: 'Religious statues and idols',
        internalLink: '/products/puja-samagri/statue',
      },
    ],
  },
  {
    name: 'Tea',
    slug: 'tea',
    description: 'Premium Nepali tea collection',
    internalLink: '/products/tea',
  },
  {
    name: 'Masala',
    slug: 'masala',
    description: 'Traditional spices and masala blends',
    internalLink: '/products/masala',
  },
  {
    name: 'Cultural Items',
    slug: 'cultural',
    description: 'Traditional Nepali cultural items',
    internalLink: '/products/cultural',
    children: [
      {
        name: 'Khukuri',
        slug: 'khukuri',
        description: 'Traditional Nepali khukuri knives',
        internalLink: '/products/cultural/khukuri',
      },
      {
        name: 'Metal Handicraft',
        slug: 'metal-handicraft',
        description: 'Handcrafted metal items',
        internalLink: '/products/cultural/metal-handicraft',
      },
    ],
  },
  {
    name: 'Pashmina',
    slug: 'pashmina',
    description: 'Luxurious pashmina shawls and accessories',
    internalLink: '/products/pashmina',
  },
  {
    name: 'Carpet',
    slug: 'carpet',
    description: 'Handwoven Nepali carpets and rugs',
    internalLink: '/products/carpet',
  },
  {
    name: 'Woven Items',
    slug: 'woven',
    description: 'Traditional woven textiles and fabrics',
    internalLink: '/products/woven',
  },
  {
    name: 'Jewellery',
    slug: 'jewellery',
    description: 'Traditional and modern Nepali jewellery',
    internalLink: '/products/jewellery',
  },
  {
    name: 'Achar',
    slug: 'achar',
    description: 'Various types of pickles and preserves',
    internalLink: '/products/achar',
  },
];

async function seedCategories() {
  try {
    console.log('🌱 Starting category seed...');

    for (const categoryData of categories) {
      // Check if category already exists
      const existingCategory = await prisma.category.findUnique({
        where: { slug: categoryData.slug },
      });

      if (existingCategory) {
        console.log(`⏭️  Category "${categoryData.name}" already exists, skipping...`);
        
        // Update children if they exist
        if (categoryData.children && categoryData.children.length > 0) {
          for (const childData of categoryData.children) {
            const existingChild = await prisma.category.findUnique({
              where: { slug: childData.slug },
            });

            if (!existingChild) {
              await prisma.category.create({
                data: {
                  name: childData.name,
                  slug: childData.slug,
                  description: childData.description,
                  internalLink: childData.internalLink,
                  parentId: existingCategory.id,
                  isActive: true,
                },
              });
              console.log(`  ✅ Created subcategory: ${childData.name}`);
            } else {
              console.log(`  ⏭️  Subcategory "${childData.name}" already exists, skipping...`);
            }
          }
        }
        continue;
      }

      // Create main category
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          image: categoryData.image,
          internalLink: categoryData.internalLink,
          isActive: true,
        },
      });

      console.log(`✅ Created category: ${categoryData.name}`);

      // Create subcategories if they exist
      if (categoryData.children && categoryData.children.length > 0) {
        for (const childData of categoryData.children) {
          const existingChild = await prisma.category.findUnique({
            where: { slug: childData.slug },
          });

          if (!existingChild) {
            await prisma.category.create({
              data: {
                name: childData.name,
                slug: childData.slug,
                description: childData.description,
                internalLink: childData.internalLink,
                parentId: category.id,
                isActive: true,
              },
            });
            console.log(`  ✅ Created subcategory: ${childData.name}`);
          } else {
            console.log(`  ⏭️  Subcategory "${childData.name}" already exists, skipping...`);
          }
        }
      }
    }

    console.log('🎉 Category seed completed successfully');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this file is executed directly
seedCategories()
  .then(() => {
    console.log('✅ All categories seeded successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Category seed failed:', error);
    process.exit(1);
  });

export default seedCategories;

