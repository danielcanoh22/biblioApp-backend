import { Router } from "express";
import { BookController } from "../controllers/book-controller.js";

export const createBooksRouter = () => {
  const booksRouter = Router();

  booksRouter.post("/", BookController.create);
  booksRouter.get("/", BookController.getAll);
  booksRouter.get("/:id", BookController.getById);
  booksRouter.patch("/:id", BookController.update);
  booksRouter.delete("/:id", BookController.delete);

  return booksRouter;
};
