import { Router } from "express";
import {
  getRecentActivities,
  getActivities,
  createActivity,
  getActivityStats,
} from "../controllers/activityController";
import { authenticateToken, authorize } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";

const router = Router();

// Get recent activities for dashboard
router.get(
  "/recent",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getRecentActivities),
);

// Get all activities with filters and pagination
router.get(
  "/",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getActivities),
);

export default router;
