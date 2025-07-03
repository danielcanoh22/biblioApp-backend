import { Router } from "express";
import { AuthorController } from "../controllers/author-controller.js";
import { authMiddleware } from "../middlewares/auth.js";

export const createAuthorsRouter = () => {
  const authorRouter = Router();

  authorRouter.get("/", authMiddleware, AuthorController.getAll);

  return authorRouter;
};
