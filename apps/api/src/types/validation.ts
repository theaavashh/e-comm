import { z } from "zod";

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number")
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number")
    .optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

// Address validation schemas
export const createAddressSchema = z.object({
  type: z.enum(["SHIPPING", "BILLING"]).default("SHIPPING"),
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

// Product validation schemas
// Define a base schema so we can derive create/update variants cleanly
const productBaseSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  // Full description is now required per UI
  description: z.string().min(1, "Full description is required"),
  shortDescription: z.string().optional(),
  productCode: z.string().optional(),
  disclaimer: z.string().optional(),
  ingredients: z.string().optional(),
  additionalDetails: z.string().optional(),
  materialCare: z.string().optional(),
  showIngredients: z.coerce.boolean().default(false),
  showDisclaimer: z.coerce.boolean().default(false),
  showAdditionalDetails: z.coerce.boolean().default(false),
  showMaterialCare: z.coerce.boolean().default(false),
  isVariant: z.coerce.boolean().default(false),
  variantAttributes: z.array(z.string()).default([]),
  selectedSizes: z.array(z.string()).default([]),
  selectedColors: z.array(z.string()).default([]),
  selectedMaterials: z.array(z.string()).default([]),
  parentAsin: z.string().optional(),

  // Pricing - base price is deprecated, use currencyPrices instead
  // price field is kept for backward compatibility but not used
  comparePrice: z.coerce
    .number()
    .min(0, "Compare price must be non-negative")
    .optional(),
  costPrice: z.coerce
    .number()
    .positive("Cost price must be positive")
    .optional(),
  margin: z.coerce
    .number()
    .min(0)
    .max(100, "Margin must be between 0 and 100")
    .optional(),

  // Product Identification (SKU required per UI)
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  upc: z.string().optional(),
  ean: z.string().optional(),
  isbn: z.string().optional(),

  // Inventory Management
  trackQuantity: z.coerce.boolean().default(true),
  quantity: z.coerce
    .number()
    .int()
    .min(0, "Quantity must be non-negative")
    .default(0),
  lowStockThreshold: z.coerce
    .number()
    .int()
    .min(0, "Low stock threshold must be non-negative")
    .default(5),
  allowBackorder: z.coerce.boolean().default(false),
  manageStock: z.coerce.boolean().default(true),

  // Physical Properties
  weight: z.coerce.number().positive("Weight must be positive").optional(),
  weightUnit: z.string().default("kg"),
  dimensions: z
    .object({
      length: z.coerce.number().optional(),
      width: z.coerce.number().optional(),
      height: z.coerce.number().optional(),
      unit: z.string().default("cm"),
    })
    .optional(),

  // Media - allow URLs or base64 data URLs
  images: z.array(z.string()).default([]), // Can be URL or base64 data URL
  videos: z.array(z.string().url("Invalid video URL")).default([]),
  thumbnail: z.string().optional(), // Can be URL or base64 data URL

  // SEO Fields
  seoTitle: z
    .string()
    .max(60, "SEO title must be less than 60 characters")
    .optional(),
  seoDescription: z
    .string()
    .max(160, "SEO description must be less than 160 characters")
    .optional(),
  seoKeywords: z.array(z.string()).default([]),
  metaTags: z.record(z.string()).optional(),
  canonicalUrl: z.string().optional(),
  robotsIndex: z.coerce.boolean().default(true),
  robotsFollow: z.coerce.boolean().default(true),
  ogTitle: z
    .string()
    .max(60, "OG title must be less than 60 characters")
    .optional(),
  ogDescription: z
    .string()
    .max(160, "OG description must be less than 160 characters")
    .optional(),
  ogType: z.string().default("website"),
  ogImage: z.string().optional(), // Can be URL or base64 data URL
  twitterCard: z.string().default("summary"),
  twitterSite: z.string().optional(),
  seo: z
    .object({
      ogTitle: z
        .string()
        .max(60, "OG title must be less than 60 characters")
        .optional(),
      ogDescription: z
        .string()
        .max(160, "OG description must be less than 160 characters")
        .optional(),
      ogImage: z.string().optional(), // Can be URL or base64 data URL
      canonicalUrl: z.string().optional(), // Can be URL or base64 data URL
      focusKeyword: z.string().optional(),
    })
    .optional(),

  // Product Status
  isActive: z.coerce.boolean().default(true),
  isDigital: z.coerce.boolean().default(false),
  isFeatured: z.coerce.boolean().default(false),
  isNew: z.coerce.boolean().default(false),
  isOnSale: z.coerce.boolean().default(false),
  isBestSeller: z.coerce.boolean().default(false),
  isSales: z.coerce.boolean().default(false),
  isNewSeller: z.coerce.boolean().default(false),
  isFestivalOffer: z.coerce.boolean().default(false),

  // Visibility
  visibility: z
    .enum(["VISIBLE", "HIDDEN", "CATALOG_ONLY", "SEARCH_ONLY"])
    .default("VISIBLE"),
  publishedAt: z.union([z.string(), z.coerce.date()]).optional(),

  // Categories and Tags
  categoryId: z.string().min(1, "Category ID is required"),
  subCategoryId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  brandId: z.string().optional(),

  // Shipping
  requiresShipping: z.coerce.boolean().default(true),
  shippingClass: z.string().optional(),
  freeShipping: z.coerce.boolean().default(false),

  // Tax
  taxable: z.coerce.boolean().default(true),
  taxClass: z.string().optional(),

  // Additional Fields
  // Support both record-style or array of sections for custom fields
  customFields: z
    .union([
      z.record(z.any()),
      z.array(
        z.object({
          key: z.string().min(1, "Section key is required"),
          label: z.string().min(1, "Section label is required"),
          content: z.any(),
          isVisible: z.coerce.boolean().optional(),
        }),
      ),
    ])
    .optional(),
  // Alias accepted from UI for custom sections
  customSections: z
    .array(
      z.object({
        key: z.string().optional(),
        label: z.string().optional(),
        title: z.string().optional(),
        type: z.string().optional(),
        content: z.any().optional(),
        isVisible: z.coerce.boolean().optional(),
      }),
    )
    .optional(),
  notes: z.string().optional(),

  // Dynamic pricing and attributes
  pricingTiers: z
    .array(
      z.object({
        minQuantity: z.coerce
          .number()
          .int()
          .min(1, "Minimum quantity must be at least 1"),
        maxQuantity: z.coerce
          .number()
          .int()
          .min(1, "Maximum quantity must be at least 1")
          .optional(),
        price: z.coerce.number().positive("Price must be positive"),
        discount: z.coerce
          .number()
          .min(0)
          .max(100, "Discount must be between 0 and 100")
          .optional(),
      }),
    )
    .optional(),

  attributes: z
    .array(
      z.object({
        name: z.string().min(1, "Attribute name is required"),
        value: z.string().min(1, "Attribute value is required"),
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
        isRequired: z.coerce.boolean().default(false),
        isFilterable: z.coerce.boolean().default(true),
        sortOrder: z.coerce.number().int().default(0),
      }),
    )
    .optional(),

  // International pricing (multi-currency pricing)
  currencyPrices: z
    .array(
      z.object({
        country: z.string().min(1, "Country is required"),
        currency: z.string().min(1, "Currency is required"),
        symbol: z.string().min(1, "Symbol is required"),
        price: z.coerce.number().positive("Price must be positive"),
        comparePrice: z.coerce
          .number()
          .min(0, "Compare price must be non-negative")
          .optional(),
        minDeliveryDays: z.coerce
          .number()
          .int()
          .min(1, "Minimum delivery days must be at least 1"),
        maxDeliveryDays: z.coerce
          .number()
          .int()
          .min(1, "Maximum delivery days must be at least 1"),
        isActive: z.coerce.boolean().default(true),
      }),
    )
    .optional(),
});

