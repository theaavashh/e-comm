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
  theme: 'light' | 'dark' | 'auto';
  
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
}

export type TabKey = 'general' | 'contact' | 'business' | 'payment' | 'appearance' | 'notifications' | 'security' | 'inventory' | 'seo';

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














