import winston from "winston";
import { env } from "@/config/env";
import { cacheSet } from "@/config/redis";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} ${level}: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  }),
);

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: env.NODE_ENV === "production" ? jsonFormat : consoleFormat,
  }),
];

if (env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: jsonFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: jsonFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
  );
}

export const logger = winston.createLogger({
  level: env.NODE_ENV === "development" ? "debug" : "info",
  levels,
  transports,
  exitOnError: false,
});

export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export const logRequest = (req: any) => {
  const logData = {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.get("user-agent"),
    timestamp: new Date().toISOString(),
  };

  logger.http(`${req.method} ${req.url} - ${req.ip || "unknown IP"}`);

  if (env.NODE_ENV === "production") {
    cacheSet(`log:request:${Date.now()}`, JSON.stringify(logData), 3600).catch(
      () => {},
    );
  }
};

export const logResponse = (req: any, res: any, responseTime: number) => {
  const logData = {
    method: req.method,
    url: req.url,
    status: res.statusCode,
    responseTime: `${responseTime}ms`,
    ip: req.ip || req.connection?.remoteAddress,
    timestamp: new Date().toISOString(),
  };

  const level = res.statusCode >= 400 ? "warn" : "http";
  logger.log(
    level,
    `${req.method} ${req.url} - ${res.statusCode} - ${responseTime}ms`,
  );

  if (env.NODE_ENV === "production") {
    cacheSet(`log:response:${Date.now()}`, JSON.stringify(logData), 3600).catch(
      () => {},
    );
  }
};
