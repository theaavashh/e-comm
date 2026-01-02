import { Router } from "express";
import prisma from "@/config/database.js";
import { authenticateToken } from "../middleware/auth";
import { adminAuth } from "../middleware/adminAuth";
import { validateBody } from "../middleware/validation";
import { z } from "zod";

const router = Router();

// Validation schemas
const createBannerSchema = z.object({
  title: z.string().min(1, "Banner content is required"),
  isActive: z.boolean(),
});

const updateBannerSchema = createBannerSchema.partial();

// Get all banners (public endpoint)
router.get("/", async (req, res) => {
  try {
    const banners = await prisma.topBanner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
    });
  }
});

// Get all banners for admin (with inactive ones)
router.get("/admin", authenticateToken, adminAuth, async (req, res) => {
  try {
    const banners = await prisma.topBanner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Admin banners fetched:", banners);

    res.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error("Error fetching banners for admin:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
    });
  }
});

// Get single banner
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await prisma.topBanner.findUnique({
      where: { id },
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.json({
      success: true,
      data: banner,
    });
  } catch (error) {
    console.error("Error fetching banner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch banner",
    });
  }
});

// Create new banner
router.post(
  "/",
  authenticateToken,
  adminAuth,
  validateBody(createBannerSchema),
  async (req, res) => {
    try {
      const bannerData = req.body;

      // Allow multiple active banners - don't deactivate others
      // Remove this logic to support multiple active banners

      const banner = await prisma.topBanner.create({
        data: bannerData,
      });

      res.status(201).json({
        success: true,
        data: banner,
        message: "Banner created successfully",
      });
    } catch (error) {
      console.error("Error creating banner:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create banner",
      });
    }
  },
);

// Update banner
router.put(
  "/:id",
  authenticateToken,
  adminAuth,
  validateBody(updateBannerSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const bannerData = req.body;

      // Allow multiple active banners - don't deactivate others
      // Remove this logic to support multiple active banners

      const updatedBanner = await prisma.topBanner.update({
        where: { id },
        data: bannerData,
      });

      res.json({
        success: true,
        data: updatedBanner,
        message: "Banner updated successfully",
      });
    } catch (error) {
      console.error("Error updating banner:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update banner",
      });
    }
  },
);

// Toggle banner status (MUST come before /:id to avoid routing conflicts)
router.patch("/:id/toggle", authenticateToken, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 TOGGLE: Attempting to toggle banner ${id}`);

    const banner = await prisma.topBanner.findUnique({
      where: { id },
    });

    if (!banner) {
      console.log(`❌ TOGGLE: Banner ${id} not found`);
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    console.log(`🔄 TOGGLE: Banner ${id} current status: ${banner.isActive}`);
    const newStatus = !banner.isActive;
    console.log(`🔄 TOGGLE: Setting banner ${id} to status: ${newStatus}`);

    const updatedBanner = await prisma.topBanner.update({
      where: { id },
      data: {
        isActive: newStatus,
      },
    });

    console.log(
      `✅ TOGGLE: Banner ${id} updated successfully. Final status: ${updatedBanner.isActive}`,
    );

    res.json({
      success: true,
      data: updatedBanner,
      message: `Banner ${updatedBanner.isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("Error toggling banner status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle banner status",
    });
  }
});

// Delete banner
router.delete("/:id", authenticateToken, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE: Attempting to DELETE banner ${id}`);

    const banner = await prisma.topBanner.findUnique({
      where: { id },
    });

    if (!banner) {
      console.log(`❌ DELETE: Banner ${id} not found`);
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    await prisma.topBanner.delete({
      where: { id },
    });

    console.log(`✅ DELETE: Banner ${id} deleted successfully`);
    res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete banner",
    });
  }
});

export default router;
