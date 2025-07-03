import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AppError } from "./error-handler.js";
import { JWT_SECRET } from "../config/config.js";
import { JwtPayload } from "../types/express.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Acceso denegado", 401);
    }

    const token = authHeader.split(" ")[1];

    const decodedPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decodedPayload;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Token inválido", 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError("El token ha expirado", 401));
    } else {
      next(error);
    }
  }
};
