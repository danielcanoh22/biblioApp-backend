import { Router } from "express";
import { GenreController } from "../controllers/genre-controller.js";

export const createGenresRouter = () => {
  const genreRouter = Router();

  genreRouter.get("/", GenreController.getAll);

  return genreRouter;
};
