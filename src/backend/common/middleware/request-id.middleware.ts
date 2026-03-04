// src/backend/common/middleware/request-id.middleware.ts
import type { NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.id = (req.headers["x-request-id"] as string) || uuidv4();
    res.setHeader("X-Request-Id", req.id);
    next();
  }
}
