const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSimple() {
  try {
    console.log('Testing simple database connection...');
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection test:', result);
    
    // Test brands table
    const brands = await prisma.brand.findMany();
    console.log('Brands found:', brands.length);
    
    // Test creating a brand
    const testBrand = await prisma.brand.create({
      data: {
        name: 'Test Brand ' + Date.now(),
        logo: 'https://example.com/logo.jpg',
        website: 'https://example.com'
      }
    });
    
    console.log('Test brand created:', testBrand);
    
    // Clean up
    await prisma.brand.delete({
      where: { id: testBrand.id }
    });
    
    console.log('Test brand deleted');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSimple();
