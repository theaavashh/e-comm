import { Router } from 'express';
import prisma from '@/config/database.js';
import { authenticateToken } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import { validateBody } from '../middleware/validation';
import { z } from 'zod';

const router = Router();


// Validation schemas
const createBannerSchema = z.object({
  title: z.string().min(1, 'Banner content is required'),
  isActive: z.boolean().default(true),
});

const updateBannerSchema = createBannerSchema.partial();

// Get all banners (public endpoint)
router.get('/', async (req, res) => {
  try {
    const banners = await prisma.topBanner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banners',
    });
  }
});

// Get all banners for admin (with inactive ones)
router.get('/admin', authenticateToken, adminAuth, async (req, res) => {
  try {
    const banners = await prisma.topBanner.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error('Error fetching banners for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banners',
    });
  }
});

// Get single banner
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await prisma.topBanner.findUnique({
      where: { id },
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    res.json({
      success: true,
      data: banner,
    });
  } catch (error) {
    console.error('Error fetching banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banner',
    });
  }
});

// Create new banner (temporarily removing auth for testing)
router.post('/', validateBody(createBannerSchema), async (req, res) => {
  try {
    const bannerData = req.body;

    // If the new banner is being set to active, deactivate all other banners
    if (bannerData.isActive) {
      await prisma.topBanner.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const banner = await prisma.topBanner.create({
      data: bannerData,
    });

    res.status(201).json({
      success: true,
      data: banner,
      message: 'Banner created successfully',
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create banner',
    });
  }
});

// Update banner (temporarily removing auth for testing)
router.put('/:id', validateBody(updateBannerSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const bannerData = req.body;

    // If the banner is being set to active, deactivate all other banners
    if (bannerData.isActive) {
      await prisma.topBanner.updateMany({
        where: { 
          isActive: true,
          id: { not: id } // Exclude the current banner being updated
        },
        data: { isActive: false },
      });
    }

    const banner = await prisma.topBanner.update({
      where: { id },
      data: bannerData,
    });

    res.json({
      success: true,
      data: banner,
      message: 'Banner updated successfully',
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update banner',
    });
  }
});

// Delete banner (temporarily removing auth for testing)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.topBanner.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete banner',
    });
  }
});

// Toggle banner status (temporarily removing auth for testing)
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await prisma.topBanner.findUnique({
      where: { id },
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found',
      });
    }

    // If we're activating this banner, deactivate all others first
    if (!banner.isActive) {
      await prisma.topBanner.updateMany({
        where: { 
          isActive: true,
          id: { not: id }
        },
        data: { isActive: false },
      });
    }

    const updatedBanner = await prisma.topBanner.update({
      where: { id },
      data: {
        isActive: !banner.isActive,
      },
    });

    res.json({
      success: true,
      data: updatedBanner,
      message: `Banner ${updatedBanner.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Error toggling banner status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle banner status',
    });
  }
});

export default router;

