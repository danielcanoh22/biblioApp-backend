import { Request, Response } from "express";
import { BooksModel } from "../models/books-model.js";

export class BooksController {
  static async getAll(req: Request, res: Response) {
    const books = await BooksModel.getAll();
    console.log(books);
    res.json(books);
  }
}
