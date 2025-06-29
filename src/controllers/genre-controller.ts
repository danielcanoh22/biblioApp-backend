import { NextFunction, Request, Response } from "express";
import { GenreService } from "../services/genre-service.js";
import { AppError } from "../middlewares/error-handler.js";

export class GenreController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const genres = await GenreService.getAll();
      res.json({ data: genres, succeeded: true });
    } catch (error) {
      next(new AppError("Ha ocurrido un error al obtener los géneros"));
    }
  }
}
