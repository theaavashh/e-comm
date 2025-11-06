import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '@/config/database';
import { env } from '@/config/env';


interface AdminRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

export const adminAuth = async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    // Check for token in Authorization header first
    const authHeader = req.headers.authorization;
    const headerToken = authHeader && authHeader.split(' ')[1];
    // Also check for token in cookies (for cookie-based auth)
    const cookieToken = (req as any).cookies?.admin_access_token as string | undefined;
    const token = headerToken || cookieToken; // Prefer header if present
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    
    // Check if user exists and is admin (supports both Prisma delegates and raw SQL fallback)
    const userId = decoded.id || decoded.userId;
    const admin = (prisma as any).user?.findUnique
      ? await (prisma as any).user.findUnique({
          where: { id: userId, role: 'ADMIN', isActive: true },
          select: { id: true, email: true, role: true, isActive: true },
        })
      : ( (prisma as any).users?.findUnique
          ? await (prisma as any).users.findUnique({
              where: { id: userId, role: 'ADMIN', isActive: true },
              select: { id: true, email: true, role: true, isActive: true },
            })
          : (await prisma.$queryRaw<any[]>`
              SELECT id, email, role, "isActive"
              FROM "users"
              WHERE id = ${userId} AND role = ${'ADMIN'}::"UserRole" AND "isActive" = true
              LIMIT 1
            `)?.[0]
        );

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    // Add admin info to request
    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export default adminAuth;

