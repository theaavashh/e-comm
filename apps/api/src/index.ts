import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import middleware
import {
  corsOptions,
  rateLimiter,
  speedLimiter,
  helmetConfig,
  sanitizeRequest,
  securityHeaders,
  requestSizeLimiter,
} from '@/middleware/security';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { morganStream } from '@/utils/logger';

// Import routes
import authRoutes from '@/routes/auth';
import productRoutes from '@/routes/products';
import adminRoutes from '@/routes/admin';
import configurationRoutes from '@/routes/configuration';
import categoryRoutes from '@/routes/categories';
import bannerRoutes from '@/routes/banners';

// Load environment variables
dotenv.config();

// Import environment config
import { env } from '@/config/env';

const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(sanitizeRequest);
app.use(requestSizeLimiter);

// Rate limiting
app.use(rateLimiter);
app.use(speedLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', { stream: morganStream }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/configuration', configurationRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/banners', bannerRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

export default app;
