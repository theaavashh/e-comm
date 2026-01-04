import { Request, Response } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";

// Get all orders with pagination and filters
export const getOrders = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
    status,
    paymentStatus,
    search,
  } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search as string, mode: "insensitive" } },
        {
          user: { email: { contains: search as string, mode: "insensitive" } },
        },
        {
          user: {
            firstName: { contains: search as string, mode: "insensitive" },
          },
        },
        {
          user: {
            lastName: { contains: search as string, mode: "insensitive" },
          },
        },
      ];
    }

    // Get orders with related data
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy as string]: sortOrder,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          shippingAddress: true,
          billingAddress: true,
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                  thumbnail: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    // Get summary statistics
    const stats = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      _avg: {
        totalAmount: true,
      },
    });

    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const statusCounts = ordersByStatus.reduce((acc: any, item: any) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
        stats: {
          totalOrders: total,
          totalRevenue: stats._sum.totalAmount || 0,
          averageOrderValue: stats._avg.totalAmount || 0,
          byStatus: {
            pending: statusCounts.PENDING || 0,
            confirmed: statusCounts.CONFIRMED || 0,
            processing: statusCounts.PROCESSING || 0,
            shipped: statusCounts.SHIPPED || 0,
            delivered: statusCounts.DELIVERED || 0,
            cancelled: statusCounts.CANCELLED || 0,
            refunded: statusCounts.REFUNDED || 0,
          },
        },
      },
    });
  } catch (error) {
    logger.error("Get orders error:", error);
    throw new AppError("Failed to fetch orders", 500);
  }
};

// Get single order by ID
export const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                images: true,
                thumbnail: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("Get order error:", error);
    throw new AppError("Failed to fetch order", 500);
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus, shippingStatus } = req.body;

  try {
    const updateData: any = {};

    if (status) {
      updateData.status = status;
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    if (shippingStatus) {
      updateData.shippingStatus = shippingStatus;
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    logger.info("Order status updated", { orderId: id, updates: updateData });

    res.json({
      success: true,
      message: "Order updated successfully",
      data: { order },
    });
  } catch (error) {
    logger.error("Update order error:", error);
    throw new AppError("Failed to update order", 500);
  }
};

// Get recent orders for dashboard
export const getRecentOrders = async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 5;

  try {
    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                thumbnail: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    logger.error("Get recent orders error:", error);
    throw new AppError("Failed to fetch recent orders", 500);
  }
};

// Get order statistics
export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      _avg: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const ordersByPaymentStatus = await prisma.order.groupBy({
      by: ["paymentStatus"],
      _count: {
        id: true,
      },
    });

    const statusCounts = ordersByStatus.reduce((acc: any, item: any) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {});

    const paymentStatusCounts = ordersByPaymentStatus.reduce(
      (acc: any, item: any) => {
        acc[item.paymentStatus] = item._count.id;
        return acc;
      },
      {},
    );

    res.json({
      success: true,
      data: {
        totalOrders: stats._count.id,
        totalRevenue: stats._sum.totalAmount || 0,
        averageOrderValue: stats._avg.totalAmount || 0,
        byStatus: {
          pending: statusCounts.PENDING || 0,
          confirmed: statusCounts.CONFIRMED || 0,
          processing: statusCounts.PROCESSING || 0,
          shipped: statusCounts.SHIPPED || 0,
          delivered: statusCounts.DELIVERED || 0,
          cancelled: statusCounts.CANCELLED || 0,
          refunded: statusCounts.REFUNDED || 0,
        },
        byPaymentStatus: {
          pending: paymentStatusCounts.PENDING || 0,
          paid: paymentStatusCounts.PAID || 0,
          failed: paymentStatusCounts.FAILED || 0,
          refunded: paymentStatusCounts.REFUNDED || 0,
          partiallyRefunded: paymentStatusCounts.PARTIALLY_REFUNDED || 0,
        },
      },
    });
  } catch (error) {
    logger.error("Get order stats error:", error);
    throw new AppError("Failed to fetch order statistics", 500);
  }
};
