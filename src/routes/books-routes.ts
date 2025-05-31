import { Router } from "express";
import { BooksController } from "../controllers/books-controller.js";

export const createBooksRouter = () => {
  const booksRouter = Router();

  booksRouter.get("/", BooksController.getAllBooks);
  booksRouter.get("/:id", BooksController.getBookById);

  return booksRouter;
};
