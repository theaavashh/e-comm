import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name must be less than 200 characters'),
  
  slug: z
    .string()
    .min(1, 'Slug is required')
    .min(2, 'Slug must be at least 2 characters')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  
  description: z
    .string()
    .max(5000, 'Description must be less than 5000 characters')
    .optional(),
  
  shortDescription: z
    .string()
    .max(500, 'Short description must be less than 500 characters')
    .optional(),
  
  price: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num)) throw new Error('Price must be a valid number');
      return num;
    })
    .refine((val) => val >= 0, 'Price must be a positive number')
    .refine((val) => val <= 999999.99, 'Price must be less than 999,999.99'),
  
  comparePrice: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num)) throw new Error('Compare price must be a valid number');
      return num;
    })
    .refine((val) => val === undefined || val >= 0, 'Compare price must be a positive number')
    .refine((val) => val === undefined || val <= 999999.99, 'Compare price must be less than 999,999.99')
    .optional(),
  
  costPrice: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num)) throw new Error('Cost price must be a valid number');
      return num;
    })
    .refine((val) => val === undefined || val >= 0, 'Cost price must be a positive number')
    .refine((val) => val === undefined || val <= 999999.99, 'Cost price must be less than 999,999.99')
    .optional(),
  
  discountPrice: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num)) throw new Error('Discount price must be a valid number');
      return num;
    })
    .refine((val) => val === undefined || val >= 0, 'Discount price must be a positive number')
    .refine((val) => val === undefined || val <= 999999.99, 'Discount price must be less than 999,999.99')
    .optional(),
  
  discountPercentage: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num)) throw new Error('Discount percentage must be a valid number');
      return num;
    })
    .refine((val) => val === undefined || val >= 0, 'Discount percentage must be a positive number')
    .refine((val) => val === undefined || val <= 100, 'Discount percentage cannot exceed 100%')
    .optional(),
  
  margin: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(num)) throw new Error('Margin must be a valid number');
      return num;
    })
    .refine((val) => val === undefined || val >= 0, 'Margin must be a positive number')
    .refine((val) => val === undefined || val <= 999999.99, 'Margin must be less than 999,999.99')
    .optional(),
  
  minOrderQuantity: z
    .number()
    .int('Minimum order quantity must be a whole number')
    .min(1, 'Minimum order quantity must be at least 1')
    .max(999, 'Minimum order quantity must be less than 999')
    .optional(),
  
  maxOrderQuantity: z
    .number()
    .int('Maximum order quantity must be a whole number')
    .min(1, 'Maximum order quantity must be at least 1')
    .max(999, 'Maximum order quantity must be less than 999')
    .optional(),
  
  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(100, 'SKU must be less than 100 characters')
    .regex(/^[A-Z0-9-_]+$/, 'SKU must contain only uppercase letters, numbers, hyphens, and underscores')
    .optional(),
  
  categoryId: z
    .string()
    .min(1, 'Category is required'),
  
  subCategoryId: z
    .string()
    .optional(),
  
  brandId: z
    .string()
    .optional(),
  
  tags: z
    .array(z.string())
    .max(20, 'Maximum 20 tags allowed')
    .default([]),
  
  images: z
    .array(z.string())
    .max(10, 'Maximum 10 images allowed')
    .default([]),
  
  stock: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return 0;
      const num = typeof val === 'string' ? parseInt(val) : val;
      if (isNaN(num)) throw new Error('Stock must be a valid number');
      return num;
    })
    .refine((val) => Number.isInteger(val), 'Stock must be a whole number')
    .refine((val) => val >= 0, 'Stock cannot be negative')
    .refine((val) => val <= 999999, 'Stock must be less than 999,999')
    .default(0),
  
  weight: z
    .number()
    .min(0, 'Weight must be a positive number')
    .max(9999.99, 'Weight must be less than 9,999.99')
    .optional(),
  
  dimensions: z.object({
    length: z
      .number()
      .min(0, 'Length must be a positive number')
      .max(999.99, 'Length must be less than 999.99')
      .optional(),
    width: z
      .number()
      .min(0, 'Width must be a positive number')
      .max(999.99, 'Width must be less than 999.99')
      .optional(),
    height: z
      .number()
      .min(0, 'Height must be a positive number')
      .max(999.99, 'Height must be less than 999.99')
      .optional(),
  }).optional(),
  
  seo: z.object({
    title: z
      .string()
      .max(60, 'SEO title must be less than 60 characters')
      .optional(),
    description: z
      .string()
      .max(160, 'SEO description must be less than 160 characters')
      .optional(),
    keywords: z
      .array(z.string())
      .max(10, 'Maximum 10 SEO keywords allowed')
      .optional()
      .default([]),
    ogTitle: z
      .string()
      .max(60, 'OG title must be less than 60 characters')
      .optional(),
    ogDescription: z
      .string()
      .max(160, 'OG description must be less than 160 characters')
      .optional(),
    ogImage: z
      .string()
      .url('OG image must be a valid URL')
      .optional(),
    canonicalUrl: z
      .string()
      .url('Canonical URL must be a valid URL')
      .optional(),
    focusKeyword: z
      .string()
      .max(50, 'Focus keyword must be less than 50 characters')
      .optional(),
  }).optional(),
  
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isDigital: z.boolean().default(false),
  requiresShipping: z.boolean().default(true),
  trackQuantity: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
  
  // Promotional flags
  isTodaysBestDeal: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  isFestivalOffer: z.boolean().default(false),
  isNewLaunch: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  minQuantity: z
    .number()
    .int('Minimum quantity must be a whole number')
    .min(1, 'Minimum quantity must be at least 1')
    .max(999, 'Minimum quantity must be less than 999')
    .optional(),
  maxQuantity: z
    .number()
    .int('Maximum quantity must be a whole number')
    .min(1, 'Maximum quantity must be at least 1')
    .max(999, 'Maximum quantity must be less than 999')
    .optional(),
  
  // Multi-currency pricing
  currencyPrices: z
    .array(
      z.object({
        country: z.string().min(1, 'Country is required'),
        currency: z.string().min(1, 'Currency is required'),
        symbol: z.string().min(1, 'Symbol is required'),
        price: z
          .union([z.string(), z.number()])
          .transform((val) => {
            const num = typeof val === 'string' ? parseFloat(val) : val;
            if (isNaN(num)) throw new Error('Price must be a valid number');
            return num;
          })
          .refine((val) => val >= 0, 'Price must be a positive number')
          .refine((val) => val <= 999999.99, 'Price must be less than 999,999.99'),
        comparePrice: z
          .union([z.string(), z.number()])
          .transform((val) => {
            if (val === '' || val === null || val === undefined) return undefined;
            const num = typeof val === 'string' ? parseFloat(val) : val;
            if (isNaN(num)) throw new Error('Compare price must be a valid number');
            return num;
          })
          .refine((val) => val === undefined || val >= 0, 'Compare price must be a positive number')
          .refine((val) => val === undefined || val <= 999999.99, 'Compare price must be less than 999,999.99')
          .optional(),
        isActive: z.boolean().default(true),
      })
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
  sortBy: z.enum(['name', 'price', 'stock', 'createdAt', 'updatedAt']),
  sortOrder: z.enum(['asc', 'desc']),
});

export type ProductFilterData = z.infer<typeof productFilterSchema>;
