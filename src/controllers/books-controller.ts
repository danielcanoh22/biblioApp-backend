import { Request, Response } from "express";
import { BooksModel } from "../models/books-model.js";

export class BooksController {
  static async getAllBooks(req: Request, res: Response) {
    try {
      const books = await BooksModel.getAllBooks();
      res.json({ data: books, succeeded: true });
    } catch (error) {
      res.status(500).json({
        message: (error as Error).message,
        succeeded: false,
      });
    }
  }

  static async getBookById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await BooksModel.getBookById(id);
      res.json({ data: book, succeeded: true });
    } catch (error) {
      res.status(500).json({
        message: (error as Error).message,
        succeeded: false,
      });
    }
  }
}
