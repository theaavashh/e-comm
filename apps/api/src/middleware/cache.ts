import { Request, Response, NextFunction } from "express";
import { cacheGet, cacheSet } from "@/config/redis";
import { env } from "@/config/env";

interface CacheOptions {
  ttl?: number;
  keyGenerator?: (req: Request) => string;
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  const {
    ttl = 300,
    keyGenerator = (req: Request) => {
      return `cache:${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;
    },
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    if (env.NODE_ENV === "development") {
      return next();
    }

    if (req.method !== "GET") {
      return next();
    }

    const cacheKey = keyGenerator(req);

    try {
      const cached = await cacheGet(cacheKey);

      if (cached) {
        res.setHeader("X-Cache", "HIT");
        return res.json(JSON.parse(cached));
      }

      const originalJson = res.json.bind(res);

      res.json = (body: any) => {
        cacheSet(cacheKey, JSON.stringify(body), ttl).catch((err) => {
          console.error("Cache set error:", err);
        });
        return originalJson(body);
      };

      res.setHeader("X-Cache", "MISS");
      return next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      return next();
    }
  };
};

export const invalidateCache = async (pattern: string): Promise<number> => {
  const { cacheDeletePattern } = await import("@/config/redis");
  return cacheDeletePattern(pattern);
};
