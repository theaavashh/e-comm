import { createClient, RedisClientType } from "redis";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

let redisClient: RedisClientType | null = null;

export const initRedis = async (): Promise<RedisClientType | null> => {
  if (!env.REDIS_URL) {
    logger.warn("REDIS_URL not configured, Redis will not be used");
    return null;
  }

  try {
    redisClient = createClient({
      url: env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error("Redis reconnection failed after 10 attempts");
            return new Error("Redis reconnection failed");
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on("error", (err) => {
      logger.error("Redis Client Error:", err);
    });

    redisClient.on("connect", () => {
      logger.info("Redis client connected");
    });

    redisClient.on("ready", () => {
      logger.info("Redis client ready");
    });

    redisClient.on("reconnecting", () => {
      logger.warn("Redis client reconnecting...");
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error("Failed to initialize Redis:", error);
    return null;
  }
};

export const getRedisClient = (): RedisClientType | null => {
  return redisClient;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    logger.info("Redis client closed");
  }
};

export const cacheGet = async (key: string): Promise<string | null> => {
  if (!redisClient) return null;
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.error("Redis GET error:", error);
    return null;
  }
};

export const cacheSet = async (
  key: string,
  value: string,
  ttlSeconds?: number,
): Promise<boolean> => {
  if (!redisClient) return false;
  try {
    if (ttlSeconds) {
      await redisClient.setEx(key, ttlSeconds, value);
    } else {
      await redisClient.set(key, value);
    }
    return true;
  } catch (error) {
    logger.error("Redis SET error:", error);
    return false;
  }
};

export const cacheDelete = async (key: string): Promise<boolean> => {
  if (!redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error("Redis DEL error:", error);
    return false;
  }
};

export const cacheDeletePattern = async (pattern: string): Promise<number> => {
  if (!redisClient) return 0;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      return await redisClient.del(keys);
    }
    return 0;
  } catch (error) {
    logger.error("Redis DEL pattern error:", error);
    return 0;
  }
};
