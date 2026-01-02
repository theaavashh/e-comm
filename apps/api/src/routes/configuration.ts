import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { adminAuth } from "@/middleware/adminAuth";

const router = Router();
const prisma = new PrismaClient();

// Get all configuration
router.get("/", adminAuth, async (req, res) => {
  try {
    // Get system configuration
    const systemConfig = await prisma.systemConfig.findMany();

    // Get currency rates
    const currencyRates = await prisma.currencyRate.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Get units
    const units = await prisma.unit.findMany({
      orderBy: { type: "asc" },
    });

    // Organize units by type
    const unitsByType = {
      weightUnits: units
        .filter((u) => u.type === "WEIGHT" && u.isActive)
        .map((u) => u.name),
      lengthUnits: units
        .filter((u) => u.type === "LENGTH" && u.isActive)
        .map((u) => u.name),
      clothingSizes: units
        .filter((u) => u.type === "CLOTHING_SIZE" && u.isActive)
        .map((u) => u.name),
      volumeUnits: units
        .filter((u) => u.type === "VOLUME" && u.isActive)
        .map((u) => u.name),
      temperatureUnits: units
        .filter((u) => u.type === "TEMPERATURE" && u.isActive)
        .map((u) => u.name),
      defaultWeightUnit:
        units.find((u) => u.type === "WEIGHT" && u.isDefault)?.name || "kg",
      defaultLengthUnit:
        units.find((u) => u.type === "LENGTH" && u.isDefault)?.name || "cm",
      defaultClothingSize:
        units.find((u) => u.type === "CLOTHING_SIZE" && u.isDefault)?.name ||
        "M",
    };

    // Get default currency
    const defaultCurrencyConfig = systemConfig.find(
      (config) => config.key === "defaultCurrency",
    );
    const defaultCurrency = defaultCurrencyConfig
      ? (defaultCurrencyConfig.value as string)
      : "NPR";

    // Get brands
    const brands = await prisma.brand.findMany({
      orderBy: [{ name: "asc" }],
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        units: unitsByType,
        currencyRates,
        defaultCurrency,
        brands,
      },
    });
  } catch (error) {
    console.error("Error fetching configuration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch configuration",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update units configuration
router.put("/units", adminAuth, async (req, res) => {
  try {
    const {
      weightUnits,
      lengthUnits,
      clothingSizes,
      volumeUnits,
      temperatureUnits,
      defaultWeightUnit,
      defaultLengthUnit,
      defaultClothingSize,
    } = req.body;

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Clear existing units
      await tx.unit.deleteMany();

      // Add new units
      const unitsToCreate = [
        ...weightUnits.map((unit: string) => ({
          type: "WEIGHT" as const,
          name: unit,
          isDefault: unit === defaultWeightUnit,
          isActive: true,
        })),
        ...lengthUnits.map((unit: string) => ({
          type: "LENGTH" as const,
          name: unit,
          isDefault: unit === defaultLengthUnit,
          isActive: true,
        })),
        ...clothingSizes.map((unit: string) => ({
          type: "CLOTHING_SIZE" as const,
          name: unit,
          isDefault: unit === defaultClothingSize,
          isActive: true,
        })),
        ...volumeUnits.map((unit: string) => ({
          type: "VOLUME" as const,
          name: unit,
          isDefault: false,
          isActive: true,
        })),
        ...temperatureUnits.map((unit: string) => ({
          type: "TEMPERATURE" as const,
          name: unit,
          isDefault: false,
          isActive: true,
        })),
      ];

      await tx.unit.createMany({
        data: unitsToCreate,
      });
    });

    res.json({
      success: true,
      message: "Units configuration updated successfully",
    });
  } catch (error) {
    console.error("Error updating units configuration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update units configuration",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update currency rates
router.put("/currency-rates", adminAuth, async (req, res) => {
  try {
    const { currencyRates, defaultCurrency } = req.body;

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Clear existing currency rates
      await tx.currencyRate.deleteMany();

      // Add new currency rates
      if (currencyRates && currencyRates.length > 0) {
        await tx.currencyRate.createMany({
          data: currencyRates.map((rate: any) => ({
            country: rate.country,
            currency: rate.currency,
            symbol: rate.symbol,
            rateToNPR: rate.rateToNPR,
            isActive: rate.isActive,
          })),
        });
      }

      // Update default currency
      await tx.systemConfig.upsert({
        where: { key: "defaultCurrency" },
        update: { value: defaultCurrency },
        create: { key: "defaultCurrency", value: defaultCurrency },
      });
    });

    res.json({
      success: true,
      message: "Currency rates updated successfully",
    });
  } catch (error) {
    console.error("Error updating currency rates:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update currency rates",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Add single currency rate
router.post("/currency-rates", adminAuth, async (req, res) => {
  try {
    const { country, currency, symbol, rateToNPR, isActive = true } = req.body;

    // Validate required fields
    if (!country || !currency || !symbol || !rateToNPR) {
      return res.status(400).json({
        success: false,
        message: "Country, currency, symbol, and rateToNPR are required",
      });
    }

    // Check if currency rate already exists
    const existingRate = await prisma.currencyRate.findFirst({
      where: {
        OR: [{ country, currency }, { currency }],
      },
    });

    if (existingRate) {
      return res.status(400).json({
        success: false,
        message: "Currency rate already exists for this country/currency",
      });
    }

    const currencyRate = await prisma.currencyRate.create({
      data: {
        country,
        currency,
        symbol,
        rateToNPR,
        isActive,
      },
    });

    res.status(201).json({
      success: true,
      message: "Currency rate added successfully",
      data: currencyRate,
    });
  } catch (error) {
    console.error("Error adding currency rate:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add currency rate",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update single currency rate
router.put("/currency-rates/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { country, currency, symbol, rateToNPR, isActive } = req.body;

    const currencyRate = await prisma.currencyRate.update({
      where: { id },
      data: {
        ...(country && { country }),
        ...(currency && { currency }),
        ...(symbol && { symbol }),
        ...(rateToNPR && { rateToNPR }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({
      success: true,
      message: "Currency rate updated successfully",
      data: currencyRate,
    });
  } catch (error) {
    console.error("Error updating currency rate:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update currency rate",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete currency rate
router.delete("/currency-rates/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.currencyRate.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Currency rate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting currency rate:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete currency rate",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get public navigation menu - no auth required
router.get("/public/navigation", async (req, res) => {
  try {
    const navConfig = await prisma.systemConfig.findUnique({
      where: { key: "navigation_menu" },
    });

    res.json({
      success: true,
      data: navConfig?.value || null,
    });
  } catch (error) {
    console.error("Error fetching navigation menu:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch navigation menu",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update navigation menu - admin only
router.put("/navigation", adminAuth, async (req, res) => {
  try {
    const { navigation } = req.body;

    if (!navigation) {
      return res.status(400).json({
        success: false,
        message: "Navigation data is required",
      });
    }

    const updatedConfig = await prisma.systemConfig.upsert({
      where: { key: "navigation_menu" },
      update: { value: navigation },
      create: { key: "navigation_menu", value: navigation },
    });

    res.json({
      success: true,
      message: "Navigation menu updated successfully",
      data: updatedConfig.value,
    });
  } catch (error) {
    console.error("Error updating navigation menu:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update navigation menu",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get public site settings (logo, favicon, siteName) - no auth required
router.get("/public/site-settings", async (req, res) => {
  try {
    const siteSettings = await prisma.systemConfig.findMany({
      where: {
        key: {
          in: ["siteName", "siteLogo", "siteFavicon"],
        },
      },
    });

    // Convert to key-value object
    const settings: Record<string, any> = {};
    siteSettings.forEach((config) => {
      settings[config.key] = config.value;
    });

    // Set default values if not in database
    const response = {
      siteName: settings.siteName || "GharSamma",
      siteLogo: settings.siteLogo || "/logo.png",
      siteFavicon: settings.siteFavicon || "/favicon.ico",
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching public site settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch site settings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get site settings (siteLogo, siteFavicon, etc.) - admin only
router.get("/site-settings", adminAuth, async (req, res) => {
  try {
    const siteSettings = await prisma.systemConfig.findMany({
      where: {
        key: {
          in: [
            // General Settings
            "siteName",
            "siteDescription",
            "siteUrl",
            "siteLogo",
            "siteFavicon",
            // Contact Settings
            "email",
            "phone",
            "address",
            "city",
            "country",
            // Business Settings
            "currency",
            "timezone",
            "language",
            // Payment Settings
            "paymentMethods",
            "taxRate",
            "shippingCost",
            // Appearance Settings
            "primaryColor",
            "secondaryColor",
            "theme",
            // Notification Settings
            "emailNotifications",
            "smsNotifications",
            "pushNotifications",
            // Security Settings
            "twoFactorAuth",
            "sessionTimeout",
            "passwordPolicy",
            // Inventory Settings
            "lowStockThreshold",
            "autoReorder",
            "trackInventory",
            // SEO Settings
            "seoTitle",
            "seoDescription",
            "seoKeywords",
            "ogTitle",
            "ogDescription",
            "ogImage",
            "ogType",
            "twitterCard",
            "twitterSite",
            "twitterCreator",
            "canonicalUrl",
            "robotsIndex",
            "robotsFollow",
            "sitemapUrl",
            "googleAnalyticsId",
            "googleTagManagerId",
            "facebookPixelId",
            "structuredData",
            // Analytics & Conversion API Settings
            "googleAnalyticsMeasurementId",
            "googleAnalyticsTrackingId",
            "googleAnalyticsEnabled",
            "enhancedEcommerceEnabled",
            "googleAdsConversionId",
            "googleAdsConversionLabel",
            "googleAdsEnabled",
            "facebookConversionApiEnabled",
            "facebookConversionApiToken",
            "facebookPixelAdvancedMatching",
            "customTrackingScripts",
          ],
        },
      },
    });

    // Convert to key-value object
    const settings: Record<string, any> = {};
    siteSettings.forEach((config) => {
      settings[config.key] = config.value;
    });

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch site settings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update site settings
router.put("/site-settings", adminAuth, async (req, res) => {
  try {
    const updates = req.body;

    // Update each setting in database
    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.systemConfig.upsert({
          where: { key },
          update: { value: value as any },
          create: { key, value: value as any },
        }),
      ),
    );

    res.json({
      success: true,
      message: "Site settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating site settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update site settings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get analytics data - admin only
router.get("/analytics", adminAuth, async (req, res) => {
  try {
    const { dateRange = "30days" } = req.query;

    // Calculate date range
    const now = new Date();
    const daysBack =
      dateRange === "7days"
        ? 7
        : dateRange === "90days"
          ? 90
          : dateRange === "1year"
            ? 365
            : 30;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    // Generate mock analytics data (in real implementation, this would come from Google Analytics, etc.)
    const analyticsData = generateMockAnalyticsDataForDateRange(startDate, now);

    res.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Helper function to generate mock analytics data for a date range
function generateMockAnalyticsDataForDateRange(startDate: Date, endDate: Date) {
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
  );
  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    return date.toISOString().split("T")[0];
  });

  return {
    overview: {
      totalVisitors: 12458 + Math.floor(Math.random() * 1000),
      totalPageViews: 45892 + Math.floor(Math.random() * 5000),
      totalSessions: 8923 + Math.floor(Math.random() * 800),
      bounceRate: 32.5 + Math.random() * 5,
      avgSessionDuration: 245 + Math.floor(Math.random() * 60),
      conversionRate: 3.2 + Math.random() * 2,
      totalRevenue: 89750 + Math.floor(Math.random() * 10000),
      growthRate: 12.4 + Math.random() * 5,
    },
    traffic: dates.map((date, index) => ({
      date,
      visitors: Math.floor(300 + Math.random() * 200 + index * 2),
      pageViews: Math.floor(1200 + Math.random() * 400 + index * 8),
      sessions: Math.floor(250 + Math.random() * 150 + index * 1.5),
    })),
    visitors: dates.map((date) => ({
      date,
      newVisitors: Math.floor(50 + Math.random() * 100),
      returningVisitors: Math.floor(200 + Math.random() * 150),
    })),
    pages: [
      {
        path: "/",
        title: "Home",
        views: 15420,
        uniqueViews: 8234,
        avgTimeOnPage: 145,
        bounceRate: 28.3,
      },
      {
        path: "/products",
        title: "Products",
        views: 8923,
        uniqueViews: 5432,
        avgTimeOnPage: 234,
        bounceRate: 31.2,
      },
      {
        path: "/products/cultural",
        title: "Cultural Products",
        views: 5632,
        uniqueViews: 3214,
        avgTimeOnPage: 189,
        bounceRate: 29.1,
      },
      {
        path: "/products/carpet",
        title: "Carpet Collection",
        views: 4231,
        uniqueViews: 2456,
        avgTimeOnPage: 267,
        bounceRate: 25.7,
      },
      {
        path: "/about",
        title: "About Us",
        views: 2345,
        uniqueViews: 1823,
        avgTimeOnPage: 89,
        bounceRate: 41.2,
      },
      {
        path: "/contact",
        title: "Contact",
        views: 1876,
        uniqueViews: 1456,
        avgTimeOnPage: 123,
        bounceRate: 35.8,
      },
    ],
    conversion: dates.map((date, index) => ({
      date,
      conversions: Math.floor(8 + Math.random() * 12 + index * 0.3),
      revenue: Math.floor(2500 + Math.random() * 1500 + index * 50),
      conversionRate: parseFloat((2.5 + Math.random() * 2).toFixed(1)),
    })),
    revenue: dates.map((date, index) => ({
      date,
      revenue: Math.floor(2500 + Math.random() * 2000 + index * 100),
      orders: Math.floor(15 + Math.random() * 25 + index * 0.5),
      avgOrderValue: Math.floor(150 + Math.random() * 100),
    })),
    devices: [
      {
        device: "Desktop",
        count: 8923 + Math.floor(Math.random() * 500),
        percentage: 71.6,
      },
      {
        device: "Mobile",
        count: 2876 + Math.floor(Math.random() * 300),
        percentage: 23.1,
      },
      {
        device: "Tablet",
        count: 659 + Math.floor(Math.random() * 100),
        percentage: 5.3,
      },
    ],
    sources: [
      {
        source: "Organic Search",
        visitors: 5234 + Math.floor(Math.random() * 500),
        percentage: 42.0,
      },
      {
        source: "Direct",
        visitors: 3567 + Math.floor(Math.random() * 400),
        percentage: 28.6,
      },
      {
        source: "Social Media",
        visitors: 1876 + Math.floor(Math.random() * 200),
        percentage: 15.1,
      },
      {
        source: "Referral",
        visitors: 1234 + Math.floor(Math.random() * 200),
        percentage: 9.9,
      },
      {
        source: "Email",
        visitors: 547 + Math.floor(Math.random() * 100),
        percentage: 4.4,
      },
    ],
  };
}

export default router;
