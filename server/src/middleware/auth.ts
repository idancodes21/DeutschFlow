import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const { isAuthenticated } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
}
