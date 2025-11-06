import { Router } from 'express';
import {
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats,
} from '@/controllers/orderController';
import { authenticateToken, authorize } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Get order statistics
router.get('/stats', authenticateToken, authorize('ADMIN'), asyncHandler(getOrderStats));

// Get all orders with filters and pagination
router.get('/', authenticateToken, authorize('ADMIN'), asyncHandler(getOrders));

// Get single order by ID
router.get('/:id', authenticateToken, authorize('ADMIN'), asyncHandler(getOrder));

// Update order status
router.patch('/:id/status', authenticateToken, authorize('ADMIN'), asyncHandler(updateOrderStatus));

export default router;

