import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';

const router = Router();
const prisma = new PrismaClient();

// Test JWT verification
router.get('/test-jwt', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log('Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      return res.json({ success: false, message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    console.log('Token decoded:', decoded);
    
    res.json({
      success: true,
      message: 'JWT verification successful',
      decoded
    });
  } catch (error) {
    console.error('JWT error:', error);
    res.status(401).json({
      success: false,
      message: 'JWT verification failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test database query
router.get('/test-db', async (req, res) => {
  try {
    console.log('Testing database query...');
    
    const admin = await prisma.user.findUnique({
      where: {
        id: 'cmflfc4aa0000j8ek2vwyl1b3',
        role: 'ADMIN',
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
    
    console.log('Admin found:', admin);
    
    res.json({
      success: true,
      message: 'Database query successful',
      admin
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Database query failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test brands endpoint
router.get('/test-brands', async (req, res) => {
  try {
    console.log('Testing brands endpoint...');
    
    const brands = await prisma.brand.findMany();
    console.log('Brands found:', brands.length);
    
    res.json({
      success: true,
      message: 'Test successful',
      data: {
        brands,
        count: brands.length
      }
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create test brand
router.post('/create-brand', async (req, res) => {
  try {
    console.log('Creating test brand...');
    
    const brand = await prisma.brand.create({
      data: {
        name: req.body.name || 'Test Brand ' + Date.now(),
        logo: req.body.logo || 'https://example.com/logo.jpg',
        website: req.body.website || 'https://example.com'
      }
    });
    
    console.log('Brand created:', brand);
    
    res.json({
      success: true,
      message: 'Brand created successfully',
      data: { brand }
    });
  } catch (error) {
    console.error('Create brand error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create brand',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;