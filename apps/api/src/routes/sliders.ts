import express from 'express';
import prisma from '@/config/database';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Get all sliders
router.get('/', async (req, res) => {
  try {
    const sliders = (prisma as any).slider?.findMany
      ? await (prisma as any).slider.findMany({ orderBy: { order: 'asc' } })
      : await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "sliders" ORDER BY "order" ASC');

    res.json({
      success: true,
      data: { sliders }
    });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sliders'
    });
  }
});

// Get single slider
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const slider = (prisma as any).slider?.findUnique
      ? await (prisma as any).slider.findUnique({ where: { id } })
      : (await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "sliders" WHERE id = $1 LIMIT 1', id))?.[0];

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: 'Slider not found'
      });
    }

    res.json({
      success: true,
      data: { slider }
    });
  } catch (error) {
    console.error('Error fetching slider:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slider'
    });
  }
});

// Test endpoint without auth (temporary)
router.post('/test', async (req, res) => {
  try {
    console.log('Test slider creation with data:', req.body);
    let { imageUrl, internalLink, isActive, order } = req.body || {};

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required',
      });
    }

    // Store only the relative path in the database
    // If it's already a full URL, keep it as is
    // If it's a relative path, store it as is
    let storedImageUrl = imageUrl;
    const isAbsolute = /^https?:\/\//i.test(imageUrl);
    if (isAbsolute) {
      // For absolute URLs (like Cloudinary), store as is
      storedImageUrl = imageUrl;
    } else {
      // For relative paths, ensure they start with a slash and store as is
      storedImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    }

    // Normalize optional fields
    if (typeof internalLink !== 'string') internalLink = '';
    if (typeof isActive !== 'boolean') isActive = true;
    if (!Number.isInteger(order) || order <= 0) order = 1;

    const slider = (prisma as any).slider?.create
      ? await (prisma as any).slider.create({
          data: { imageUrl: storedImageUrl, internalLink, isActive, order },
        })
      : (await prisma.$queryRawUnsafe<any[]>(
          'INSERT INTO "sliders" (id, "imageUrl", "internalLink", "isActive", "order", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) RETURNING *',
          storedImageUrl,
          internalLink,
          isActive,
          order
        ))?.[0];

    res.status(201).json({
      success: true,
      data: { slider },
      message: 'Test slider created successfully',
    });
  } catch (error) {
    console.error('Error creating test slider:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test slider',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Create new slider (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    console.log('Creating slider with data:', req.body);
    let { imageUrl, internalLink, isActive, order } = req.body;

    if (!imageUrl) {
      console.log('Missing imageUrl in request');
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    // Store only the relative path in the database
    // If it's already a full URL, keep it as is
    // If it's a relative path, store it as is
    let storedImageUrl = imageUrl;
    const isAbsolute = /^https?:\/\//i.test(imageUrl);
    if (isAbsolute) {
      // For absolute URLs (like Cloudinary), store as is
      storedImageUrl = imageUrl;
    } else {
      // For relative paths, ensure they start with a slash and store as is
      storedImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    }

    // Get the next order number if not provided
    let sliderOrder = order;
    if (!sliderOrder) {
    const lastSlider = (prisma as any).slider?.findFirst
      ? await (prisma as any).slider.findFirst({ orderBy: { order: 'desc' } })
      : (await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "sliders" ORDER BY "order" DESC LIMIT 1'))?.[0];
      sliderOrder = lastSlider ? lastSlider.order + 1 : 1;
    }
    
    const slider = (prisma as any).slider?.create
      ? await (prisma as any).slider.create({
          data: {
            imageUrl: storedImageUrl,
            internalLink: internalLink || '',
            isActive: isActive !== undefined ? isActive : true,
            order: sliderOrder,
          },
        })
      : (await prisma.$queryRawUnsafe<any[]>(
          'INSERT INTO "sliders" (id, "imageUrl", "internalLink", "isActive", "order", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) RETURNING *',
          storedImageUrl,
          internalLink || '',
          isActive !== undefined ? isActive : true,
          sliderOrder
        ))?.[0];

    res.status(201).json({
      success: true,
      data: { slider },
      message: 'Slider created successfully'
    });
  } catch (error) {
    console.error('Error creating slider:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create slider',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update slider (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    let { imageUrl, internalLink, isActive, order } = req.body;

    const existingSlider = (prisma as any).slider?.findUnique
      ? await (prisma as any).slider.findUnique({ where: { id } })
      : (await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "sliders" WHERE id = $1 LIMIT 1', id))?.[0];
    if (!existingSlider) {
      return res.status(404).json({
        success: false,
        message: 'Slider not found'
      });
    }

    const updateData: any = {};
    
    if (imageUrl !== undefined) {
      // Store only the relative path in the database
      // If it's already a full URL, keep it as is
      // If it's a relative path, store it as is
      const isAbsolute = /^https?:\/\//i.test(imageUrl);
      if (isAbsolute) {
        // For absolute URLs (like Cloudinary), store as is
        updateData.imageUrl = imageUrl;
      } else {
        // For relative paths, ensure they start with a slash and store as is
        updateData.imageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
      }
    }
    
    if (internalLink !== undefined) updateData.internalLink = internalLink;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;

    const slider = (prisma as any).slider?.update
      ? await (prisma as any).slider.update({ where: { id }, data: updateData })
      : (await prisma.$queryRawUnsafe<any[]>(
          'UPDATE "sliders" SET "imageUrl" = COALESCE($2, "imageUrl"), "internalLink" = COALESCE($3, "internalLink"), "isActive" = COALESCE($4, "isActive"), "order" = COALESCE($5, "order"), "updatedAt" = NOW() WHERE id = $1 RETURNING *',
          id,
          (updateData as any).imageUrl ?? null,
          (updateData as any).internalLink ?? null,
          (updateData as any).isActive ?? null,
          (updateData as any).order ?? null
        ))?.[0];

    res.json({
      success: true,
      data: { slider },
      message: 'Slider updated successfully'
    });
  } catch (error) {
    console.error('Error updating slider:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update slider'
    });
  }
});

// Delete slider without auth (temporary)
router.delete('/test/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingSlider = (prisma as any).slider?.findUnique
      ? await (prisma as any).slider.findUnique({ where: { id } })
      : (await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "sliders" WHERE id = $1 LIMIT 1', id))?.[0];

    if (!existingSlider) {
      return res.status(404).json({
        success: false,
        message: 'Slider not found'
      });
    }

    if ((prisma as any).slider?.delete) {
      await (prisma as any).slider.delete({ where: { id } });
    } else {
      await prisma.$executeRawUnsafe('DELETE FROM "sliders" WHERE id = $1', id);
    }

    // Reorder remaining sliders
    const remainingSliders = (prisma as any).slider?.findMany
      ? await (prisma as any).slider.findMany({ orderBy: { order: 'asc' } })
      : await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "sliders" ORDER BY "order" ASC');

    await Promise.all(
      remainingSliders.map((slider: any, index: number) =>
        ((prisma as any).slider?.update
          ? (prisma as any).slider.update({ where: { id: slider.id }, data: { order: index + 1 } })
          : prisma.$executeRawUnsafe('UPDATE "sliders" SET "order" = $2 WHERE id = $1', slider.id, index + 1))
      )
    );

    res.json({
      success: true,
      message: 'Slider deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slider:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete slider',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete slider (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const existingSlider = await prisma.slider.findUnique({
      where: { id }
    });

    if (!existingSlider) {
      return res.status(404).json({
        success: false,
        message: 'Slider not found'
      });
    }

    await prisma.slider.delete({
      where: { id }
    });

    // Reorder remaining sliders
    const remainingSliders = await prisma.slider.findMany({
      orderBy: { order: 'asc' }
    });

    await Promise.all(
      remainingSliders.map((slider, index) =>
        prisma.slider.update({
          where: { id: slider.id },
          data: { order: index + 1 }
        })
      )
    );

    res.json({
      success: true,
      message: 'Slider deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slider:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete slider'
    });
  }
});

// Bulk update order (Admin only)
router.put('/reorder', adminAuth, async (req, res) => {
  try {
    const { sliders } = req.body; // Array of { id, order }

    if (!Array.isArray(sliders)) {
      return res.status(400).json({
        success: false,
        message: 'Sliders array is required'
      });
    }

    await Promise.all(
      sliders.map(({ id, order }) =>
        prisma.slider.update({
          where: { id },
          data: { order }
        })
      )
    );

    res.json({
      success: true,
      message: 'Slider order updated successfully'
    });
  } catch (error) {
    console.error('Error reordering sliders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder sliders'
    });
  }
});

export default router;
