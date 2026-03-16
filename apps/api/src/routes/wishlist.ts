import { Router, Request, Response } from "express";

/**
 * @swagger
 * /api/v1/wishlist:
 *   get:
 *     summary: Get current user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wishlist items
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Add item to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Item added to wishlist
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/wishlist/{productId}:
 *   delete:
 *     summary: Remove item from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Item removed from wishlist
 *       401:
 *         description: Unauthorized
 */

import { authenticateToken } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";

const router = Router();

// Get current user's wishlist
router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            price: true,
            comparePrice: true,
            images: true,
            thumbnail: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: wishlist,
    });
  }),
);

// Add item to wishlist
router.post(
  "/",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { productId } = req.body;

    if (!productId) {
      throw new AppError("Product ID is required", 400);
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      return res.json({
        success: true,
        message: "Item already in wishlist",
        data: existingItem,
      });
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Item added to wishlist",
      data: wishlistItem,
    });
  }),
);

// Remove item from wishlist
router.delete(
  "/:productId",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { productId } = req.params;

    await prisma.wishlistItem.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    res.json({
      success: true,
      message: "Item removed from wishlist",
    });
  }),
);

export default router;
