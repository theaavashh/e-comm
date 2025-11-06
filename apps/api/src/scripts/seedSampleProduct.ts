import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const prisma = new PrismaClient();

async function seedSampleProduct() {
  try {
    console.log('🌱 Seeding sample category and product...');

    // Ensure a sample category exists
    const categorySlug = 'sample-category';
    let category = (await prisma.$queryRawUnsafe<any[]>(
      'SELECT id, name, slug FROM "categories" WHERE slug = $1 LIMIT 1',
      categorySlug
    ))?.[0];

    if (!category) {
      const categoryId = randomUUID();
      await prisma.$executeRawUnsafe(
        'INSERT INTO "categories" (id, name, slug, image, "internalLink", "parentId", "isActive", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())',
        categoryId,
        'Sample Category',
        categorySlug,
        null,
        '/products',
        null
      );
      category = (await prisma.$queryRawUnsafe<any[]>(
        'SELECT id, name, slug FROM "categories" WHERE id = $1',
        categoryId
      ))?.[0];
      console.log('✅ Created category:', category);
    } else {
      console.log('ℹ️  Category exists:', category);
    }

    // Insert a sample product if not exists
    const productSlug = 'sample-product';
    const existing = (await prisma.$queryRawUnsafe<any[]>(
      'SELECT id FROM "products" WHERE slug = $1 LIMIT 1',
      productSlug
    ))?.[0];

    if (existing) {
      console.log('ℹ️  Sample product already exists:', existing.id);
      return;
    }

    const productId = randomUUID();
    await prisma.$executeRawUnsafe(
      `INSERT INTO "products" (
        id, name, slug, description, "shortDescription",
        price, "comparePrice", "costPrice", margin,
        sku, barcode, upc, ean, isbn,
        "trackQuantity", quantity, "lowStockThreshold", "allowBackorder", "manageStock",
        weight, "weightUnit", dimensions,
        images, videos, thumbnail,
        "seoTitle", "seoDescription", "seoKeywords", "metaTags",
        "ogImage", "canonicalUrl", "focusKeyword",
        "isActive", "isDigital", "isFeatured", "isNew", "isOnSale", "isBestSeller",
        visibility, "publishedAt",
        "categoryId", "subCategoryId", tags, "brandId",
        "requiresShipping", "shippingClass", "freeShipping",
        taxable, "taxClass",
        "customFields", notes,
        "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19,
        $20, $21, $22,
        $23, $24, $25,
        $26, $27, $28, $29,
        $30, $31, $32,
        $33, $34, $35, $36, $37, $38,
        $39::"ProductVisibility", $40,
        $41, $42, $43, $44,
        $45, $46, $47,
        $48, $49,
        $50, $51,
        NOW(), NOW()
      )`,
      productId,
      'Sample Product',
      productSlug,
      'This is a sample product for testing.',
      'Quick summary of the sample product.',
      999.99, // price
      null,   // comparePrice
      null,   // costPrice
      null,   // margin
      'SAMPLE-001', // sku
      null, // barcode
      null, // upc
      null, // ean
      null, // isbn
      true, // trackQuantity
      25,   // quantity
      5,    // lowStockThreshold
      false, // allowBackorder
      true, // manageStock
      null, // weight
      'kg', // weightUnit
      null, // dimensions
      ['http://localhost:3000/banner.jpg'], // images (text[])
      [],  // videos (text[])
      null, // thumbnail
      null, // seoTitle
      null, // seoDescription
      [],   // seoKeywords (text[])
      null, // metaTags (json)
      null, // ogImage
      null, // canonicalUrl
      null, // focusKeyword
      true, // isActive
      false, // isDigital
      true, // isFeatured
      true, // isNew
      false, // isOnSale
      false, // isBestSeller
      'VISIBLE', // visibility
      null, // publishedAt
      category.id, // categoryId
      null, // subCategoryId
      [],   // tags (text[])
      null, // brandId
      true, // requiresShipping
      null, // shippingClass
      false, // freeShipping
      true,  // taxable
      null,  // taxClass
      null,  // customFields (json)
      null   // notes
    );

    const product = (await prisma.$queryRawUnsafe<any[]>(
      'SELECT id, name, slug, price FROM "products" WHERE id = $1',
      productId
    ))?.[0];

    console.log('✅ Sample product created:', product);
  } catch (error) {
    console.error('❌ Error seeding sample product:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedSampleProduct().then(() => {
    console.log('🎉 Sample product seed completed');
  });
}

export default seedSampleProduct;




