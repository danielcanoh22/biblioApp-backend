import { Router } from "express";
import { GenreController } from "../controllers/genre-controller.js";
import { authMiddleware } from "../middlewares/auth.js";

export const createGenresRouter = () => {
  const genreRouter = Router();

  genreRouter.get("/", authMiddleware, GenreController.getAll);

  return genreRouter;
};
