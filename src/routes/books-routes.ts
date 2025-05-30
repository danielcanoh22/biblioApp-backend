import { Router } from "express";
import { BooksController } from "../controllers/books-controller.js";

export const createBooksRouter = () => {
  const booksRouter = Router();

  booksRouter.get("/", BooksController.getAll);

  return booksRouter;
};
