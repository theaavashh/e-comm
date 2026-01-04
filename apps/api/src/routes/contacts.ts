import { Router } from "express";
import {
  getRecentContacts,
  getContacts,
  updateContactStatus,
  getContactStats,
} from "@/controllers/contactController";
import { authenticateToken, authorize } from "@/middleware/auth";
import { asyncHandler } from "@/middleware/errorHandler";

const router = Router();

// Get recent contacts for dashboard
router.get(
  "/recent",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getRecentContacts),
);

// Get contact statistics
router.get(
  "/stats",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getContactStats),
);

// Get all contacts with filters and pagination
router.get(
  "/",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(getContacts),
);

// Update contact status
router.patch(
  "/:id/status",
  authenticateToken,
  authorize("ADMIN"),
  asyncHandler(updateContactStatus),
);

export default router;
