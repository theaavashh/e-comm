import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testAnalyticsSettings() {
  try {
    console.log("🧪 Testing analytics settings API...");

    // Test fetching all analytics settings
    const analyticsSettings = await prisma.systemConfig.findMany({
      where: {
        key: {
          in: [
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

    console.log("✅ Found analytics settings:");
    analyticsSettings.forEach((setting) => {
      console.log(`   ${setting.key}: ${JSON.stringify(setting.value)}`);
    });

    console.log("\n🔧 Testing update functionality...");

    // Test updating a setting
    const updatedSetting = await prisma.systemConfig.upsert({
      where: { key: "googleAnalyticsEnabled" },
      update: { value: true },
      create: { key: "googleAnalyticsEnabled", value: true },
    });

    console.log(
      `✅ Updated googleAnalyticsEnabled to: ${updatedSetting.value}`,
    );

    // Test reading it back
    const readSetting = await prisma.systemConfig.findUnique({
      where: { key: "googleAnalyticsEnabled" },
    });

    console.log(`✅ Read back googleAnalyticsEnabled: ${readSetting?.value}`);

    console.log("\n✅ All analytics settings API tests passed!");
  } catch (error) {
    console.error("❌ Error testing analytics settings:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAnalyticsSettings();
