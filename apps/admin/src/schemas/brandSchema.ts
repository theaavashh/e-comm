import { z } from 'zod';

export const brandSchema = z.object({
  name: z
    .string()
    .min(1, 'Brand name is required')
    .min(2, 'Brand name must be at least 2 characters')
    .max(100, 'Brand name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&.]+$/, 'Brand name can only contain letters, numbers, spaces, hyphens, ampersands, and periods'),
  
  logo: z
    .string()
    .min(1, 'Brand logo is required')
    .refine((val) => {
      // Allow data URLs, http/https URLs, and Cloudinary URLs
      return val.startsWith('data:image/') || 
             val.startsWith('http://') || 
             val.startsWith('https://') ||
             val.startsWith('//'); // Allow protocol-relative URLs
    }, 'Please provide a valid image URL'),
  
  website: z
    .string()
    .min(1, 'Internal path is required')
    .regex(/^\/[a-zA-Z0-9\-_\/]+$/, 'Internal path must start with / and contain only letters, numbers, hyphens, underscores, and forward slashes (e.g., /zipzip, /gharsamma, /zipzip/products)'),
});

export type BrandFormData = z.infer<typeof brandSchema>;
