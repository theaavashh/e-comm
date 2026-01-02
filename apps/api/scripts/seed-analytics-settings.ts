import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultAnalyticsSettings = [
  // Google Analytics Settings
  { key: "googleAnalyticsMeasurementId", value: "" },
  { key: "googleAnalyticsTrackingId", value: "" },
  { key: "googleAnalyticsEnabled", value: false },
  { key: "enhancedEcommerceEnabled", value: false },

  // Google Ads Settings
  { key: "googleAdsConversionId", value: "" },
  { key: "googleAdsConversionLabel", value: "" },
  { key: "googleAdsEnabled", value: false },

  // Facebook Conversion API Settings
  { key: "facebookConversionApiEnabled", value: false },
  { key: "facebookConversionApiToken", value: "" },
  { key: "facebookPixelAdvancedMatching", value: false },

  // Custom Tracking
  { key: "customTrackingScripts", value: "" },
];

async function seedAnalyticsSettings() {
  try {
    console.log("🔧 Seeding default analytics settings...");

    for (const setting of defaultAnalyticsSettings) {
      await prisma.systemConfig.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      });
      console.log(`✅ ${setting.key} setting ensured`);
    }

    console.log("✅ Analytics settings seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding analytics settings:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAnalyticsSettings();
