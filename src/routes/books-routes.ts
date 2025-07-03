import { Router } from "express";
import { BookController } from "../controllers/book-controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/admin.js";

export const createBooksRouter = () => {
  const booksRouter = Router();

  booksRouter.use(authMiddleware);
  booksRouter.post("/", adminMiddleware, BookController.create);
  booksRouter.get("/", BookController.getAll);
  booksRouter.get("/:id", BookController.getById);
  booksRouter.patch("/:id", adminMiddleware, BookController.update);
  booksRouter.delete("/:id", adminMiddleware, BookController.delete);

  return booksRouter;
};
