import { Request, Response } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";

// Get recent activities for dashboard
export const getRecentActivities = async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  try {
    const activities = await prisma.activity.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    logger.error("Get recent activities error:", error);
    throw new AppError("Failed to fetch recent activities", 500);
  }
};

// Get activities with filters
export const getActivities = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "20",
    type,
    action,
    entityId,
    entityType,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where clause
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (action) {
      where.action = { contains: action as string, mode: "insensitive" };
    }

    if (entityId) {
      where.entityId = entityId;
    }

    if (entityType) {
      where.entityType = entityType;
    }

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy as string]: sortOrder,
        },
      }),
      prisma.activityLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    logger.error("Get activities error:", error);
    throw new AppError("Failed to fetch activities", 500);
  }
};
