import { NextFunction, Request, Response } from "express";
import { AuthorService } from "../services/author-service.js";
import { AppError } from "../middlewares/error-handler.js";

export class AuthorController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const authors = await AuthorService.getAll();
      res.json({ data: authors, succeeded: true });
    } catch (error) {
      next(new AppError("Ha ocurrido un error al obtener los autores"));
    }
  }
}
