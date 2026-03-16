// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "path";

// Import middleware
import {
  corsOptions,
  rateLimiter,
  speedLimiter,
  helmetConfig,
  sanitizeRequest,
  securityHeaders,
  requestSizeLimiter,
} from "@/middleware/security";
import { errorHandler, notFoundHandler } from "@/middleware/errorHandler";
import { morganStream } from "@/utils/logger";
import { requestLogger } from "@/middleware/requestLogger";

// Import routes
import authRoutes from "@/routes/auth";
import productRoutes from "@/routes/products";
import adminRoutes from "@/routes/admin";
import configurationRoutes from "@/routes/configuration";
import categoryRoutes from "@/routes/categories";
import bannerRoutes from "@/routes/banners";
import brandRoutes from "@/routes/brands";
import uploadRoutes from "@/routes/upload";
import { mediaRoutes } from "@/routes/media";
import sliderRoutes from "@/routes/sliders";
import currencyRoutes from "@/routes/currency";
import testRoutes from "@/routes/test";
import orderRoutes from "@/routes/orders";
import activityRoutes from "@/routes/activities";
import contactRoutes from "@/routes/contacts";
import wishlistRoutes from "@/routes/wishlist";
import customizationRoutes from "@/routes/customization";
import { swaggerRouter } from "@/config/swagger";
// Import environment config
import { env } from "@/config/env";
import { initRedis, closeRedis } from "@/config/redis";

const app = express();

// Normalize potential ESM/CJS interop for routers
const asRouter = (maybeModule: any): any => {
  let mod = maybeModule;
  while (mod && typeof mod === "object" && "default" in mod) {
    mod = mod.default;
  }
  return mod;
};

// Trust proxy (for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// Serve static files from uploads directory BEFORE security middleware to avoid CSP issues
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res) => {
      // Set CORS headers for static files
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      // Don't set CSP headers for uploaded files
    },
  }),
);

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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan("combined", { stream: morganStream }));
app.use(requestLogger);

// Health check endpoints
const healthCheckHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  const redisClient = await import("@/config/redis").then((m) =>
    m.getRedisClient(),
  );
  let redisStatus = "disconnected";

  if (redisClient?.isOpen) {
    redisStatus = "connected";
  }

  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    redis: redisStatus,
  });
};

app.get("/health", healthCheckHandler);
app.get("/api/health", healthCheckHandler);

// Swagger documentation
app.use("/api-docs", swaggerRouter);

// API routes
app.use("/api/v1/auth", asRouter(authRoutes));
app.use("/api/v1/products", asRouter(productRoutes));
app.use("/api/v1/admin", asRouter(adminRoutes));
app.use("/api/v1/configuration", asRouter(configurationRoutes));
app.use("/api/v1/categories", asRouter(categoryRoutes));
app.use("/api/v1/banners", asRouter(bannerRoutes));
app.use("/api/v1/brands", asRouter(brandRoutes));
app.use("/api/v1/upload", asRouter(uploadRoutes));
mediaRoutes(app);
app.use("/api/v1/sliders", asRouter(sliderRoutes));
app.use("/api/v1/currency", asRouter(currencyRoutes));
// app.use('/api/v1/test', asRouter(testRoutes));
app.use("/api/v1/orders", asRouter(orderRoutes));
app.use("/api/v1/wishlist", asRouter(wishlistRoutes));
app.use("/api/v1/customization", asRouter(customizationRoutes));
app.use("/api/v1/activities", asRouter(activityRoutes));
app.use("/api/v1/contacts", asRouter(contactRoutes));

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = env.PORT;

const startServer = async () => {
  await initRedis();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
};

startServer();

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await closeRedis();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  await closeRedis();
  process.exit(0);
});

export default app;
