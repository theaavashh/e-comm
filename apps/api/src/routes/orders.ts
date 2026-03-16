import { Router } from "express";

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         orderNumber:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED]
 *         paymentStatus:
 *           type: string
 *           enum: [PENDING, PAID, FAILED, REFUNDED, PARTIALLY_REFUNDED]
 *         totalAmount:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         productId:
 *           type: string
 *         productName:
 *           type: string
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *     WishlistItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         productId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         product:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             slug:
 *               type: string
 *             price:
 *               type: number
 *             images:
 *               type: array
 *               items:
 *                 type: string
 */

import {
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats,
  getRecentOrders,
  getMyOrders,
  getMyOrder,
} from "@/controllers/orderController";
import { authenticateToken, authorize } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";

const router = Router();

/**
 * @swagger
 * /api/v1/orders/my-orders:
 *   get:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/orders/my-orders/{id}:
 *   get:
 *     summary: Get current user's order by ID
 *     tags: [Orders]
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
 *         description: Order details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */

// Customer routes - must be before admin routes
router.get("/my-orders", authenticateToken, asyncHandler(getMyOrders));
router.get("/my-orders/:id", authenticateToken, asyncHandler(getMyOrder));

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of orders
 *       403:
 *         description: Forbidden
 */

// Get recent orders for dashboard
router.get(
  "/recent",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getRecentOrders),
);

// Get order statistics
router.get(
  "/stats",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getOrderStats),
);

// Get all orders with filters and pagination
router.get("/", authenticateToken, authorize("ADMIN"), asyncHandler(getOrders));

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get single order by ID (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */

// Get single order by ID
router.get(
  "/:id",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getOrder),
);

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED]
 *     responses:
 *       200:
 *         description: Order status updated
 *       403:
 *         description: Forbidden
 */

// Update order status
router.patch(
  "/:id/status",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(updateOrderStatus),
);

export default router;
