import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function seedSampleProducts() {
  try {
    console.log('🌱 Seeding sample data (categories, brands, products)...');

    // Create categories
    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
      },
      {
        name: 'Food & Beverages',
        slug: 'food-beverages',
        description: 'Food items and drinks',
      },
    ];

    const createdCategories: any[] = [];
    for (const catData of categories) {
      let category = await prisma.category.findUnique({
        where: { slug: catData.slug },
      });

      if (!category) {
        category = await prisma.category.create({
          data: catData,
        });
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`ℹ️  Category exists: ${category.name}`);
      }
      createdCategories.push(category);
    }

    // Create brands
    const brands = [
      {
        name: 'TechBrand',
        logo: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=200&fit=crop',
        website: 'https://techbrand.com',
      },
      {
        name: 'FashionHouse',
        logo: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=200&fit=crop',
        website: 'https://fashionhouse.com',
      },
      {
        name: 'Organic Foods',
        logo: null,
        website: null,
      },
    ];

    const createdBrands: any[] = [];
    for (const brandData of brands) {
      let brand = await prisma.brand.findUnique({
        where: { name: brandData.name },
      });

      if (!brand) {
        brand = await prisma.brand.create({
          data: brandData,
        });
        console.log(`✅ Created brand: ${brand.name}`);
      } else {
        console.log(`ℹ️  Brand exists: ${brand.name}`);
      }
      createdBrands.push(brand);
    }

    // Create sample products
    const products = [
      {
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: '<p>High-quality wireless headphones with noise cancellation. Perfect for music lovers and professionals.</p>',
        shortDescription: 'Premium wireless headphones with active noise cancellation',
        price: 199.99,
        comparePrice: 249.99,
        costPrice: 120.00,
        margin: 39.95,
        sku: 'WH-BT-001',
        barcode: '1234567890123',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        quantity: 50,
        weight: 0.25,
        weightUnit: 'kg',
        dimensions: { length: 20, width: 18, height: 8, unit: 'cm' },
        isFeatured: true,
        isNew: true,
        categoryId: createdCategories[0].id,
        brandId: createdBrands[0].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 199.99,
            comparePrice: 249.99,
            minDeliveryDays: 3,
            maxDeliveryDays: 7,
          },
          {
            country: 'Australia',
            price: 299.99,
            comparePrice: 349.99,
            minDeliveryDays: 5,
            maxDeliveryDays: 10,
          },
        ],
        pricingTiers: [
          {
            minQuantity: 10,
            maxQuantity: 24,
            price: 189.99,
            discount: 5,
          },
          {
            minQuantity: 25,
            maxQuantity: null,
            price: 179.99,
            discount: 10,
          },
        ],
        attributes: [
          {
            name: 'Color',
            value: 'Black',
            type: 'COLOR',
            isFilterable: true,
            sortOrder: 1,
          },
          {
            name: 'Battery Life',
            value: '30 hours',
            type: 'TEXT',
            isFilterable: false,
            sortOrder: 2,
          },
        ],
        customFields: [
          {
            key: 'warranty',
            label: 'Warranty',
            content: '2 years manufacturer warranty',
            isVisible: true,
          },
        ],
        seoTitle: 'Wireless Bluetooth Headphones - Premium Audio',
        seoDescription: 'Experience superior sound quality with our wireless Bluetooth headphones featuring active noise cancellation.',
        seoKeywords: ['headphones', 'wireless', 'bluetooth', 'audio'],
        seo: {
          ogImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
          canonicalUrl: 'https://example.com/products/wireless-bluetooth-headphones',
          focusKeyword: 'wireless headphones',
        },
      },
      {
        name: 'Cotton T-Shirt',
        slug: 'cotton-t-shirt',
        description: '<p>Comfortable 100% cotton t-shirt. Perfect for everyday wear. Available in multiple colors.</p>',
        shortDescription: 'Comfortable 100% cotton t-shirt',
        price: 24.99,
        comparePrice: 29.99,
        sku: 'TS-COT-001',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        quantity: 100,
        weight: 0.15,
        weightUnit: 'kg',
        isOnSale: true,
        categoryId: createdCategories[1].id,
        brandId: createdBrands[1].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 24.99,
            comparePrice: 29.99,
            minDeliveryDays: 2,
            maxDeliveryDays: 5,
          },
        ],
        attributes: [
          {
            name: 'Size',
            value: 'M',
            type: 'SELECT',
            isFilterable: true,
            sortOrder: 1,
          },
          {
            name: 'Color',
            value: 'Blue',
            type: 'COLOR',
            isFilterable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        name: 'Organic Honey',
        slug: 'organic-honey',
        description: '<p>Pure organic honey sourced from local beekeepers. Natural, unfiltered, and full of flavor.</p>',
        shortDescription: 'Pure organic honey from local beekeepers',
        price: 15.99,
        sku: 'HNY-ORG-001',
        images: [
          'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
        quantity: 200,
        weight: 0.5,
        weightUnit: 'kg',
        isBestSeller: true,
        categoryId: createdCategories[2].id,
        brandId: createdBrands[2].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 15.99,
            minDeliveryDays: 1,
            maxDeliveryDays: 3,
          },
          {
            country: 'Australia',
            price: 29.99,
            minDeliveryDays: 7,
            maxDeliveryDays: 14,
          },
        ],
        attributes: [
          {
            name: 'Size',
            value: '500g',
            type: 'TEXT',
            isFilterable: true,
            sortOrder: 1,
          },
        ],
      },
      {
        name: 'Mango Pickle',
        slug: 'mango-pickle',
        description: '<p>Authentic homemade mango pickle with traditional spices. Perfect blend of sweet and tangy flavors.</p>',
        shortDescription: 'Authentic homemade mango pickle with traditional spices',
        price: 1200.00,
        sku: 'PKL-MNG-001',
        images: [
          'https://images.unsplash.com/photo-1615485500906-9b6c0b6b5b8b?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1615485500906-9b6c0b6b5b8b?w=500',
        quantity: 0,
        weight: 0.5,
        weightUnit: 'kg',
        isFeatured: true,
        categoryId: createdCategories[2].id,
        brandId: createdBrands[2].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 1200.00,
            minDeliveryDays: 2,
            maxDeliveryDays: 5,
          },
          {
            country: 'Australia',
            price: 24.99,
            minDeliveryDays: 7,
            maxDeliveryDays: 14,
          },
        ],
        attributes: [
          {
            name: 'Size',
            value: '500g',
            type: 'TEXT',
            isFilterable: true,
            sortOrder: 1,
          },
        ],
      },
      {
        name: 'Organic Honey (Watermelon)',
        slug: 'organic-honey-watermelon',
        description: '<p>Refreshing organic honey with natural watermelon flavor. Perfect for summer drinks and desserts.</p>',
        shortDescription: 'Refreshing organic honey with natural watermelon flavor',
        price: 29.99,
        sku: 'HNY-WTR-001',
        images: [
          'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
        quantity: 150,
        weight: 0.5,
        weightUnit: 'kg',
        isFeatured: true,
        isNew: true,
        categoryId: createdCategories[2].id,
        brandId: createdBrands[2].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 29.99,
            minDeliveryDays: 1,
            maxDeliveryDays: 3,
          },
          {
            country: 'Australia',
            price: 39.99,
            minDeliveryDays: 7,
            maxDeliveryDays: 14,
          },
        ],
        attributes: [
          {
            name: 'Size',
            value: '500g',
            type: 'TEXT',
            isFilterable: true,
            sortOrder: 1,
          },
          {
            name: 'Flavor',
            value: 'Watermelon',
            type: 'TEXT',
            isFilterable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        name: 'Smartphone Pro Max',
        slug: 'smartphone-pro-max',
        description: '<p>Latest generation smartphone with advanced camera system, powerful processor, and all-day battery life.</p>',
        shortDescription: 'Latest generation smartphone with advanced features',
        price: 899.99,
        comparePrice: 1099.99,
        costPrice: 600.00,
        margin: 33.33,
        sku: 'PHN-PRO-001',
        barcode: '1234567890124',
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        quantity: 30,
        weight: 0.2,
        weightUnit: 'kg',
        dimensions: { length: 15, width: 7, height: 1, unit: 'cm' },
        isFeatured: true,
        isNew: true,
        categoryId: createdCategories[0].id,
        brandId: createdBrands[0].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 899.99,
            comparePrice: 1099.99,
            minDeliveryDays: 5,
            maxDeliveryDays: 10,
          },
          {
            country: 'Australia',
            price: 1299.99,
            comparePrice: 1499.99,
            minDeliveryDays: 7,
            maxDeliveryDays: 14,
          },
        ],
        attributes: [
          {
            name: 'Color',
            value: 'Space Gray',
            type: 'COLOR',
            isFilterable: true,
            sortOrder: 1,
          },
          {
            name: 'Storage',
            value: '256GB',
            type: 'SELECT',
            isFilterable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        name: 'Laptop Ultra',
        slug: 'laptop-ultra',
        description: '<p>High-performance laptop with stunning display, fast SSD storage, and long battery life. Perfect for work and play.</p>',
        shortDescription: 'High-performance laptop with stunning display',
        price: 1299.99,
        comparePrice: 1599.99,
        costPrice: 900.00,
        margin: 30.77,
        sku: 'LPT-ULT-001',
        barcode: '1234567890125',
        images: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        quantity: 25,
        weight: 1.5,
        weightUnit: 'kg',
        dimensions: { length: 30, width: 21, height: 2, unit: 'cm' },
        isFeatured: true,
        categoryId: createdCategories[0].id,
        brandId: createdBrands[0].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 1299.99,
            comparePrice: 1599.99,
            minDeliveryDays: 7,
            maxDeliveryDays: 14,
          },
          {
            country: 'Australia',
            price: 1899.99,
            comparePrice: 2199.99,
            minDeliveryDays: 10,
            maxDeliveryDays: 20,
          },
        ],
        attributes: [
          {
            name: 'Screen Size',
            value: '15.6 inch',
            type: 'TEXT',
            isFilterable: true,
            sortOrder: 1,
          },
          {
            name: 'RAM',
            value: '16GB',
            type: 'SELECT',
            isFilterable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        name: 'Designer Jeans',
        slug: 'designer-jeans',
        description: '<p>Premium quality designer jeans with perfect fit and comfortable stretch fabric. Available in multiple sizes.</p>',
        shortDescription: 'Premium quality designer jeans with perfect fit',
        price: 79.99,
        comparePrice: 99.99,
        sku: 'JNS-DSG-001',
        images: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        quantity: 75,
        weight: 0.4,
        weightUnit: 'kg',
        isOnSale: true,
        isFeatured: true,
        categoryId: createdCategories[1].id,
        brandId: createdBrands[1].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 79.99,
            comparePrice: 99.99,
            minDeliveryDays: 3,
            maxDeliveryDays: 7,
          },
          {
            country: 'Australia',
            price: 119.99,
            comparePrice: 149.99,
            minDeliveryDays: 5,
            maxDeliveryDays: 10,
          },
        ],
        attributes: [
          {
            name: 'Size',
            value: '32',
            type: 'SELECT',
            isFilterable: true,
            sortOrder: 1,
          },
          {
            name: 'Color',
            value: 'Blue',
            type: 'COLOR',
            isFilterable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: '<p>Comfortable running shoes with excellent cushioning and breathable material. Perfect for daily workouts.</p>',
        shortDescription: 'Comfortable running shoes for daily workouts',
        price: 89.99,
        comparePrice: 129.99,
        sku: 'SHO-RUN-001',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        quantity: 60,
        weight: 0.6,
        weightUnit: 'kg',
        isOnSale: true,
        isNew: true,
        categoryId: createdCategories[1].id,
        brandId: createdBrands[1].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 89.99,
            comparePrice: 129.99,
            minDeliveryDays: 3,
            maxDeliveryDays: 7,
          },
          {
            country: 'Australia',
            price: 139.99,
            comparePrice: 179.99,
            minDeliveryDays: 5,
            maxDeliveryDays: 10,
          },
        ],
        attributes: [
          {
            name: 'Size',
            value: '9',
            type: 'SELECT',
            isFilterable: true,
            sortOrder: 1,
          },
          {
            name: 'Color',
            value: 'Black',
            type: 'COLOR',
            isFilterable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        name: 'Fresh Vegetables Pack',
        slug: 'fresh-vegetables-pack',
        description: '<p>Fresh organic vegetables pack containing seasonal produce. Perfect for healthy meals and cooking.</p>',
        shortDescription: 'Fresh organic vegetables pack with seasonal produce',
        price: 19.99,
        sku: 'VEG-FRS-001',
        images: [
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
        quantity: 100,
        weight: 2.0,
        weightUnit: 'kg',
        isBestSeller: true,
        categoryId: createdCategories[2].id,
        brandId: createdBrands[2].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 19.99,
            minDeliveryDays: 1,
            maxDeliveryDays: 2,
          },
          {
            country: 'Australia',
            price: 34.99,
            minDeliveryDays: 3,
            maxDeliveryDays: 7,
          },
        ],
        attributes: [
          {
            name: 'Weight',
            value: '2kg',
            type: 'TEXT',
            isFilterable: true,
            sortOrder: 1,
          },
        ],
      },
      {
        name: 'Coffee Beans Premium',
        slug: 'coffee-beans-premium',
        description: '<p>Premium roasted coffee beans with rich aroma and smooth taste. Perfect for coffee enthusiasts.</p>',
        shortDescription: 'Premium roasted coffee beans with rich aroma',
        price: 34.99,
        comparePrice: 44.99,
        sku: 'CFB-PRM-001',
        images: [
          'https://images.unsplash.com/photo-1559056199-641a0ce8b553?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1559056199-641a0ce8b553?w=500',
        quantity: 80,
        weight: 0.5,
        weightUnit: 'kg',
        isFeatured: true,
        categoryId: createdCategories[2].id,
        brandId: createdBrands[2].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 34.99,
            comparePrice: 44.99,
            minDeliveryDays: 2,
            maxDeliveryDays: 5,
          },
          {
            country: 'Australia',
            price: 49.99,
            comparePrice: 59.99,
            minDeliveryDays: 5,
            maxDeliveryDays: 10,
          },
        ],
        attributes: [
          {
            name: 'Roast Level',
            value: 'Medium',
            type: 'SELECT',
            isFilterable: true,
            sortOrder: 1,
          },
        ],
      },
      {
        name: 'Smart Watch',
        slug: 'smart-watch',
        description: '<p>Feature-rich smartwatch with fitness tracking, heart rate monitor, and smartphone connectivity.</p>',
        shortDescription: 'Feature-rich smartwatch with fitness tracking',
        price: 249.99,
        comparePrice: 299.99,
        costPrice: 150.00,
        margin: 40.00,
        sku: 'WCH-SMT-001',
        barcode: '1234567890126',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        quantity: 40,
        weight: 0.1,
        weightUnit: 'kg',
        isFeatured: true,
        isNew: true,
        categoryId: createdCategories[0].id,
        brandId: createdBrands[0].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 249.99,
            comparePrice: 299.99,
            minDeliveryDays: 4,
            maxDeliveryDays: 8,
          },
          {
            country: 'Australia',
            price: 349.99,
            comparePrice: 399.99,
            minDeliveryDays: 7,
            maxDeliveryDays: 14,
          },
        ],
        attributes: [
          {
            name: 'Color',
            value: 'Black',
            type: 'COLOR',
            isFilterable: true,
            sortOrder: 1,
          },
          {
            name: 'Size',
            value: '42mm',
            type: 'SELECT',
            isFilterable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        name: 'Winter Jacket',
        slug: 'winter-jacket',
        description: '<p>Warm and stylish winter jacket with water-resistant fabric. Perfect for cold weather and outdoor activities.</p>',
        shortDescription: 'Warm and stylish winter jacket',
        price: 149.99,
        comparePrice: 199.99,
        sku: 'JKT-WNT-001',
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        quantity: 45,
        weight: 0.8,
        weightUnit: 'kg',
        isOnSale: true,
        isFeatured: true,
        categoryId: createdCategories[1].id,
        brandId: createdBrands[1].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 149.99,
            comparePrice: 199.99,
            minDeliveryDays: 4,
            maxDeliveryDays: 8,
          },
          {
            country: 'Australia',
            price: 229.99,
            comparePrice: 279.99,
            minDeliveryDays: 7,
            maxDeliveryDays: 14,
          },
        ],
        attributes: [
          {
            name: 'Size',
            value: 'L',
            type: 'SELECT',
            isFilterable: true,
            sortOrder: 1,
          },
          {
            name: 'Color',
            value: 'Navy Blue',
            type: 'COLOR',
            isFilterable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        name: 'Tablet Pro',
        slug: 'tablet-pro',
        description: '<p>High-performance tablet with large display, fast processor, and long battery life. Perfect for work and entertainment.</p>',
        shortDescription: 'High-performance tablet with large display',
        price: 599.99,
        comparePrice: 749.99,
        costPrice: 400.00,
        margin: 33.33,
        sku: 'TBL-PRO-001',
        barcode: '1234567890127',
        images: [
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
        quantity: 35,
        weight: 0.5,
        weightUnit: 'kg',
        isFeatured: true,
        isNew: true,
        categoryId: createdCategories[0].id,
        brandId: createdBrands[0].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 599.99,
            comparePrice: 749.99,
            minDeliveryDays: 6,
            maxDeliveryDays: 12,
          },
          {
            country: 'Australia',
            price: 899.99,
            comparePrice: 1099.99,
            minDeliveryDays: 10,
            maxDeliveryDays: 20,
          },
        ],
        attributes: [
          {
            name: 'Screen Size',
            value: '10.9 inch',
            type: 'TEXT',
            isFilterable: true,
            sortOrder: 1,
          },
          {
            name: 'Storage',
            value: '128GB',
            type: 'SELECT',
            isFilterable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        name: 'Casual Sneakers',
        slug: 'casual-sneakers',
        description: '<p>Stylish and comfortable casual sneakers perfect for everyday wear. Available in multiple colors.</p>',
        shortDescription: 'Stylish and comfortable casual sneakers',
        price: 69.99,
        comparePrice: 89.99,
        sku: 'SHO-CAS-001',
        images: [
          'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500',
        quantity: 90,
        weight: 0.5,
        weightUnit: 'kg',
        isOnSale: true,
        isNew: true,
        categoryId: createdCategories[1].id,
        brandId: createdBrands[1].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 69.99,
            comparePrice: 89.99,
            minDeliveryDays: 3,
            maxDeliveryDays: 7,
          },
          {
            country: 'Australia',
            price: 109.99,
            comparePrice: 139.99,
            minDeliveryDays: 5,
            maxDeliveryDays: 10,
          },
        ],
        attributes: [
          {
            name: 'Size',
            value: '8',
            type: 'SELECT',
            isFilterable: true,
            sortOrder: 1,
          },
          {
            name: 'Color',
            value: 'White',
            type: 'COLOR',
            isFilterable: true,
            sortOrder: 2,
          },
        ],
      },
      {
        name: 'Organic Tea Collection',
        slug: 'organic-tea-collection',
        description: '<p>Premium organic tea collection with various flavors. Includes green tea, black tea, and herbal blends.</p>',
        shortDescription: 'Premium organic tea collection with various flavors',
        price: 24.99,
        comparePrice: 34.99,
        sku: 'TEA-ORG-001',
        images: [
          'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
        quantity: 120,
        weight: 0.3,
        weightUnit: 'kg',
        isBestSeller: true,
        isFeatured: true,
        categoryId: createdCategories[2].id,
        brandId: createdBrands[2].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 24.99,
            comparePrice: 34.99,
            minDeliveryDays: 2,
            maxDeliveryDays: 5,
          },
          {
            country: 'Australia',
            price: 39.99,
            comparePrice: 49.99,
            minDeliveryDays: 5,
            maxDeliveryDays: 10,
          },
        ],
        attributes: [
          {
            name: 'Flavor',
            value: 'Mixed',
            type: 'SELECT',
            isFilterable: true,
            sortOrder: 1,
          },
        ],
      },
      {
        name: 'Wireless Earbuds',
        slug: 'wireless-earbuds',
        description: '<p>True wireless earbuds with noise cancellation, long battery life, and crystal clear sound quality.</p>',
        shortDescription: 'True wireless earbuds with noise cancellation',
        price: 129.99,
        comparePrice: 179.99,
        costPrice: 80.00,
        margin: 38.46,
        sku: 'EBD-WLS-001',
        barcode: '1234567890128',
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
        quantity: 55,
        weight: 0.05,
        weightUnit: 'kg',
        isFeatured: true,
        isNew: true,
        categoryId: createdCategories[0].id,
        brandId: createdBrands[0].id,
        currencyPrices: [
          {
            country: 'Nepal',
            price: 129.99,
            comparePrice: 179.99,
            minDeliveryDays: 3,
            maxDeliveryDays: 7,
          },
          {
            country: 'Australia',
            price: 199.99,
            comparePrice: 249.99,
            minDeliveryDays: 5,
            maxDeliveryDays: 10,
          },
        ],
        attributes: [
          {
            name: 'Color',
            value: 'White',
            type: 'COLOR',
            isFilterable: true,
            sortOrder: 1,
          },
        ],
      },
    ];

    for (const productData of products) {
      // Check if product already exists by slug
      let existing = await prisma.product.findUnique({
        where: { slug: productData.slug },
      });

      // If not found by slug, check by SKU if provided
      if (!existing && productData.sku) {
        existing = await prisma.product.findUnique({
          where: { sku: productData.sku },
        });
      }

      if (existing) {
        console.log(`⏭️  Product already exists: ${productData.name} (${existing.slug || existing.sku || 'N/A'})`);
        continue;
      }

      // Extract nested data
      const { currencyPrices, pricingTiers, attributes, customFields, seo, ...baseData } = productData;

      // Create product
      const product = await prisma.product.create({
        data: {
          ...baseData,
          pricingTiers: pricingTiers
            ? {
                create: pricingTiers.map((tier: any) => ({
                  minQuantity: tier.minQuantity,
                  maxQuantity: tier.maxQuantity,
                  price: tier.price,
                  discount: tier.discount,
                })),
              }
            : undefined,
          attributes: attributes
            ? {
                create: attributes.map((attr: any) => ({
                  name: attr.name,
                  value: attr.value,
                  type: attr.type || 'TEXT',
                  isRequired: attr.isRequired || false,
                  isFilterable: attr.isFilterable ?? true,
                  sortOrder: attr.sortOrder || 0,
                })),
              }
            : undefined,
          customFields: customFields || undefined,
          ogImage: seo?.ogImage || undefined,
          canonicalUrl: seo?.canonicalUrl || undefined,
          focusKeyword: seo?.focusKeyword || undefined,
        },
      });

      // Create currency prices
      if (currencyPrices && currencyPrices.length > 0) {
        await prisma.productCurrencyPrice.createMany({
          data: currencyPrices.map((cp: any) => ({
            productId: product.id,
            country: cp.country,
            price: cp.price,
            comparePrice: cp.comparePrice || null,
            minDeliveryDays: cp.minDeliveryDays || 1,
            maxDeliveryDays: cp.maxDeliveryDays || 7,
            isActive: true,
          })),
        });
      }

      console.log(`✅ Created product: ${product.name} (SKU: ${product.sku || 'N/A'}, Slug: ${product.slug})`);
    }

    console.log('🎉 Sample data seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this file is executed directly
seedSampleProducts()
  .then(() => {
    console.log('✅ Seed script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });

export default seedSampleProducts;
