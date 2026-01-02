import { SiteSettings } from "../types";

export interface ValidationError {
  field: string;
  message: string;
}

export const validateSettings = (
  settings: Partial<SiteSettings>,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // General Settings
  if (settings.siteName && settings.siteName.trim().length < 3) {
    errors.push({
      field: "siteName",
      message: "Site name must be at least 3 characters",
    });
  }

  if (settings.siteUrl && !isValidUrl(settings.siteUrl)) {
    errors.push({ field: "siteUrl", message: "Invalid site URL" });
  }

  if (settings.siteLogo && !isValidUrl(settings.siteLogo)) {
    errors.push({ field: "siteLogo", message: "Invalid logo URL" });
  }

  if (settings.siteFavicon && !isValidUrl(settings.siteFavicon)) {
    errors.push({ field: "siteFavicon", message: "Invalid favicon URL" });
  }

  // Contact Information
  if (settings.email && !isValidEmail(settings.email)) {
    errors.push({ field: "email", message: "Invalid email address" });
  }

  if (settings.phone && !isValidPhone(settings.phone)) {
    errors.push({ field: "phone", message: "Invalid phone number" });
  }

  // Business Settings
  if (
    settings.taxRate !== undefined &&
    (settings.taxRate < 0 || settings.taxRate > 100)
  ) {
    errors.push({
      field: "taxRate",
      message: "Tax rate must be between 0 and 100",
    });
  }

  if (settings.shippingCost !== undefined && settings.shippingCost < 0) {
    errors.push({
      field: "shippingCost",
      message: "Shipping cost cannot be negative",
    });
  }

  // Security Settings
  if (
    settings.sessionTimeout !== undefined &&
    (settings.sessionTimeout < 1 || settings.sessionTimeout > 480)
  ) {
    errors.push({
      field: "sessionTimeout",
      message: "Session timeout must be between 1 and 480 minutes",
    });
  }

  // Inventory Settings
  if (
    settings.lowStockThreshold !== undefined &&
    settings.lowStockThreshold < 0
  ) {
    errors.push({
      field: "lowStockThreshold",
      message: "Low stock threshold cannot be negative",
    });
  }

  // Appearance Settings
  if (settings.primaryColor && !isValidHexColor(settings.primaryColor)) {
    errors.push({
      field: "primaryColor",
      message: "Invalid primary color (must be hex)",
    });
  }

  if (settings.secondaryColor && !isValidHexColor(settings.secondaryColor)) {
    errors.push({
      field: "secondaryColor",
      message: "Invalid secondary color (must be hex)",
    });
  }

  // Analytics Settings Validation
  if (
    settings.googleAnalyticsMeasurementId &&
    !isValidGoogleAnalyticsId(settings.googleAnalyticsMeasurementId)
  ) {
    errors.push({
      field: "googleAnalyticsMeasurementId",
      message:
        "Invalid Google Analytics Measurement ID format (should be G-XXXXXXXXXX)",
    });
  }

  if (
    settings.googleAnalyticsTrackingId &&
    !isValidUniversalAnalyticsId(settings.googleAnalyticsTrackingId)
  ) {
    errors.push({
      field: "googleAnalyticsTrackingId",
      message:
        "Invalid Google Analytics Tracking ID format (should be UA-XXXXXXXX-X)",
    });
  }

  if (
    settings.googleAdsConversionId &&
    !isValidGoogleAdsId(settings.googleAdsConversionId)
  ) {
    errors.push({
      field: "googleAdsConversionId",
      message: "Invalid Google Ads Conversion ID",
    });
  }

  if (
    settings.googleAdsConversionLabel &&
    !isValidGoogleAdsLabel(settings.googleAdsConversionLabel)
  ) {
    errors.push({
      field: "googleAdsConversionLabel",
      message: "Invalid Google Ads Conversion Label format",
    });
  }

  if (
    settings.facebookConversionApiToken &&
    !isValidFacebookToken(settings.facebookConversionApiToken)
  ) {
    errors.push({
      field: "facebookConversionApiToken",
      message: "Invalid Facebook Access Token format",
    });
  }

  return errors;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    // Also allow relative URLs
    return url.startsWith("/") || url.startsWith("./");
  }
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

const isValidHexColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

const isValidGoogleAnalyticsId = (id: string): boolean => {
  // GA4 Measurement ID format: G-XXXXXXXXXX (10 characters after G-)
  const ga4Regex = /^G-[A-Z0-9]{10}$/;
  return ga4Regex.test(id);
};

const isValidUniversalAnalyticsId = (id: string): boolean => {
  // Universal Analytics format: UA-XXXXXXXX-X (8 digits, dash, 1-2 digits)
  const uaRegex = /^UA-\d{8}-\d{1,2}$/;
  return uaRegex.test(id);
};

const isValidGoogleAdsId = (id: string): boolean => {
  // Google Ads Conversion ID: numeric, usually 8-10 digits
  const adsIdRegex = /^\d{8,10}$/;
  return adsIdRegex.test(id);
};

const isValidGoogleAdsLabel = (label: string): boolean => {
  // Google Ads Conversion Label: alphanumeric string, typically 10-20 characters
  const labelRegex = /^[A-Za-z0-9_-]{10,20}$/;
  return labelRegex.test(label);
};

const isValidFacebookToken = (token: string): boolean => {
  // Facebook Access Token: starts with EAACEdEose0cBA... (for long-lived tokens)
  // Or can be any alphanumeric string for other token types
  const tokenRegex = /^[A-Za-z0-9_\-]{50,}$/;
  return tokenRegex.test(token);
};

export const getErrorMessage = (
  field: string,
  errors: ValidationError[],
): string | undefined => {
  return errors.find((err) => err.field === field)?.message;
};
