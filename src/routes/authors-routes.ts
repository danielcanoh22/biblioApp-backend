import { Router } from "express";
import { AuthorController } from "../controllers/author-controller.js";

export const createAuthorsRouter = () => {
  const authorRouter = Router();

  authorRouter.get("/", AuthorController.getAll);

  return authorRouter;
};
