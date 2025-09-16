import { Request, Response } from 'express';
import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

// Get all products with pagination and filters
export const getProducts = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    category,
    minPrice,
    maxPrice,
    search,
    isActive = 'true',
  } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where clause
    const where: any = {
      isActive: isActive === 'true',
    };

    if (category) {
      where.categoryId = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { sku: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              value: true,
              price: true,
              comparePrice: true,
              sku: true,
              barcode: true,
              quantity: true,
              weight: true,
              image: true,
            },
          },
          pricingTiers: {
            where: { isActive: true },
            orderBy: { minQuantity: 'asc' },
          },
          attributes: {
            orderBy: { sortOrder: 'asc' },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const ratings = product.reviews.map(review => review.rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0;

      return {
        ...product,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: product._count.reviews,
        reviews: undefined, // Remove reviews from response
        _count: undefined, // Remove _count from response
      };
    });

    const totalPages = Math.ceil(total / take);

    res.json({
      success: true,
      data: {
        products: productsWithRating,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
        },
      },
    });
  } catch (error) {
    logger.error('Get products error:', error);
    throw new AppError('Failed to fetch products', 500);
  }
};

// Get single product by ID or slug
export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            value: true,
            price: true,
            comparePrice: true,
            sku: true,
            barcode: true,
            quantity: true,
            weight: true,
            image: true,
          },
        },
        pricingTiers: {
          where: { isActive: true },
          orderBy: { minQuantity: 'asc' },
        },
        attributes: {
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Calculate average rating
    const ratings = product.reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;

    const productWithRating = {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: product._count.reviews,
      _count: undefined, // Remove _count from response
    };

    res.json({
      success: true,
      data: { product: productWithRating },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Get product error:', error);
    throw new AppError('Failed to fetch product', 500);
  }
};

// Create product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    shortDescription,
    price,
    comparePrice,
    costPrice,
    margin,
    sku,
    barcode,
    upc,
    ean,
    isbn,
    trackQuantity,
    quantity,
    lowStockThreshold,
    allowBackorder,
    manageStock,
    weight,
    weightUnit,
    dimensions,
    images,
    videos,
    thumbnail,
    seoTitle,
    seoDescription,
    seoKeywords,
    metaTags,
    isActive,
    isDigital,
    isFeatured,
    isNew,
    isOnSale,
    isBestSeller,
    visibility,
    publishedAt,
    categoryId,
    tags,
    brand,
    requiresShipping,
    shippingClass,
    freeShipping,
    taxable,
    taxClass,
    customFields,
    notes,
    pricingTiers,
    attributes,
  } = req.body;

  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      throw new AppError('A product with this name already exists', 409);
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        price,
        comparePrice,
        costPrice,
        margin,
        sku,
        barcode,
        upc,
        ean,
        isbn,
        trackQuantity,
        quantity,
        lowStockThreshold,
        allowBackorder,
        manageStock,
        weight,
        weightUnit,
        dimensions,
        images: images || [],
        videos: videos || [],
        thumbnail,
        seoTitle,
        seoDescription,
        seoKeywords: seoKeywords || [],
        metaTags,
        isActive: isActive ?? true,
        isDigital: isDigital ?? false,
        isFeatured: isFeatured ?? false,
        isNew: isNew ?? false,
        isOnSale: isOnSale ?? false,
        isBestSeller: isBestSeller ?? false,
        visibility: visibility || 'VISIBLE',
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        categoryId,
        tags: tags || [],
        brand,
        requiresShipping: requiresShipping ?? true,
        shippingClass,
        freeShipping: freeShipping ?? false,
        taxable: taxable ?? true,
        taxClass,
        customFields,
        notes,
        pricingTiers: pricingTiers ? {
          create: pricingTiers.map((tier: any) => ({
            minQuantity: tier.minQuantity,
            maxQuantity: tier.maxQuantity,
            price: tier.price,
            discount: tier.discount,
          }))
        } : undefined,
        attributes: attributes ? {
          create: attributes.map((attr: any) => ({
            name: attr.name,
            value: attr.value,
            type: attr.type || 'TEXT',
            isRequired: attr.isRequired || false,
            isFilterable: attr.isFilterable ?? true,
            sortOrder: attr.sortOrder || 0,
          }))
        } : undefined,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        pricingTiers: {
          where: { isActive: true },
          orderBy: { minQuantity: 'asc' },
        },
        attributes: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    logger.info('Product created', { productId: product.id, name: product.name });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Create product error:', error);
    throw new AppError('Failed to create product', 500);
  }
};

