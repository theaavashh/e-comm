/**
 * @swagger
 * /api/v1/customization:
 *   post:
 *     summary: Submit a customization request
 *     tags: [Customization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - customizationType
 *               - productName
 *               - description
 *               - contactMethod
 *             properties:
 *               category:
 *                 type: string
 *               customizationType:
 *                 type: string
 *               productName:
 *                 type: string
 *               description:
 *                 type: string
 *               budget:
 *                 type: string
 *               deadline:
 *                 type: string
 *               contactMethod:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customization request submitted
 *       400:
 *         description: Validation error
 */

import { Router, Request, Response } from "express";
import { authenticateToken, optionalAuth } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";
import prisma from "@/config/database";
import { AppError } from "@/middleware/errorHandler";
import { logger } from "@/utils/logger";

const router = Router();

router.post(
  "/",
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const {
      category,
      customizationType,
      productName,
      description,
      budget,
      deadline,
      contactMethod,
      phone,
    } = req.body;

    if (
      !category ||
      !customizationType ||
      !productName ||
      !description ||
      !contactMethod
    ) {
      throw new AppError("Please fill in all required fields", 400);
    }

    const customizationRequest = await prisma.customizationRequest.create({
      data: {
        userId: req.user?.id,
        userEmail: req.user?.email || req.body.userEmail,
        category,
        customizationType,
        productName,
        description,
        budget,
        deadline: deadline ? new Date(deadline) : null,
        contactMethod,
        phone: phone || null,
        status: "PENDING",
      },
    });

    logger.info("Customization request submitted", {
      requestId: customizationRequest.id,
      category,
      userId: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Customization request submitted successfully!",
      data: {
        id: customizationRequest.id,
        status: customizationRequest.status,
      },
    });
  }),
);

export default router;
