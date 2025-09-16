import { Router, Request, Response } from 'express';
import { prisma } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Get all categories with subcategories
export const getCategories = async (req: Request, res: Response) => {
  try {
    // Only get main categories (categories without parent)
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
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
    throw new AppError('Failed to fetch categories', 500);
  }
};

// Get single category by ID
export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
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
  const { name, description, image, parentId } = req.body;

  try {
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

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new AppError('A category with this name already exists', 409);
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        parentId: parentId || null,
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
        },
      },
    });

    logger.info('Category created', { categoryId: category.id, name: category.name });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Create category error:', error);
    throw new AppError('Failed to create category', 500);
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new AppError('Category not found', 404);
    }

    // If name is being updated, generate new slug
    if (updateData.name && updateData.name !== existingCategory.name) {
      const slug = updateData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug already exists
      const slugExists = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        throw new AppError('A category with this name already exists', 409);
      }

      updateData.slug = slug;
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
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
        },
      },
    });

    logger.info('Category updated', { categoryId: category.id, name: category.name });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category },
    });
  } catch (error) {
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

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new AppError('Cannot delete category with existing products', 400);
    }

    // Check if category has subcategories
    const subcategoryCount = await prisma.category.count({
      where: { parentId: id },
    });

    if (subcategoryCount > 0) {
      throw new AppError('Cannot delete category with existing subcategories', 400);
    }

    // Soft delete by setting isActive to false
    await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    logger.info('Category deleted', { categoryId: id, name: category.name });

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Delete category error:', error);
    throw new AppError('Failed to delete category', 500);
  }
};

// Routes
router.get('/', asyncHandler(getCategories));
router.get('/:id', asyncHandler(getCategory));
router.post('/', asyncHandler(createCategory));
router.put('/:id', asyncHandler(updateCategory));
router.delete('/:id', asyncHandler(deleteCategory));

export default router;
