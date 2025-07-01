import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/error-handler.js";
import {
  validateApiBook,
  validateApiPartialBook,
  validateQueryParams,
} from "../schemas/book.js";
import { BookService } from "../services/book-service.js";

export class BookController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validateApiBook(req.body);

      if (!result.success) {
        res
          .status(400)
          .json({ error: result.error.format(), succeeded: false });
        return;
      }

      const newBook = await BookService.create(result.data);

      res.status(201).json({ data: newBook, succeeded: true });
    } catch (error) {
      next(new AppError("Ha ocurrido un error al crear el libro"));
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = validateQueryParams(req.query);

      if (!validationResult.success) {
        res
          .status(400)
          .json({ error: validationResult.error.format(), succeeded: false });
        return;
      }

      const queryData = validationResult.data;
      const books = await BookService.getAll(queryData);

      res.json({ data: books, succeeded: true });
    } catch (error) {
      next(new AppError("Ha ocurrido un error al obtener los libros"));
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const book = await BookService.getById(id);
      res.json({ data: book, succeeded: true });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validateApiPartialBook(req.body);

      if (!result.success) {
        res
          .status(400)
          .json({ error: result.error.format(), succeeded: false });
        return;
      }

      const { id } = req.params;
      const apiData = result.data;

      if (Object.keys(apiData).length === 0) {
        res.json({
          message: "No se proporcionaron datos para actualizar",
        });
        return;
      }

      await BookService.update(id, apiData);

      res.json({
        message: "El libro se actualizó correctamente",
        succeeded: true,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await BookService.delete(id);

      res.json({
        message: "El libro se eliminó correctamente",
        succeeded: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
