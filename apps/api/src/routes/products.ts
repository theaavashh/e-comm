import { Router } from "express";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         shortDescription:
 *           type: string
 *         price:
 *           type: number
 *         comparePrice:
 *           type: number
 *         sku:
 *           type: string
 *         stock:
 *           type: integer
 *         categoryId:
 *           type: string
 *           format: uuid
 *         brandId:
 *           type: string
 *           format: uuid
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, DRAFT]
 *         isFeatured:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductList:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *   schemas:
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         totalPages:
 *           type: integer
 */

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductPricing,
  addPricingTier,
  updatePricingTier,
  deletePricingTier,
  addProductAttribute,
  updateProductAttribute,
  deleteProductAttribute,
} from "@/controllers/productController";
import {
  createReview,
  getProductReviews,
} from "@/controllers/reviewController";
import { prisma } from "@/config/database";
import { logger } from "@/utils/logger";
import { AppError } from "@/middleware/errorHandler";
import { authenticateToken, authorize, optionalAuth } from "@/middleware/auth";
import {
  validateBody,
  validateQuery,
  validatePagination,
} from "@/middleware/validation";
import {
  createProductSchema,
  updateProductSchema,
  paginationSchema,
  productQuerySchema,
  createPricingTierSchema,
  updatePricingTierSchema,
  createProductAttributeSchema,
  updateProductAttributeSchema,
} from "@/types/validation";
import { asyncHandler } from "@/middleware/errorHandler";
import { cacheMiddleware } from "@/middleware/cache";

const router = Router();

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: brandId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, createdAt, name]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductList'
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               price:
 *                 type: number
 *               comparePrice:
 *                 type: number
 *               sku:
 *                 type: string
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *               brandId:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, DRAFT]
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /api/v1/products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of featured products
 *
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product updated
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product deleted
 */

// Public routes
router.get(
  "/",
  cacheMiddleware({ ttl: 120 }),
  validateQuery(productQuerySchema),
  validatePagination,
  asyncHandler(getProducts),
);
router.get(
  "/featured",
  cacheMiddleware({ ttl: 300 }),
  asyncHandler(getFeaturedProducts),
);
router.get("/:id", cacheMiddleware({ ttl: 60 }), asyncHandler(getProduct));
router.get(
  "/:id/pricing",
  cacheMiddleware({ ttl: 60 }),
  asyncHandler(getProductPricing),
);

// Review routes - allow both authenticated and unauthenticated users
router.post("/:id/reviews", optionalAuth, asyncHandler(createReview));
router.get(
  "/:id/reviews",
  cacheMiddleware({ ttl: 60 }),
  asyncHandler(getProductReviews),
);

// Protected routes (Admin only)
router.use(authenticateToken);
router.use(authorize("ADMIN"));

router.post(
  "/",
  validateBody(createProductSchema),
  asyncHandler(createProduct),
);
router.put(
  "/:id",
  validateBody(updateProductSchema),
  asyncHandler(updateProduct),
);
router.delete("/:id", asyncHandler(deleteProduct));

// Bulk operations (for development/admin purposes)
router.delete("/all", async (req, res) => {
  try {
    logger.info("Starting bulk delete of all products");

    // First delete related data to avoid foreign key constraints
    await prisma.productCurrencyPrice.deleteMany({});
    await prisma.productPricingTier.deleteMany({});
    await prisma.productAttribute.deleteMany({});
    await prisma.productVariant.deleteMany({});

    // Delete cart items that reference products
    await prisma.cartItem.deleteMany({});

    // Delete wishlist items that reference products
    await prisma.wishlistItem.deleteMany({});

    // Finally delete all products
    const deleteResult = await prisma.product.deleteMany({});

    logger.info("All products deleted successfully", {
      deletedProductsCount: deleteResult.count,
    });

    res.json({
      success: true,
      message: "All products deleted successfully",
      data: {
        deletedCount: deleteResult.count,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    logger.error("Bulk delete products error:", {
      error,
      code: error?.code,
      message: error?.message,
    });

    throw new AppError(
      `Failed to delete all products${error?.message ? `: ${error.message}` : ""}`,
      500,
    );
  }
});

// Pricing tier routes
router.post(
  "/:id/pricing-tiers",
  validateBody(createPricingTierSchema),
  asyncHandler(addPricingTier),
);
router.put(
  "/:id/pricing-tiers/:tierId",
  validateBody(updatePricingTierSchema),
  asyncHandler(updatePricingTier),
);
router.delete("/pricing-tiers/:tierId", asyncHandler(deletePricingTier));

// Product attribute routes
router.post(
  "/:id/attributes",
  validateBody(createProductAttributeSchema),
  asyncHandler(addProductAttribute),
);
router.put(
  "/attributes/:attributeId",
  validateBody(updateProductAttributeSchema),
  asyncHandler(updateProductAttribute),
);
router.delete("/attributes/:attributeId", asyncHandler(deleteProductAttribute));

export default router;
