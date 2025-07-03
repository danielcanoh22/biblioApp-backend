import { Router } from "express";
import { AuthController } from "../controllers/auth-controller.js";

export const createAuthRouter = () => {
  const authRouter = Router();

  authRouter.post("/register", AuthController.register);
  authRouter.post("/login", AuthController.login);

  return authRouter;
};
