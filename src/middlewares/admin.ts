import { Request, Response, NextFunction } from "express";
import { AppError } from "./error-handler.js";
import { USER_ROLE } from "../types/user.js";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== USER_ROLE.ADMIN) {
    throw new AppError(
      "Acceso denegado. Se requiere rol de administrador.",
      403
    );
  }

  next();
};
