import { z } from "zod";

export const PricingTierSchema = z.object({
  id: z.string().optional(),
  minQuantity: z.number().min(1, "Minimum quantity must be at least 1"),
  maxQuantity: z.number().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  discount: z.number().optional(),
});

export const CurrencyPriceSchema = z.object({
  id: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  currency: z.string().min(1, "Currency is required"),
  symbol: z.string().min(1, "Symbol is required"),
  price: z.number().min(0.01, "Price must be at least 0.01"),
  comparePrice: z.number().optional(),
  isActive: z.boolean().default(true),
});

export const ProductAttributeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Attribute name is required"),
  value: z.string().min(1, "Attribute value is required"),
  type: z.enum([
    "TEXT",
    "NUMBER",
    "BOOLEAN",
    "COLOR",
    "IMAGE",
    "SELECT",
    "MULTI_SELECT",
  ]),
  isRequired: z.boolean(),
  isFilterable: z.boolean(),
  sortOrder: z.number().min(0),
});

export const DimensionsSchema = z.object({
  length: z.number().min(0),
  width: z.number().min(0),
  height: z.number().min(0),
  unit: z.string().default("cm"),
});

export const ProductFormSchema = z.object({
  // Product Identity
  name: z.string().min(3, "Product name must be at least 3 characters"),
  productCode: z.string().optional(),
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()),
  isVariant: z.boolean(),

  // Basic Information
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  disclaimer: z.string().optional(),
  ingredients: z.string().optional(),
  additionalDetails: z.string().optional(),
  materialCare: z.string().optional(),
  showIngredients: z.boolean(),
  showDisclaimer: z.boolean(),
  showAdditionalDetails: z.boolean(),
  showMaterialCare: z.boolean(),

  // Product Identification
  sku: z.string().optional(),
  barcode: z.string().optional(),
  upc: z.string().optional(),
  ean: z.string().optional(),
  isbn: z.string().optional(),

  // Inventory
  trackQuantity: z.boolean(),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  lowStockThreshold: z
    .number()
    .min(0, "Low stock threshold must be non-negative"),
  allowBackorder: z.boolean(),
  manageStock: z.boolean(),

  // Physical Properties
  weight: z.number().min(0.01, "Weight must be at least 0.01"),
  weightUnit: z.string(),
  dimensions: DimensionsSchema,

  // Media
  images: z.array(z.string()),
  videos: z.array(z.string()),
  thumbnail: z.string().optional(),

  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()),
  metaTags: z.record(z.any()).optional(),

  // Status
  isActive: z.boolean(),
  isDigital: z.boolean(),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isOnSale: z.boolean(),
  isBestSeller: z.boolean(),
  isSales: z.boolean(),
  isNewSeller: z.boolean(),
  isFestivalOffer: z.boolean(),
  visibility: z.string(),
  publishedAt: z.string().optional(),

  // Shipping
  requiresShipping: z.boolean(),
  shippingClass: z.string().optional(),
  freeShipping: z.boolean(),

  // Tax
  taxable: z.boolean(),
  taxClass: z.string().optional(),

  // Open Graph
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  ogUrl: z.string().optional(),
  ogType: z.string().optional(),
  ogLocale: z.string().optional(),
  ogSiteName: z.string().optional(),

  // Twitter Cards
  twitterCard: z.string().optional(),
  twitterSite: z.string().optional(),
  twitterCreator: z.string().optional(),

  // Additional Social Meta
  facebookAppId: z.string().optional(),
  pinterestVerification: z.string().optional(),

  // Structured Data
  schemaType: z.string().optional(),
  productCategory: z.string().optional(),
  availability: z.string().optional(),
  condition: z.string().optional(),
  gtin: z.string().optional(),

  // Additional
  customFields: z.record(z.any()).optional(),
  notes: z.string().optional(),

  // Variant attributes
  variantAttributes: z.array(z.string()),
  
  // Amazon-style parent-child ASIN relationship
  parentAsin: z.string().optional(),
  variationTheme: z.string().optional(),
});

export const CompleteProductSchema = ProductFormSchema.extend({
  pricingTiers: z.array(PricingTierSchema).default([]),
  currencyPrices: z.array(CurrencyPriceSchema).default([]),
  attributes: z.array(ProductAttributeSchema).default([]),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;
export type PricingTier = z.infer<typeof PricingTierSchema>;
export type CurrencyPrice = z.infer<typeof CurrencyPriceSchema>;
export type ProductAttribute = z.infer<typeof ProductAttributeSchema>;
export type CompleteProductData = z.infer<typeof CompleteProductSchema>;
