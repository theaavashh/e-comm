import { Router, Request, Response } from 'express';
import prisma from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Get all categories with subcategories
export const getCategories = async (req: Request, res: Response) => {
  try {
    // Only get main categories (categories without parent)
    const categories = (prisma as any).category?.findMany ? await (prisma as any).category.findMany({
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
    }) : await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "categories" WHERE "isActive" = true AND "parentId" IS NULL ORDER BY name ASC'
    );

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

// Get single category by ID
export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = (prisma as any).category?.findUnique ? await (prisma as any).category.findUnique({
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
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "categories" WHERE id = $1 LIMIT 1', id
    ))?.[0];

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
  const { name, image, internalLink, parentId } = req.body;

  // Debug logging
  logger.info('Create category request data:', { name, image, internalLink, parentId });

  try {
    // Generate slug from name
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // If parentId is provided, append parent info to make slug unique
    if (parentId) {
      const parent = (prisma as any).category?.findUnique ? await (prisma as any).category.findUnique({
        where: { id: parentId },
      }) : (await prisma.$queryRawUnsafe<any[]>(
        'SELECT * FROM "categories" WHERE id = $1 LIMIT 1', parentId
      ))?.[0];

      if (!parent) {
        throw new AppError('Parent category not found', 404);
      }

      // Create unique slug by appending parent slug
      const parentSlug = parent.slug;
      slug = `${parentSlug}-${slug}`;
    }

    // Check if slug already exists (only for active categories)
    const existingActiveCategory = (prisma as any).category?.findFirst ? await (prisma as any).category.findFirst({
      where: { 
        slug,
        isActive: true,
      },
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "categories" WHERE slug = $1 AND "isActive" = true LIMIT 1', slug
    ))?.[0];

    if (existingActiveCategory) {
      const conflictType = parentId ? 'subcategory' : 'category';
      throw new AppError(`A ${conflictType} with this name already exists`, 409);
    }

    // If an inactive category with the same slug exists, make the slug unique by appending timestamp
    const existingInactiveCategory = (prisma as any).category?.findFirst ? await (prisma as any).category.findFirst({
      where: { slug },
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "categories" WHERE slug = $1 LIMIT 1', slug
    ))?.[0];

    if (existingInactiveCategory && !existingInactiveCategory.isActive) {
      slug = `${slug}-${Date.now()}`;
    }

    const categoryData = {
      name,
      slug,
      image,
      internalLink: internalLink || null,
      parentId: parentId || null,
      isActive: true,
    };

    logger.info('Creating category with data:', categoryData);

    const category = (prisma as any).category?.create ? await (prisma as any).category.create({
      data: categoryData,
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: { where: { isActive: true }, orderBy: { name: 'asc' } },
      },
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'INSERT INTO "categories" (id, name, slug, image, "internalLink", "parentId", "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, NOW(), NOW()) RETURNING *',
      categoryData.name,
      categoryData.slug,
      categoryData.image,
      categoryData.internalLink,
      categoryData.parentId
    ))?.[0];

    logger.info('Category created', { categoryId: category.id, name: category.name });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error) {
    logger.error('Create category error:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create category', 500);
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  // Debug logging
  logger.info('Update category request data:', { id, updateData });

  try {
    // Check if category exists
    const existingCategory = (prisma as any).category?.findUnique ? await (prisma as any).category.findUnique({
      where: { id },
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "categories" WHERE id = $1 LIMIT 1', id
    ))?.[0];

    if (!existingCategory) {
      throw new AppError('Category not found', 404);
    }

    // If name is being updated, generate new slug
    if (updateData.name && updateData.name !== existingCategory.name) {
      const slug = updateData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug already exists (only for active categories)
      const slugExists = (prisma as any).category?.findFirst ? await (prisma as any).category.findFirst({
        where: {
          slug,
          id: { not: id },
          isActive: true,
        },
      }) : (await prisma.$queryRawUnsafe<any[]>(
        'SELECT * FROM "categories" WHERE slug = $1 AND id <> $2 AND "isActive" = true LIMIT 1', slug, id
      ))?.[0];

      if (slugExists) {
        throw new AppError('A category with this name already exists', 409);
      }

      updateData.slug = slug;
    }

    const category = (prisma as any).category?.update ? await (prisma as any).category.update({
      where: { id },
      data: updateData,
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: { where: { isActive: true }, orderBy: { name: 'asc' } },
      },
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'UPDATE "categories" SET name = COALESCE($2, name), slug = COALESCE($3, slug), image = COALESCE($4, image), "internalLink" = COALESCE($5, "internalLink"), "parentId" = COALESCE($6, "parentId"), "updatedAt" = NOW() WHERE id = $1 RETURNING *',
      id,
      (updateData as any).name ?? null,
      (updateData as any).slug ?? null,
      (updateData as any).image ?? null,
      (updateData as any).internalLink ?? null,
      (updateData as any).parentId ?? null
    ))?.[0];

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
    const category = (prisma as any).category?.findUnique ? await (prisma as any).category.findUnique({
      where: { id },
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "categories" WHERE id = $1 LIMIT 1', id
    ))?.[0];

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if category has active products
    const productCount = (prisma as any).product?.count ? await (prisma as any).product.count({
      where: { 
        categoryId: id,
        isActive: true,
      },
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'SELECT COUNT(*)::int as count FROM "products" WHERE "categoryId" = $1 AND "isActive" = true', id
    ))?.[0]?.count ?? 0;

    if (productCount > 0) {
      throw new AppError('Cannot delete category with existing products', 400);
    }

    // Check if category has subcategories
    const subcategories = (prisma as any).category?.findMany ? await (prisma as any).category.findMany({ where: { parentId: id } })
      : await prisma.$queryRawUnsafe<any[]>(
          'SELECT * FROM "categories" WHERE "parentId" = $1', id
        );

    // If there are subcategories, delete them first
    if (subcategories.length > 0) {
      // Check if any subcategories have active products
      for (const subcategory of subcategories) {
        const subcategoryProductCount = await prisma.product.count({
          where: { 
            categoryId: subcategory.id,
            isActive: true,
          },
        });

        if (subcategoryProductCount > 0) {
          throw new AppError(`Cannot delete category. Subcategory "${subcategory.name}" has ${subcategoryProductCount} products. Please remove products first.`, 400);
        }
      }

      // Soft delete all subcategories first
      if ((prisma as any).category?.updateMany) {
        await (prisma as any).category.updateMany({ where: { parentId: id }, data: { isActive: false } });
      } else {
        await prisma.$executeRawUnsafe('UPDATE "categories" SET "isActive" = false WHERE "parentId" = $1', id);
      }

      logger.info('Subcategories deleted', { 
        categoryId: id, 
        subcategoryCount: subcategories.length,
        subcategoryNames: subcategories.map((s: any) => s.name)
      });
    }

    // Soft delete by setting isActive to false
    if ((prisma as any).category?.update) {
      await (prisma as any).category.update({ where: { id }, data: { isActive: false } });
    } else {
      await prisma.$executeRawUnsafe('UPDATE "categories" SET "isActive" = false WHERE id = $1', id);
    }

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
