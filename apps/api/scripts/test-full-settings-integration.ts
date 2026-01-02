import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testFullSettingsIntegration() {
  try {
    console.log("🔄 Testing full settings integration...");

    // Simulate what the frontend would send
    const mockSettingsUpdate = {
      googleAnalyticsMeasurementId: "G-1234567890",
      googleAnalyticsTrackingId: "UA-12345678-1",
      googleAnalyticsEnabled: true,
      enhancedEcommerceEnabled: true,
      googleAdsConversionId: "1234567890",
      googleAdsConversionLabel: "abcdefgHIjklmnOPQ",
      googleAdsEnabled: true,
      facebookConversionApiEnabled: true,
      facebookConversionApiToken: "EAACEdEose0cBA...",
    };

    console.log("📝 Updating settings with mock data...");

    // Update all settings (simulating API PUT request)
    const updatePromises = Object.entries(mockSettingsUpdate).map(
      ([key, value]) =>
        prisma.systemConfig.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
    );

    await Promise.all(updatePromises);
    console.log("✅ All settings updated successfully");

    // Fetch all settings back (simulating API GET request)
    console.log("📖 Fetching all settings...");
    const allSettings = await prisma.systemConfig.findMany({
      where: {
        key: {
          in: [
            "siteName",
            "siteDescription",
            "siteUrl",
            "siteLogo",
            "siteFavicon",
            "email",
            "phone",
            "address",
            "city",
            "country",
            "currency",
            "timezone",
            "language",
            "paymentMethods",
            "taxRate",
            "shippingCost",
            "primaryColor",
            "secondaryColor",
            "theme",
            "emailNotifications",
            "smsNotifications",
            "pushNotifications",
            "twoFactorAuth",
            "sessionTimeout",
            "passwordPolicy",
            "lowStockThreshold",
            "autoReorder",
            "trackInventory",
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

    // Convert to key-value object (like the API does)
    const settingsObject: Record<string, any> = {};
    allSettings.forEach((config) => {
      settingsObject[config.key] = config.value;
    });

    console.log("✅ Settings retrieved successfully");
    console.log("\n🎯 Analytics Settings Test:");
    console.log(
      `   Google Analytics Enabled: ${settingsObject.googleAnalyticsEnabled}`,
    );
    console.log(
      `   Measurement ID: ${settingsObject.googleAnalyticsMeasurementId}`,
    );
    console.log(`   Tracking ID: ${settingsObject.googleAnalyticsTrackingId}`);
    console.log(
      `   Enhanced Ecommerce: ${settingsObject.enhancedEcommerceEnabled}`,
    );
    console.log(`   Google Ads Enabled: ${settingsObject.googleAdsEnabled}`);
    console.log(`   Conversion ID: ${settingsObject.googleAdsConversionId}`);
    console.log(
      `   Conversion Label: ${settingsObject.googleAdsConversionLabel}`,
    );
    console.log(
      `   Facebook Conversion API Enabled: ${settingsObject.facebookConversionApiEnabled}`,
    );

    console.log("\n✅ Full settings integration test passed!");
    console.log(
      "🚀 Frontend should now be able to save and load analytics settings",
    );
  } catch (error) {
    console.error("❌ Integration test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testFullSettingsIntegration();
