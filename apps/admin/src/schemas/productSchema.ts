import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name must be less than 200 characters"),

  slug: z
    .string()
    .min(1, "Slug is required")
    .min(2, "Slug must be at least 2 characters")
    .max(200, "Slug must be less than 200 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),

  description: z
    .string()
    .max(5000, "Description must be less than 5000 characters")
    .optional(),

  shortDescription: z
    .string()
    .max(500, "Short description must be less than 500 characters")
    .optional(),

  productCode: z
    .string()
    .max(100, "Product code must be less than 100 characters")
    .optional(),

  price: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      if (isNaN(num)) throw new Error("Price must be a valid number");
      return num;
    })
    .refine((val) => val >= 0, "Price must be a positive number")
    .refine((val) => val <= 999999.99, "Price must be less than 999,999.99"),

  comparePrice: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = typeof val === "string" ? parseFloat(val) : val;
      if (isNaN(num)) throw new Error("Compare price must be a valid number");
      return num;
    })
    .refine(
      (val) => val === undefined || val >= 0,
      "Compare price must be a positive number",
    )
    .refine(
      (val) => val === undefined || val <= 999999.99,
      "Compare price must be less than 999,999.99",
    )
    .optional(),

  costPrice: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = typeof val === "string" ? parseFloat(val) : val;
      if (isNaN(num)) throw new Error("Cost price must be a valid number");
      return num;
    })
    .refine(
      (val) => val === undefined || val >= 0,
      "Cost price must be a positive number",
    )
    .refine(
      (val) => val === undefined || val <= 999999.99,
      "Cost price must be less than 999,999.99",
    )
    .optional(),

  margin: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = typeof val === "string" ? parseFloat(val) : val;
      if (isNaN(num)) throw new Error("Margin must be a valid number");
      return num;
    })
    .refine(
      (val) => val === undefined || val >= 0,
      "Margin must be a positive number",
    )
    .refine(
      (val) => val === undefined || val <= 999999.99,
      "Margin must be less than 999,999.99",
    )
    .optional(),

  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters")
    .max(100, "SKU must be less than 100 characters")
    .regex(
      /^[A-Z0-9-_]+$/,
      "SKU must contain only uppercase letters, numbers, hyphens, and underscores",
    )
    .optional(),

  barcode: z
    .string()
    .max(50, "Barcode must be less than 50 characters")
    .optional(),

  upc: z.string().max(50, "UPC must be less than 50 characters").optional(),

  ean: z.string().max(50, "EAN must be less than 50 characters").optional(),

  isbn: z.string().max(50, "ISBN must be less than 50 characters").optional(),

  disclaimer: z
    .string()
    .max(1000, "Disclaimer must be less than 1000 characters")
    .optional(),

  ingredients: z
    .string()
    .max(2000, "Ingredients must be less than 2000 characters")
    .optional(),

  additionalDetails: z
    .string()
    .max(2000, "Additional details must be less than 2000 characters")
    .optional(),

  materialCare: z
    .string()
    .max(1000, "Material care must be less than 1000 characters")
    .optional(),

  showIngredients: z.boolean().default(false),
  showDisclaimer: z.boolean().default(false),
  showAdditionalDetails: z.boolean().default(false),
  showMaterialCare: z.boolean().default(false),

  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().optional(),
  brandId: z.string().optional(),

  tags: z.array(z.string()).max(20, "Maximum 20 tags allowed").default([]),

  isVariant: z.boolean().default(false),
  variantAttributes: z.array(z.string()).default([]),
  selectedSizes: z.array(z.string()).default([]),
  selectedColors: z.array(z.string()).default([]),
  selectedMaterials: z.array(z.string()).default([]),

  parentAsin: z
    .string()
    .max(50, "Parent ASIN must be less than 50 characters")
    .optional(),

  // Inventory
  trackQuantity: z.boolean().default(true),
  quantity: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === "" || val === null || val === undefined) return 0;
      const num = typeof val === "string" ? parseInt(val) : val;
      if (isNaN(num)) throw new Error("Stock must be a valid number");
      return num;
    })
    .refine((val) => Number.isInteger(val), "Stock must be a whole number")
    .refine((val) => val >= 0, "Stock cannot be negative")
    .refine((val) => val <= 999999, "Stock must be less than 999,999")
    .default(0),

  lowStockThreshold: z
    .number()
    .int("Low stock threshold must be a whole number")
    .min(0, "Low stock threshold cannot be negative")
    .max(999, "Low stock threshold must be less than 999")
    .default(5),

  allowBackorder: z.boolean().default(false),
  manageStock: z.boolean().default(true),

  // Physical properties
  weight: z
    .number()
    .min(0, "Weight must be a positive number")
    .max(9999.99, "Weight must be less than 9,999.99")
    .optional(),

  weightUnit: z.enum(["kg", "g", "lb", "oz"]).default("kg"),

  dimensions: z
    .object({
      length: z.number().min(0).optional(),
      width: z.number().min(0).optional(),
      height: z.number().min(0).optional(),
      unit: z.string().default("cm"),
    })
    .optional(),

  // Media
  images: z.array(z.string()).max(10, "Maximum 10 images allowed").default([]),
  videos: z.array(z.string()).max(5, "Maximum 5 videos allowed").default([]),
  thumbnail: z.string().optional(),

  // SEO fields
  seoTitle: z
    .string()
    .max(60, "SEO title must be less than 60 characters")
    .optional(),

  seoDescription: z
    .string()
    .max(160, "SEO description must be less than 160 characters")
    .optional(),

  seoKeywords: z
    .array(z.string())
    .max(10, "Maximum 10 SEO keywords allowed")
    .default([]),
  metaTags: z.any().optional(),

  canonicalUrl: z.string().url().optional(),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),

  ogTitle: z
    .string()
    .max(60, "OG title must be less than 60 characters")
    .optional(),

  ogDescription: z
    .string()
    .max(160, "OG description must be less than 160 characters")
    .optional(),

  ogType: z.string().default("website"),
  ogImage: z.string().url().optional(),

  twitterCard: z.string().default("summary"),
  twitterSite: z.string().optional(),

  // Status flags
  isActive: z.boolean().default(true),
  isDigital: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isSales: z.boolean().default(false),
  isNewSeller: z.boolean().default(false),
  isFestivalOffer: z.boolean().default(false),

  visibility: z.enum(["VISIBLE", "HIDDEN", "DRAFT"]).default("VISIBLE"),
  publishedAt: z.string().optional(),

  // Shipping
  requiresShipping: z.boolean().default(true),
  shippingClass: z.string().optional(),
  freeShipping: z.boolean().default(false),

  // Tax
  taxable: z.boolean().default(true),
  taxClass: z.string().optional(),

  // Additional
  customFields: z.any().optional(),
  notes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),

  // Multi-currency pricing
  currencyPrices: z
    .array(
      z.object({
        country: z.string().min(1, "Country is required"),
        currency: z.string().min(1, "Currency is required"),
        symbol: z.string().min(1, "Symbol is required"),
        price: z
          .union([z.string(), z.number()])
          .transform((val) => {
            const num = typeof val === "string" ? parseFloat(val) : val;
            if (isNaN(num)) throw new Error("Price must be a valid number");
            return num;
          })
          .refine((val) => val >= 0, "Price must be a positive number")
          .refine(
            (val) => val <= 999999.99,
            "Price must be less than 999,999.99",
          ),
        comparePrice: z
          .union([z.string(), z.number()])
          .transform((val) => {
            if (val === "" || val === null || val === undefined)
              return undefined;
            const num = typeof val === "string" ? parseFloat(val) : val;
            if (isNaN(num))
              throw new Error("Compare price must be a valid number");
            return num;
          })
          .refine(
            (val) => val === undefined || val >= 0,
            "Compare price must be a positive number",
          )
          .refine(
            (val) => val === undefined || val <= 999999.99,
            "Compare price must be less than 999,999.99",
          )
          .optional(),
        isActive: z.boolean().default(true),
      }),
    )
    .default([]),

  // Pricing tiers
  pricingTiers: z
    .array(
      z.object({
        minQuantity: z.number().min(1),
        maxQuantity: z.number().optional(),
        price: z.number().min(0),
        discount: z.number().min(0).max(100).optional(),
      }),
    )
    .default([]),

  // Attributes
  attributes: z
    .array(
      z.object({
        name: z.string().min(1),
        value: z.string().min(1),
        type: z
          .enum([
            "TEXT",
            "NUMBER",
            "BOOLEAN",
            "COLOR",
            "IMAGE",
            "SELECT",
            "MULTI_SELECT",
          ])
          .default("TEXT"),
        isRequired: z.boolean().default(false),
        isFilterable: z.boolean().default(true),
        sortOrder: z.number().default(0),
      }),
    )
    .default([]),

  // Variants
  variants: z
    .array(
      z.object({
        id: z.number().optional(),
        variantName: z.string().optional(),
        sku: z.string().optional(),
        images: z.array(z.string()).default([]),
        price: z
          .object({
            usd: z.number().optional(),
            eur: z.number().optional(),
            gbp: z.number().optional(),
            inr: z.number().optional(),
          })
          .optional(),
        dimensions: z
          .object({
            length: z.number().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
          })
          .optional(),
        childAsin: z.string().optional(),
      }),
    )
    .default([]),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Advanced filter schema
export const productFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  stockMin: z.number().min(0).optional(),
  stockMax: z.number().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isDigital: z.boolean().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(["name", "price", "stock", "createdAt", "updatedAt"]),
  sortOrder: z.enum(["asc", "desc"]),
});

export type ProductFilterData = z.infer<typeof productFilterSchema>;
