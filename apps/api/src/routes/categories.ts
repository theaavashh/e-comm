import { Router, Request, Response } from 'express';
import prisma from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/errorHandler';
import { z } from 'zod';

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  image: z.string().optional().nullable(),
  internalLink: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  disclaimer: z.string().optional().nullable(),
  additionalDetails: z.string().optional().nullable(),
  howToCare: z.string().optional().nullable(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional().nullable(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).optional(),
  image: z.string().optional().nullable(),
  internalLink: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  disclaimer: z.string().optional().nullable(),
  additionalDetails: z.string().optional().nullable(),
  howToCare: z.string().optional().nullable(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional().nullable(),
  isActive: z.boolean().optional(),
});

const router = Router();

// Get all categories with subcategories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { includeInactive } = req.query;
    const isActive = includeInactive !== 'true';

    const categories = await prisma.category.findMany({
      where: {
        isActive,
        parentId: null, // Only main categories
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          where: {
            isActive: true,
          },
          orderBy: {
            name: 'asc',
          },
          include: {
            _count: {
              select: {
                products: true,
              },
            },
            children: {
              where: {
                isActive: true,
              },
              orderBy: {
                name: 'asc',
              },
              include: {
                _count: {
                  select: {
                    products: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    logger.error('Get categories error:', error);
    // Be resilient: return an empty list instead of 500 to avoid breaking the admin UI
    return res.status(200).json({
      success: true,
      data: { categories: [] },
    });
  }
};

// Get single category by ID or slug
export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { id },
          { slug: id } // Support both ID and slug
        ],
        isActive: true
      },
      include: {
        children: {
          where: {
            isActive: true,
          },
          orderBy: {
            name: 'asc',
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    res.json({
      success: true,
      data: { category },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Get category error:', error);
    throw new AppError('Failed to fetch category', 500);
  }
};

// Create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = createCategorySchema.parse(req.body);
    const { name, image, internalLink, parentId, disclaimer, additionalDetails, howToCare, faqs } = validatedData;

    logger.info('Creating category:', { name, parentId });

    // Generate slug from name
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // If parentId is provided, append parent info to make slug unique
    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        throw new AppError('Parent category not found', 404);
      }

      // Create unique slug by appending parent slug
      const parentSlug = parent.slug;
      slug = `${parentSlug}-${slug}`;
    }

    // Check if category with same name already exists (only for active categories)
    const existingActiveCategory = await prisma.category.findFirst({
      where: {
        name: name,
        isActive: true,
        parentId: parentId || null, // Only check within same parent level
      },
    });

    if (existingActiveCategory) {
      const conflictType = parentId ? 'subcategory' : 'category';
      logger.error('Name conflict detected:', {
        newName: name,
        existingCategoryId: existingActiveCategory.id,
        existingCategoryName: existingActiveCategory.name,
        newSlug: slug,
        existingSlug: existingActiveCategory.slug
      });
      throw new AppError(`A ${conflictType} with the name "${name}" already exists. Please use a different name.`, 409);
    }

    // If an inactive category with the same slug exists, make the slug unique by appending timestamp
    const existingInactiveCategory = await prisma.category.findFirst({
      where: { slug },
    });

    if (existingInactiveCategory && !existingInactiveCategory.isActive) {
      slug = `${slug}-${Date.now()}`;
    }

    const categoryData: any = {
      name,
      slug,
      image: image || null,
      internalLink: internalLink || null,
      parentId: parentId || null,
      disclaimer: disclaimer || null,
      additionalDetails: additionalDetails || null,
      howToCare: howToCare || null,
      faqs: faqs || null,
      isActive: true,
    };

    logger.info('Creating category with data:', categoryData);

    const category = await prisma.category.create({
      data: categoryData,
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: { where: { isActive: true }, orderBy: { name: 'asc' } },
      },
    });

    logger.info('Category created successfully', { categoryId: category.id, name: category.name, slug: category.slug });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      logger.error('Validation error in create category:', error.errors);
      throw new AppError(`Validation error: ${error.errors[0].message}`, 400);
    }
    
    logger.error('Create category error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      payload: req.body,
      prismaError: error instanceof Error ? (error as any).code : undefined,
      meta: error instanceof Error ? (error as any).meta : undefined
    });
    
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError('Failed to create category', 500);
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Validate input
    const validatedData = updateCategorySchema.parse(req.body);

    logger.info('Update category request data:', { id, validatedData });

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new AppError('Category not found', 404);
    }

    // Build update payload
    const updatePayload: any = {};
    
    if (validatedData.name !== undefined) {
      updatePayload.name = validatedData.name;
      // If name is being updated, generate new slug
      let newSlug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // If this is a subcategory, append parent slug
      if (existingCategory.parentId) {
        const parent = await prisma.category.findUnique({
          where: { id: existingCategory.parentId },
        });
        if (parent) {
          newSlug = `${parent.slug}-${newSlug}`;
        }
      }

      // Check if new slug already exists (only for active categories, excluding current category)
      const slugExists = await prisma.category.findFirst({
        where: {
          slug: newSlug,
          id: { not: id },
          isActive: true,
        },
      });

      if (slugExists) {
        throw new AppError('A category with this name already exists', 409);
      }

      updatePayload.slug = newSlug;
    }
    
    if (validatedData.image !== undefined) updatePayload.image = validatedData.image;
    if (validatedData.internalLink !== undefined) updatePayload.internalLink = validatedData.internalLink;
    if (validatedData.parentId !== undefined) updatePayload.parentId = validatedData.parentId;
    if (validatedData.isActive !== undefined) updatePayload.isActive = validatedData.isActive;
    if (validatedData.disclaimer !== undefined) updatePayload.disclaimer = validatedData.disclaimer;
    if (validatedData.additionalDetails !== undefined) updatePayload.additionalDetails = validatedData.additionalDetails;
    if (validatedData.howToCare !== undefined) updatePayload.howToCare = validatedData.howToCare;
    if (validatedData.faqs !== undefined) updatePayload.faqs = validatedData.faqs;

    const category = await prisma.category.update({
      where: { id },
      data: updatePayload,
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: { where: { isActive: true }, orderBy: { name: 'asc' } },
      },
    });

    logger.info('Category updated', { categoryId: category.id, name: category.name });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category },
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      logger.error('Validation error in update category:', error.errors);
      throw new AppError(`Validation error: ${error.errors[0].message}`, 400);
    }
    
    if (error instanceof AppError) {
      throw error;
    }
    
    logger.error('Update category error:', error);
    throw new AppError('Failed to update category', 500);
  }
};

