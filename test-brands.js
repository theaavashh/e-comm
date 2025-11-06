const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBrands() {
  try {
    console.log('Testing brands database connection...');
    
    // Test basic connection
    const brands = await prisma.brand.findMany({
      take: 5,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });
    
    console.log('Brands found:', brands.length);
    console.log('Brands:', brands);
    
    // Test creating a brand
    const testBrand = await prisma.brand.create({
      data: {
        name: 'Test Brand ' + Date.now(),
        slug: 'test-brand-' + Date.now(),
        isActive: true,
        sortOrder: 0
      }
    });
    
    console.log('Test brand created:', testBrand);
    
    // Clean up
    await prisma.brand.delete({
      where: { id: testBrand.id }
    });
    
    console.log('Test brand deleted');
    
  } catch (error) {
    console.error('Error testing brands:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBrands();

