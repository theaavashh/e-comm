import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/config/database.js';
import { z } from 'zod';
import { env } from '@/config/env';
import { asyncHandler } from '@/middleware/errorHandler';

const router = express.Router();

// Verify prisma is available at module load time
if (!prisma) {
  // This should never happen with the singleton setup
  console.error('CRITICAL: Prisma client is undefined in admin routes!');
}

// Validation schemas
const adminLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// Admin login
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = adminLoginSchema.parse(req.body);

  // Find admin user via Prisma delegate
  const admin = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
      role: 'ADMIN',
      isActive: true,
    },
  });

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      role: admin.role,
    },
    env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Set secure HttpOnly cookie
  const cookieName = 'admin_access_token';
  const isProd = env.NODE_ENV === 'production';
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  });

  // Return user data without password
  const { password: _, ...adminWithoutPassword } = admin;

  res.json({
    success: true,
    message: 'Login successful',
    // token still returned for backward-compatibility (client may ignore)
    token,
    user: adminWithoutPassword,
  });
}));

// Admin forgot password
router.post('/forgot-password', asyncHandler(async (req: Request, res: Response) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  // Check if admin exists via Prisma delegate
  const admin = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
      role: 'ADMIN',
      isActive: true,
    },
  });

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin not found',
    });
  }

  // Generate reset token
  const resetToken = jwt.sign(
    { userId: admin.id, email: admin.email },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // In a real application, you would send an email here
  // For now, we'll just log the reset token
  console.log(`Password reset token for ${email}: ${resetToken}`);

  res.json({
    success: true,
    message: 'Password reset instructions sent to your email',
    // In development, return the token for testing
    ...(env.NODE_ENV === 'development' && { resetToken }),
  });
}));

// Admin profile
router.get('/profile', asyncHandler(async (req: Request, res: Response) => {
  // Check for token in Authorization header first
  const authHeader = req.headers.authorization;
  const headerToken = authHeader && authHeader.split(' ')[1];
  // Also check for token in cookies (for cookie-based auth)
  const cookieToken = (req as any).cookies?.admin_access_token as string | undefined;
  const token = headerToken || cookieToken; // Prefer header if present
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }

  const decoded = jwt.verify(token, env.JWT_SECRET) as any;
  
  const admin = await prisma.user.findFirst({
    where: {
      id: decoded.id,
      role: 'ADMIN',
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      role: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin not found',
    });
  }

  res.json({
    success: true,
    user: admin,
  });
}));

// Admin logout (optional - mainly for token blacklisting in production)
router.post('/logout', (req, res) => {
  res.clearCookie('admin_access_token', { path: '/' });
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;


