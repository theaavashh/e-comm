import { Router } from "express";
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

const router = Router();

// Public routes
router.get(
  "/",
  validateQuery(productQuerySchema),
  validatePagination,
  asyncHandler(getProducts),
);
router.get("/featured", asyncHandler(getFeaturedProducts));
router.get("/:id", asyncHandler(getProduct));
router.get("/:id/pricing", asyncHandler(getProductPricing));

// Review routes - allow both authenticated and unauthenticated users
router.post("/:id/reviews", optionalAuth, asyncHandler(createReview));
router.get("/:id/reviews", asyncHandler(getProductReviews));

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
