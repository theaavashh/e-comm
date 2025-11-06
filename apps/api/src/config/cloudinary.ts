import { v2 as cloudinary } from 'cloudinary';
import { logger } from '@/utils/logger';

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  logger.warn('Cloudinary credentials not found. Image upload functionality will be disabled.');
}

// Upload image to Cloudinary
export const uploadImage = async (file: Buffer, folder: string = 'categories', resourceType: 'image' | 'video' = 'image'): Promise<string> => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
  }

  try {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder,
        resource_type: resourceType,
      };

      // Only apply image transformations for images
      if (resourceType === 'image') {
        uploadOptions.transformation = [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
          { format: 'webp' }
        ];
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            logger.error('Cloudinary upload error:', error);
            reject(new Error(`Failed to upload ${resourceType} to Cloudinary`));
          } else if (result) {
            logger.info(`${resourceType} uploaded successfully`, { 
              publicId: result.public_id, 
              url: result.secure_url,
              folder 
            });
            resolve(result.secure_url);
          } else {
            reject(new Error('No result from Cloudinary upload'));
          }
        }
      );

      uploadStream.end(file);
    });
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload ${resourceType} to Cloudinary`);
  }
};

// Delete image from Cloudinary
export const deleteImage = async (imageUrl: string): Promise<void> => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    logger.warn('Cloudinary is not configured. Cannot delete image:', imageUrl);
    return;
  }

  try {
    // Extract public ID from URL
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (!publicId) {
      logger.warn('Could not extract public ID from URL:', imageUrl);
      return;
    }

    await cloudinary.uploader.destroy(publicId);
    logger.info('Image deleted successfully', { publicId });
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const urlParts = url.split('/');
    const folderAndFile = urlParts.slice(-2).join('/');
    return folderAndFile.split('.')[0];
  } catch (error) {
    logger.error('Error extracting public ID from URL:', error);
    return null;
  }
};

export default cloudinary;
