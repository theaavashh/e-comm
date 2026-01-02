export interface SiteSettings {
  // General Settings
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  siteLogo: string;
  siteFavicon: string;

  // Contact Information
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;

  // Business Settings
  currency: string;
  timezone: string;
  language: string;

  // Payment Settings
  paymentMethods: string[];
  taxRate: number;
  shippingCost: number;

  // Appearance Settings
  primaryColor: string;
  secondaryColor: string;
  theme: "light" | "dark" | "auto";

  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;

  // Security Settings
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: string;

  // Inventory Settings
  lowStockThreshold: number;
  autoReorder: boolean;
  trackInventory: boolean;

  // Variant Management Settings
  defaultVariantImageWidth?: number;
  defaultVariantImageHeight?: number;
  variantAutoGeneration?: boolean;
  allowVariantCombinations?: boolean;
  showOutOfStockVariants?: boolean;
  variantFallbackEnabled?: boolean;
  variantAttributeTypes?: string;

  // SEO Settings
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  sitemapUrl: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
  structuredData: string;

  // Analytics & Conversion API Settings
  googleAnalyticsMeasurementId: string;
  googleAnalyticsTrackingId: string;
  googleAnalyticsEnabled: boolean;
  enhancedEcommerceEnabled: boolean;
  googleAdsConversionId: string;
  googleAdsConversionLabel: string;
  googleAdsEnabled: boolean;
  facebookConversionApiEnabled: boolean;
  facebookConversionApiToken: string;
  facebookPixelAdvancedMatching: boolean;
  customTrackingScripts: string;
}

export type TabKey =
  | "general"
  | "contact"
  | "business"
  | "payment"
  | "appearance"
  | "notifications"
  | "security"
  | "inventory"
  | "variant-management"
  | "seo"
  | "analytics";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UploadResponse {
  url: string;
  originalName: string;
  size: number;
  type: string;
  filename: string;
}
