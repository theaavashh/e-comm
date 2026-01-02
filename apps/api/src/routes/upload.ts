import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/errorHandler';
import { env } from '@/config/env';

const router = Router();

// Ensure upload directories exist
const createUploadDirs = () => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  const dirs = ['categories', 'brands', 'sliders', 'media', 'products'];
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  dirs.forEach(dir => {
    const dirPath = path.join(uploadDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

// Initialize upload directories
createUploadDirs();

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'media'; // default
    
    // Determine folder based on upload type
    if (req.url.includes('/category')) folder = 'categories';
    else if (req.url.includes('/brand')) folder = 'brands';
    else if (req.url.includes('/slider')) folder = 'sliders';
    else if (req.url.includes('/product')) folder = 'products';
    
    const uploadPath = path.join(process.cwd(), 'uploads', folder);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image or video
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new AppError('Only image and video files are allowed', 400));
    }
  },
});

// Helper function to get file path (relative path to store in DB)
const getFilePath = (filename: string, folder: string): string => {
  return `/uploads/${folder}/${filename}`;
};

// Helper function to get file URL (for API responses)
const getFileUrl = (req: Request, filename: string, folder: string): string => {
  // Use configured port instead of relying on request host
  const host = req.get('host') || `localhost:${env.PORT}`;
  // Extract hostname and port
  const [hostname] = host.split(':');
  const baseUrl = `${req.protocol}://${hostname}:${env.PORT}`;
  return `${baseUrl}/uploads/${folder}/${filename}`;
};

// Upload category image
export const uploadCategoryImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError('No image file provided', 400);
    }

    const fileUrl = getFileUrl(req, req.file.filename, 'categories');
    const filePath = getFilePath(req.file.filename, 'categories');

    logger.info('Category image uploaded successfully', {
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl,
      path: filePath,
      filename: req.file.filename,
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: fileUrl,
        path: filePath,  // This is what should be stored in DB
        originalName: req.file.originalname,
        size: req.file.size,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Upload category image error:', error);
    throw new AppError('Failed to upload image', 500);
  }
};

// Upload brand image
export const uploadBrandImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError('No image file provided', 400);
    }

    const fileUrl = getFileUrl(req, req.file.filename, 'brands');
    const filePath = getFilePath(req.file.filename, 'brands');

    logger.info('Brand image uploaded successfully', {
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl,
      path: filePath,
      filename: req.file.filename,
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: fileUrl,
        path: filePath,  // This is what should be stored in DB
        originalName: req.file.originalname,
        size: req.file.size,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Upload brand image error:', error);
    throw new AppError('Failed to upload image', 500);
  }
};

// Upload slider image
export const uploadSliderImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError('No image file provided', 400);
    }

    const fileUrl = getFileUrl(req, req.file.filename, 'sliders');
    const filePath = getFilePath(req.file.filename, 'sliders');

    logger.info('Slider image uploaded successfully', {
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl,
      path: filePath,
      filename: req.file.filename,
    });

    res.json({
      success: true,
      message: 'Slider image uploaded successfully',
      data: {
        url: fileUrl,
        path: filePath,  // This is what should be stored in DB
        originalName: req.file.originalname,
        size: req.file.size,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Upload slider image error:', error);
    throw new AppError('Failed to upload slider image', 500);
  }
};

// Upload media file (image or video)
export const uploadMediaFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError('No media file provided', 400);
    }

    const isVideo = req.file.mimetype.startsWith('video/');
    const fileUrl = getFileUrl(req, req.file.filename, 'media');
    const filePath = getFilePath(req.file.filename, 'media');

    logger.info('Media file uploaded successfully', {
      originalName: req.file.originalname,
      size: req.file.size,
      type: isVideo ? 'video' : 'image',
      url: fileUrl,
      path: filePath,
      filename: req.file.filename,
    });

    res.json({
      success: true,
      message: 'Media file uploaded successfully',
      data: {
        url: fileUrl,
        path: filePath,  // This is what should be stored in DB
        originalName: req.file.originalname,
        size: req.file.size,
        type: isVideo ? 'video' : 'image',
        filename: req.file.filename,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Upload media file error:', error);
    throw new AppError('Failed to upload media file', 500);
  }
};

// Upload product image
export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new AppError('No image file provided', 400);
    }

    const fileUrl = getFileUrl(req, req.file.filename, 'products');
    const filePath = getFilePath(req.file.filename, 'products');

    logger.info('Product image uploaded successfully', {
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl,
      path: filePath,
      filename: req.file.filename,
    });

    res.json({
      success: true,
      message: 'Product image uploaded successfully',
      data: {
        url: fileUrl,
        path: filePath,  // This is what should be stored in DB
        originalName: req.file.originalname,
        size: req.file.size,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Upload product image error:', error);
    throw new AppError('Failed to upload product image', 500);
  }
};

// Routes
router.post('/category', upload.single('image'), asyncHandler(uploadCategoryImage));
router.post('/brand', upload.single('image'), asyncHandler(uploadBrandImage));
router.post('/slider', upload.single('image'), asyncHandler(uploadSliderImage));
router.post('/product', upload.single('image'), asyncHandler(uploadProductImage));
router.post('/media', upload.single('file'), asyncHandler(uploadMediaFile));

export default router;