// Delete category (soft delete)
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if category has active products
    const productCount = await prisma.product.count({
      where: {
        OR: [
          { categoryId: id },
          { subCategoryId: id }
        ],
        isActive: true,
      },
    });

    if (productCount > 0) {
      throw new AppError('Cannot delete category with existing products', 400);
    }

    // Check if category has subcategories
    const subcategories = await prisma.category.findMany({ where: { parentId: id } });

    // If there are subcategories, delete them first
    if (subcategories.length > 0) {
      // Check if any subcategories have active products
      for (const subcategory of subcategories) {
        const subcategoryProductCount = await prisma.product.count({
          where: {
            OR: [
              { categoryId: subcategory.id },
              { subCategoryId: subcategory.id }
            ],
            isActive: true,
          },
        });

        if (subcategoryProductCount > 0) {
          throw new AppError(`Cannot delete category. Subcategory "${subcategory.name}" has ${subcategoryProductCount} products. Please remove products first.`, 400);
        }
      }

      // Soft delete all subcategories first
      await prisma.category.updateMany({
        where: { parentId: id },
        data: { isActive: false }
      });

      logger.info('Subcategories deleted', {
        categoryId: id,
        subcategoryCount: subcategories.length,
        subcategoryNames: subcategories.map(s => s.name)
      });
    }

    // Soft delete by setting isActive to false
    await prisma.category.update({
      where: { id },
      data: { isActive: false }
    });

    logger.info('Category deleted', { categoryId: id, name: category.name });

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Delete category error:', error);
    throw new AppError('Failed to delete category', 500);
  }
};

// Get category tree (hierarchical structure)
export const getCategoryTree = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Build hierarchical tree structure
    const categoryMap = new Map<string, any>();
    const rootCategories: any[] = [];

    // First pass: create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, {
        ...category,
        children: []
      });
    });

    // Second pass: build relationships
    categories.forEach(category => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      } else {
        rootCategories.push(categoryMap.get(category.id));
      }
    });

    res.json({
      success: true,
      data: { categories: rootCategories },
    });
  } catch (error: unknown) {
    logger.error('Get category tree error:', error);
    throw new AppError('Failed to fetch category tree', 500);
  }
};

// Health check route
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Categories API is working',
    timestamp: new Date().toISOString()
  });
});

// Routes
router.get('/', asyncHandler(getCategories));
router.get('/tree', asyncHandler(getCategoryTree));
router.get('/:id', asyncHandler(getCategory));
router.post('/', asyncHandler(createCategory));
router.put('/:id', asyncHandler(updateCategory));
router.delete('/:id', asyncHandler(deleteCategory));

export default router;