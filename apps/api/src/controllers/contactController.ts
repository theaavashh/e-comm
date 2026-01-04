import { Request, Response } from "express";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";

// Get recent contacts/messages for dashboard
export const getRecentContacts = async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 5;

  try {
    const contacts = await prisma.contact.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    logger.error("Get recent contacts error:", error);
    throw new AppError("Failed to fetch recent contacts", 500);
  }
};

// Get all contacts with filters and pagination
export const getContacts = async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "20",
    status,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
        { subject: { contains: search as string, mode: "insensitive" } },
        { message: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy as string]: sortOrder,
        },
      }),
      prisma.contactMessage.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    logger.error("Get contacts error:", error);
    throw new AppError("Failed to fetch contacts", 500);
  }
};

// Update contact status
export const updateContactStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminReply } = req.body;

  try {
    const updateData: any = { status };

    if (adminReply) {
      updateData.adminReply = adminReply;
      updateData.repliedAt = new Date();
      updateData.repliedBy = req.user?.id; // Assuming user is available from auth middleware
    }

    const contact = await prisma.contactMessage.update({
      where: { id },
      data: updateData,
    });

    logger.info("Contact status updated", { contactId: id, status });

    res.json({
      success: true,
      message: "Contact updated successfully",
      data: { contact },
    });
  } catch (error) {
    logger.error("Update contact error:", error);
    throw new AppError("Failed to update contact", 500);
  }
};

// Get contact statistics
export const getContactStats = async (req: Request, res: Response) => {
  try {
    const [total, unread, read, replied, archived] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: "UNREAD" } }),
      prisma.contactMessage.count({ where: { status: "READ" } }),
      prisma.contactMessage.count({ where: { status: "REPLIED" } }),
      prisma.contactMessage.count({ where: { status: "ARCHIVED" } }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        unread,
        read,
        replied,
        archived,
      },
    });
  } catch (error) {
    logger.error("Get contact stats error:", error);
    throw new AppError("Failed to fetch contact statistics", 500);
  }
};