export const createProductSchema = productBaseSchema
  .extend({
    currencyPrices: z
      .array(
        z.object({
          country: z.string().min(1, "Country is required"),
          currency: z.string().min(1, "Currency is required"),
          symbol: z.string().min(1, "Symbol is required"),
          price: z.coerce.number().positive("Price must be positive"),
          comparePrice: z.coerce
            .number()
            .min(0, "Compare price must be non-negative")
            .optional(),
          minDeliveryDays: z.coerce
            .number()
            .int()
            .min(1, "Minimum delivery days must be at least 1"),
          maxDeliveryDays: z.coerce
            .number()
            .int()
            .min(1, "Maximum delivery days must be at least 1"),
          isActive: z.coerce.boolean().default(true),
        }),
      )
      .min(1, "At least one country pricing is required"),
  })
  .superRefine((data, ctx) => {
    const hasMedia =
      (data.images && data.images.length > 0) || !!data.thumbnail;
    if (!hasMedia) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one product image or a thumbnail is required",
        path: ["images"],
      });
    }
  });

export const updateProductSchema = productBaseSchema.partial();

// Pricing tier validation schemas
export const createPricingTierSchema = z.object({
  minQuantity: z.number().int().min(1, "Minimum quantity must be at least 1"),
  maxQuantity: z
    .number()
    .int()
    .min(1, "Maximum quantity must be at least 1")
    .optional(),
  price: z.number().positive("Price must be positive"),
  discount: z
    .number()
    .min(0)
    .max(100, "Discount must be between 0 and 100")
    .optional(),
});

export const updatePricingTierSchema = createPricingTierSchema.partial();

// Product attribute validation schemas
export const createProductAttributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  value: z.string().min(1, "Attribute value is required"),
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
  sortOrder: z.number().int().default(0),
});

export const updateProductAttributeSchema =
  createProductAttributeSchema.partial();

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters"),
  description: z.string().optional(),
  image: z.string().url("Invalid image URL").optional(),
  isActive: z.boolean().default(true),
  parentId: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Cart validation schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

// Order validation schemas
export const createOrderSchema = z.object({
  shippingAddressId: z.string().min(1, "Shipping address is required"),
  billingAddressId: z.string().min(1, "Billing address is required"),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
});

// Review validation schemas
export const createReviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .optional(),
});

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .optional(),
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .optional(),
});

// Query validation schemas
export const paginationSchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Product query schema with filtering support
export const productQuerySchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  rawCategory: z.string().optional(),
  categories: z.string().optional(), // Support 'categories' alias
  subcategory: z.string().optional(),
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  search: z.string().optional(),
  isActive: z.string().default("true"),
  country: z.string().optional(),
});

export const searchSchema = z.object({
  q: z.string().min(1, "Search query is required"),
  category: z.string().optional(),
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  rating: z.string().transform(Number).optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreatePricingTierInput = z.infer<typeof createPricingTierSchema>;
export type UpdatePricingTierInput = z.infer<typeof updatePricingTierSchema>;
export type CreateProductAttributeInput = z.infer<
  typeof createProductAttributeSchema
>;
export type UpdateProductAttributeInput = z.infer<
  typeof updateProductAttributeSchema
>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type SearchQuery = z.infer<typeof searchSchema>;
