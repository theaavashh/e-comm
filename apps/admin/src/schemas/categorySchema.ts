import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must be less than 100 characters'),
  
  image: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      return val.startsWith('data:image/') || val.startsWith('http');
    }, 'Please provide a valid image URL or data URL'),
  
  status: z
    .enum(['active', 'inactive'], {
      required_error: 'Status is required',
    }),
  
  isSubCategory: z.boolean(),
  
  parentId: z
    .string()
    .optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
