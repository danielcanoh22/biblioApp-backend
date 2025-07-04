import { Router } from "express";

import { UserController } from "../controllers/user-controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/admin.js";

export const createUsersRouter = () => {
  const usersRouter = Router();

  usersRouter.use(authMiddleware);
  usersRouter.get("/", adminMiddleware, UserController.getAll);
  usersRouter.get("/:id", UserController.getById);
  usersRouter.patch("/:id", adminMiddleware, UserController.update);
  usersRouter.delete("/:id", adminMiddleware, UserController.delete);

  return usersRouter;
};
