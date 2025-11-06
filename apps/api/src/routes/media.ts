import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '@/config/database';
import { adminAuth } from '../middleware/adminAuth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';


// Validation schemas
const createMediaSchema = z.object({
  linkTo: z.string().min(1, 'Link destination is required'),
  mediaType: z.enum(['IMAGE', 'VIDEO'], { required_error: 'Media type is required' }),
  mediaUrl: z.string().url('Valid media URL is required'),
  internalLink: z.string().min(1, 'Internal link is required').regex(/^\/[a-zA-Z0-9\/-]*$/, 'Internal link must start with /'),
});

const updateMediaSchema = createMediaSchema.partial();

// Get all media items
export const getMediaItems = async (req: Request, res: Response) => {
  try {
    const { active, linkTo } = req.query;
    
    const whereClause: any = {};
    
    if (active === 'true') {
      whereClause.isActive = true;
    }
    
    if (linkTo && typeof linkTo === 'string') {
      whereClause.linkTo = linkTo;
    }
    
    const mediaItems = (prisma as any).mediaItem?.findMany
      ? await (prisma as any).mediaItem.findMany({ where: whereClause, orderBy: { createdAt: 'desc' } })
      : await prisma.$queryRawUnsafe<any[]>(
          'SELECT * FROM "media_items" WHERE ($1::boolean IS NULL OR "isActive" = $1) AND ($2::text IS NULL OR "linkTo" = $2) ORDER BY "createdAt" DESC',
          whereClause.isActive ?? null,
          whereClause.linkTo ?? null
        );

    res.json({
      success: true,
      data: { mediaItems },
    });
  } catch (error) {
    logger.error('Get media items error:', error);
    throw new AppError('Failed to fetch media items', 500);
  }
};

// Get single media item
export const getMediaItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mediaItem = (prisma as any).mediaItem?.findUnique
      ? await (prisma as any).mediaItem.findUnique({ where: { id } })
      : (await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "media_items" WHERE id = $1 LIMIT 1', id))?.[0];

    if (!mediaItem) {
      throw new AppError('Media item not found', 404);
    }

    res.json({
      success: true,
      data: { mediaItem },
    });
  } catch (error) {
    logger.error('Get media item error:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch media item', 500);
  }
};

// Create media item
export const createMediaItem = async (req: Request, res: Response) => {
  try {
    const validatedData = createMediaSchema.parse(req.body);

    const mediaItem = (prisma as any).mediaItem?.create
      ? await (prisma as any).mediaItem.create({
          data: {
            linkTo: validatedData.linkTo,
            mediaType: validatedData.mediaType,
            mediaUrl: validatedData.mediaUrl,
            internalLink: validatedData.internalLink,
          },
        })
      : (await prisma.$queryRawUnsafe<any[]>(
          'INSERT INTO "media_items" (id, "linkTo", "mediaType", "mediaUrl", "internalLink", "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2::"MediaType", $3, $4, true, NOW(), NOW()) RETURNING *',
          validatedData.linkTo,
          validatedData.mediaType,
          validatedData.mediaUrl,
          validatedData.internalLink
        ))?.[0];

    res.status(201).json({
      success: true,
      data: { mediaItem },
      message: 'Media item created successfully',
    });
  } catch (error) {
    logger.error('Create media item error:', error);
    if (error instanceof z.ZodError) {
      throw new AppError('Validation error', 400);
    }
    throw new AppError('Failed to create media item', 500);
  }
};

// Update media item
export const updateMediaItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateMediaSchema.parse(req.body);

    // Check if media item exists
    const existingItem = (prisma as any).mediaItem?.findUnique
      ? await (prisma as any).mediaItem.findUnique({ where: { id } })
      : (await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "media_items" WHERE id = $1 LIMIT 1', id))?.[0];

    if (!existingItem) {
      throw new AppError('Media item not found', 404);
    }

    const mediaItem = (prisma as any).mediaItem?.update
      ? await (prisma as any).mediaItem.update({
          where: { id },
          data: { ...validatedData, updatedAt: new Date() },
        })
      : (await prisma.$queryRawUnsafe<any[]>(
          'UPDATE "media_items" SET "linkTo" = COALESCE($2, "linkTo"), "mediaType" = COALESCE($3::"MediaType", "mediaType"), "mediaUrl" = COALESCE($4, "mediaUrl"), "internalLink" = COALESCE($5, "internalLink"), "updatedAt" = NOW() WHERE id = $1 RETURNING *',
          id,
          (validatedData as any).linkTo ?? null,
          (validatedData as any).mediaType ?? null,
          (validatedData as any).mediaUrl ?? null,
          (validatedData as any).internalLink ?? null
        ))?.[0];

    res.json({
      success: true,
      data: { mediaItem },
      message: 'Media item updated successfully',
    });
  } catch (error) {
    logger.error('Update media item error:', error);
    if (error instanceof z.ZodError) {
      throw new AppError('Validation error', 400);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to update media item', 500);
  }
};

// Delete media item
export const deleteMediaItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if media item exists
    const existingItem = (prisma as any).mediaItem?.findUnique
      ? await (prisma as any).mediaItem.findUnique({ where: { id } })
      : (await prisma.$queryRawUnsafe<any[]>('SELECT * FROM "media_items" WHERE id = $1 LIMIT 1', id))?.[0];

    if (!existingItem) {
      throw new AppError('Media item not found', 404);
    }

    if ((prisma as any).mediaItem?.delete) {
      await (prisma as any).mediaItem.delete({ where: { id } });
    } else {
      await prisma.$executeRawUnsafe('DELETE FROM "media_items" WHERE id = $1', id);
    }

    res.json({
      success: true,
      message: 'Media item deleted successfully',
    });
  } catch (error) {
    logger.error('Delete media item error:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to delete media item', 500);
  }
};

// Routes
export const mediaRoutes = (app: any) => {
  // Public routes
  app.get('/api/v1/media', getMediaItems);
  app.get('/api/v1/media/:id', getMediaItem);

  // Protected routes (require admin authentication)
  app.post('/api/v1/media', adminAuth, createMediaItem);
  app.put('/api/v1/media/:id', adminAuth, updateMediaItem);
  app.delete('/api/v1/media/:id', adminAuth, deleteMediaItem);
};
