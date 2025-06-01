import { NextFunction, Request, Response } from "express";
import { BooksModel } from "../models/books-model.js";
import { AppError } from "../middlewares/error-handler.js";

export class BooksController {
  static async getAllBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const books = await BooksModel.getAllBooks();
      res.json({ data: books, succeeded: true });
    } catch (error) {
      next(new AppError("Ha ocurrido un error al obtener los libros"));
    }
  }

  static async getBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const book = await BooksModel.getBookById(id);

      if (!book) {
        throw new AppError("Libro no encontrado", 404);
      }

      res.json({ data: book, succeeded: true });
    } catch (error) {
      next(error);
    }
  }
}
