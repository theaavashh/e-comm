import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// Generic validation middleware
export const validate = (schema: ZodSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[property];
      const validatedData = schema.parse(data);
      req[property] = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: formattedErrors,
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Validation error',
      });
    }
  };
};

// Validate request body
export const validateBody = (schema: ZodSchema) => validate(schema, 'body');

// Validate query parameters
export const validateQuery = (schema: ZodSchema) => validate(schema, 'query');

// Validate route parameters
export const validateParams = (schema: ZodSchema) => validate(schema, 'params');

// Custom validation for file uploads
export const validateFileUpload = (allowedTypes: string[], maxSize: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const { mimetype, size } = req.file;

    // Check file type
    if (!allowedTypes.includes(mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type',
        allowedTypes,
        receivedType: mimetype,
      });
    }

    // Check file size
    if (size > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        maxSize,
        receivedSize: size,
      });
    }

    next();
  };
};

// Validate pagination parameters
export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query;
  
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;
  
  if (pageNum < 1) {
    return res.status(400).json({
      success: false,
      error: 'Page number must be greater than 0',
    });
  }
  
  if (limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      error: 'Limit must be between 1 and 100',
    });
  }
  
  req.query.page = pageNum.toString();
  req.query.limit = limitNum.toString();
  
  next();
};























