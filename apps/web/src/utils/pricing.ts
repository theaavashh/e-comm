/**
 * Build API URL with country parameter for pricing
 * Note: Components should use useLocation hook directly instead of this utility
 * This is kept for backward compatibility
 */
export const buildProductApiUrl = (baseUrl: string, country: string): string => {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}country=${encodeURIComponent(country)}`;
};

