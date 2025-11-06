import { Router } from 'express';
import prisma from '@/config/database';
import { adminAuth } from '@/middleware/adminAuth';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  logo: z.string().min(1, 'Brand logo is required'),
  website: z.string().min(1, 'Internal path is required').regex(/^\/[a-zA-Z0-9\-_\/]+$/, 'Internal path must start with / and contain only letters, numbers, hyphens, underscores, and forward slashes'),
});

const updateBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').optional(),
  logo: z.string().min(1, 'Brand logo is required').optional(),
  website: z.string().min(1, 'Internal path is required').regex(/^\/[a-zA-Z0-9\-_\/]+$/, 'Internal path must start with / and contain only letters, numbers, hyphens, underscores, and forward slashes').optional(),
});


// GET /api/v1/brands - Get all brands
router.get('/', async (req, res) => {
  try {
    let brands: any[] = [];
    if ((prisma as any).brand?.findMany) {
      brands = await (prisma as any).brand.findMany({
        orderBy: [{ name: 'asc' }],
        include: { _count: { select: { products: true } } },
      });
    } else {
      brands = await prisma.$queryRawUnsafe<any[]>(
        'SELECT b.*, 0 as products_count FROM "brands" b ORDER BY b.name ASC'
      );
    }

    res.json({
      success: true,
      data: {
        brands
      }
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brands',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/v1/brands/:id - Get brand by ID
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const brand = (prisma as any).brand?.findUnique ? await (prisma as any).brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "brands" WHERE id = $1 LIMIT 1', id
    ))?.[0];

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      data: {
        brand
      }
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brand',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/v1/brands - Create new brand
router.post('/', adminAuth, async (req, res) => {
  try {
    const validatedData = createBrandSchema.parse(req.body);

    // Check if brand with same name already exists
    const existingBrand = (prisma as any).brand?.findFirst ? await (prisma as any).brand.findFirst({
      where: {
        name: validatedData.name
      }
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "brands" WHERE name = $1 LIMIT 1', validatedData.name
    ))?.[0];

    if (existingBrand) {
      return res.status(409).json({
        success: false,
        message: 'A brand with this name already exists'
      });
    }

    const brand = (prisma as any).brand?.create ? await (prisma as any).brand.create({
      data: validatedData,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'INSERT INTO "brands" (id, name, logo, website, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) RETURNING *',
      validatedData.name,
      validatedData.logo,
      validatedData.website
    ))?.[0];

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: {
        brand
      }
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create brand',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/v1/brands/:id - Update brand
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateBrandSchema.parse(req.body);

    // Check if brand exists
    const existingBrand = (prisma as any).brand?.findUnique ? await (prisma as any).brand.findUnique({
      where: { id }
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "brands" WHERE id = $1 LIMIT 1', id
    ))?.[0];

    if (!existingBrand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Check if name is being updated and if it conflicts
    if (validatedData.name && validatedData.name !== existingBrand.name) {
      const nameExists = (prisma as any).brand?.findFirst ? await (prisma as any).brand.findFirst({
        where: {
          name: validatedData.name,
          id: { not: id }
        }
      }) : (await prisma.$queryRawUnsafe<any[]>(
        'SELECT * FROM "brands" WHERE name = $1 AND id <> $2 LIMIT 1', validatedData.name, id
      ))?.[0];

      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: 'A brand with this name already exists'
        });
      }
    }

    const brand = (prisma as any).brand?.update ? await (prisma as any).brand.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'UPDATE "brands" SET name = COALESCE($2, name), logo = COALESCE($3, logo), website = COALESCE($4, website), "updatedAt" = NOW() WHERE id = $1 RETURNING *',
      id,
      (validatedData as any).name ?? null,
      (validatedData as any).logo ?? null,
      (validatedData as any).website ?? null
    ))?.[0];

    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: {
        brand
      }
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update brand',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/v1/brands/:id - Delete brand
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if brand exists
    const existingBrand = (prisma as any).brand?.findUnique ? await (prisma as any).brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    }) : (await prisma.$queryRawUnsafe<any[]>(
      'SELECT * FROM "brands" WHERE id = $1 LIMIT 1', id
    ))?.[0];

    if (!existingBrand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Check if brand has products
    if (existingBrand._count.products > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete brand. It has ${existingBrand._count.products} associated products. Please reassign or delete the products first.`
      });
    }

    if ((prisma as any).brand?.delete) {
      await (prisma as any).brand.delete({ where: { id } });
    } else {
      await prisma.$executeRawUnsafe('DELETE FROM "brands" WHERE id = $1', id);
    }

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete brand',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});


export default router;
