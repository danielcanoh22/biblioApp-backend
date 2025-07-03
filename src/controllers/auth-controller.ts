import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.js";
import { AuthService } from "../services/auth-service.js";
import { NODE_ENV } from "../config/config.js";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = registerSchema.safeParse(req.body);

      if (!validationResult.success) {
        res
          .status(400)
          .json({ error: validationResult.error.format(), succeeded: false });
        return;
      }

      const newUser = await AuthService.register(validationResult.data);

      res.status(201).json({
        data: newUser,
        succeeded: true,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = loginSchema.safeParse(req.body);

      if (!validationResult.success) {
        res
          .status(400)
          .json({ error: validationResult.error.format(), succeeded: false });
        return;
      }

      const { user, token } = await AuthService.login(validationResult.data);

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ data: { user }, succeeded: true });
    } catch (error) {
      next(error);
    }
  }
}
