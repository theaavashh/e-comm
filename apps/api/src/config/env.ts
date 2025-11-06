import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().default('postgresql://username:password@localhost:5432/gharsamma_ecommerce?schema=public'),
  
  // JWT
  JWT_SECRET: z.string().min(32).default('your-super-secret-jwt-key-here-change-this-in-production-32-chars-min'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32).default('your-super-secret-refresh-key-here-change-this-in-production-32-chars-min'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  
  // Server
  PORT: z.string().transform(Number).default('4444'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Redis
  REDIS_URL: z.string().url().optional(),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('5242880'),
  UPLOAD_PATH: z.string().default('./uploads'),
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:4000,http://localhost:4001,http://localhost:4444'),
  
  // Security
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),
  SESSION_SECRET: z.string().min(32).default('your-super-secret-session-key-here-change-this-in-production-32-chars-min'),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
