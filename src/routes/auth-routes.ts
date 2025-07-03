import { Router } from "express";
import { AuthController } from "../controllers/auth-controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/admin.js";

export const createAuthRouter = () => {
  const authRouter = Router();

  authRouter.post(
    "/register",
    authMiddleware,
    adminMiddleware,
    AuthController.register
  );
  authRouter.post("/login", AuthController.login);

  return authRouter;
};
