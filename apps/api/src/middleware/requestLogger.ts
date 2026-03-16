import { Request, Response, NextFunction } from "express";
import { logRequest, logResponse } from "@/utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  logRequest(req);

  res.on("finish", () => {
    const responseTime = Date.now() - start;
    logResponse(req, res, responseTime);
  });

  next();
};
