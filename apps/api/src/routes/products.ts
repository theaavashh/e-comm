import { Router } from 'express';
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
} from '@/controllers/productController';
import { authenticateToken, authorize } from '@/middleware/auth';
import { validateBody, validateQuery, validatePagination } from '@/middleware/validation';
import { 
  createProductSchema, 
  updateProductSchema, 
  paginationSchema,
  createPricingTierSchema,
  updatePricingTierSchema,
  createProductAttributeSchema,
  updateProductAttributeSchema
} from '@/types/validation';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Public routes
router.get('/', validateQuery(paginationSchema), validatePagination, asyncHandler(getProducts));
router.get('/featured', asyncHandler(getFeaturedProducts));
router.get('/:id', asyncHandler(getProduct));
router.get('/:id/pricing', asyncHandler(getProductPricing));

// Protected routes (Admin only)
router.use(authenticateToken);
router.use(authorize('ADMIN'));

router.post('/', validateBody(createProductSchema), asyncHandler(createProduct));
router.put('/:id', validateBody(updateProductSchema), asyncHandler(updateProduct));
router.delete('/:id', asyncHandler(deleteProduct));

// Pricing tier routes
router.post('/:id/pricing-tiers', validateBody(createPricingTierSchema), asyncHandler(addPricingTier));
router.put('/:id/pricing-tiers/:tierId', validateBody(updatePricingTierSchema), asyncHandler(updatePricingTier));
router.delete('/pricing-tiers/:tierId', asyncHandler(deletePricingTier));

// Product attribute routes
router.post('/:id/attributes', validateBody(createProductAttributeSchema), asyncHandler(addProductAttribute));
router.put('/attributes/:attributeId', validateBody(updateProductAttributeSchema), asyncHandler(updateProductAttribute));
router.delete('/attributes/:attributeId', asyncHandler(deleteProductAttribute));

export default router;