// Update product (Admin only)
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }

    // If name is being updated, generate new slug
    if (updateData.name && updateData.name !== existingProduct.name) {
      const slug = updateData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug already exists
      const slugExists = await prisma.product.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        throw new AppError('A product with this name already exists', 409);
      }

      updateData.slug = slug;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    logger.info('Product updated', { productId: product.id, name: product.name });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Update product error:', error);
    throw new AppError('Failed to update product', 500);
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Soft delete by setting isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    logger.info('Product deleted', { productId: id, name: product.name });

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Delete product error:', error);
    throw new AppError('Failed to delete product', 500);
  }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response) => {
  const { limit = 8 } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: Number(limit),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        pricingTiers: {
          where: { isActive: true },
          orderBy: { minQuantity: 'asc' },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const ratings = product.reviews.map(review => review.rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0;

      return {
        ...product,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: product._count.reviews,
        reviews: undefined,
        _count: undefined,
      };
    });

    res.json({
      success: true,
      data: { products: productsWithRating },
    });
  } catch (error) {
    logger.error('Get featured products error:', error);
    throw new AppError('Failed to fetch featured products', 500);
  }
};

// Get product pricing for specific quantity
export const getProductPricing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity = 1 } = req.query;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        pricingTiers: {
          where: { isActive: true },
          orderBy: { minQuantity: 'asc' },
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const qty = Number(quantity);
    let finalPrice = Number(product.price);
    let appliedTier = null;

    // Find the best pricing tier for the quantity
    for (const tier of product.pricingTiers) {
      if (qty >= tier.minQuantity && (!tier.maxQuantity || qty <= tier.maxQuantity)) {
        finalPrice = Number(tier.price);
        appliedTier = tier;
      }
    }

    // Calculate discount if applicable
    let discountAmount = 0;
    if (appliedTier?.discount) {
      discountAmount = (finalPrice * Number(appliedTier.discount)) / 100;
      finalPrice = finalPrice - discountAmount;
    }

    res.json({
      success: true,
      data: {
        productId: product.id,
        basePrice: Number(product.price),
        finalPrice,
        quantity: qty,
        appliedTier,
        discountAmount,
        savings: Number(product.price) - finalPrice,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Get product pricing error:', error);
    throw new AppError('Failed to get product pricing', 500);
  }
};

// Add pricing tier to product
export const addPricingTier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { minQuantity, maxQuantity, price, discount } = req.body;

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const pricingTier = await prisma.productPricingTier.create({
      data: {
        productId: id,
        minQuantity,
        maxQuantity,
        price,
        discount,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Pricing tier added successfully',
      data: { pricingTier },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Add pricing tier error:', error);
    throw new AppError('Failed to add pricing tier', 500);
  }
};

// Update pricing tier
export const updatePricingTier = async (req: Request, res: Response) => {
  const { id, tierId } = req.params;
  const updateData = req.body;

  try {
    const pricingTier = await prisma.productPricingTier.update({
      where: { id: tierId },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Pricing tier updated successfully',
      data: { pricingTier },
    });
  } catch (error) {
    logger.error('Update pricing tier error:', error);
    throw new AppError('Failed to update pricing tier', 500);
  }
};

// Delete pricing tier
export const deletePricingTier = async (req: Request, res: Response) => {
  const { tierId } = req.params;

  try {
    await prisma.productPricingTier.delete({
      where: { id: tierId },
    });

    res.json({
      success: true,
      message: 'Pricing tier deleted successfully',
    });
  } catch (error) {
    logger.error('Delete pricing tier error:', error);
    throw new AppError('Failed to delete pricing tier', 500);
  }
};

// Add product attribute
export const addProductAttribute = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, value, type, isRequired, isFilterable, sortOrder } = req.body;

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const attribute = await prisma.productAttribute.create({
      data: {
        productId: id,
        name,
        value,
        type: type || 'TEXT',
        isRequired: isRequired || false,
        isFilterable: isFilterable ?? true,
        sortOrder: sortOrder || 0,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product attribute added successfully',
      data: { attribute },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Add product attribute error:', error);
    throw new AppError('Failed to add product attribute', 500);
  }
};

// Update product attribute
export const updateProductAttribute = async (req: Request, res: Response) => {
  const { attributeId } = req.params;
  const updateData = req.body;

  try {
    const attribute = await prisma.productAttribute.update({
      where: { id: attributeId },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Product attribute updated successfully',
      data: { attribute },
    });
  } catch (error) {
    logger.error('Update product attribute error:', error);
    throw new AppError('Failed to update product attribute', 500);
  }
};

// Delete product attribute
export const deleteProductAttribute = async (req: Request, res: Response) => {
  const { attributeId } = req.params;

  try {
    await prisma.productAttribute.delete({
      where: { id: attributeId },
    });

    res.json({
      success: true,
      message: 'Product attribute deleted successfully',
    });
  } catch (error) {
    logger.error('Delete product attribute error:', error);
    throw new AppError('Failed to delete product attribute', 500);
  }
};
