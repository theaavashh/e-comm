import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

// Create a review for a product
export const createReview = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const { rating, title, comment, userName, email } = req.body;

  try {
    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    if (!comment || comment.trim().length === 0) {
      throw new AppError('Review comment is required', 400);
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Get user from request if authenticated, otherwise use null
    let userId: string | null = null;
    
    if (req.user) {
      // User is authenticated, use their ID
      userId = req.user.id;
    } else {
      // Unauthenticated user - check if userId is optional in schema
      // For now, we'll need to handle this by either:
      // 1. Making userId optional in schema (requires migration)
      // 2. Creating/using an anonymous user
      // 3. Using a placeholder user ID
      
      // Option: Find or create an anonymous user for unauthenticated reviews
      // For this implementation, we'll use a single anonymous user for all unauthenticated reviews
      let anonymousUser = await prisma.user.findUnique({
        where: { email: 'anonymous@reviews.local' },
      });

      if (!anonymousUser) {
        // Create anonymous user for unauthenticated reviews (only once)
        // Hash a random password since password field is required
        const hashedPassword = await bcrypt.hash('anonymous_review_user_no_login', 10);
        anonymousUser = await prisma.user.create({
          data: {
            email: 'anonymous@reviews.local',
            username: 'anonymous_reviewer',
            password: hashedPassword,
            role: 'CUSTOMER',
            isActive: true,
            emailVerified: false,
          },
        });
      }
      userId = anonymousUser.id;
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: Number(rating),
        title: title || null,
        comment: comment.trim(),
        isVerified: req.user ? true : false, // Verified if user is authenticated
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Calculate new average rating for the product
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isActive: true,
      },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    logger.info('Review created successfully', {
      reviewId: review.id,
      productId,
      userId,
      authenticated: !!req.user,
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: {
        review: {
          ...review,
          userName: userName || review.user?.username || 'Anonymous',
        },
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error('Create review error:', error);
    throw new AppError('Failed to create review', 500);
  }
};

// Get reviews for a product
export const getProductReviews = async (req: Request, res: Response) => {
  const { id: productId } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: {
        reviews,
      },
    });
  } catch (error) {
    logger.error('Get product reviews error:', error);
    throw new AppError('Failed to fetch reviews', 500);
  }
};


