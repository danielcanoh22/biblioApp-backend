import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/error-handler.js";
import { UserService } from "../services/user-service.js";
import { getUsersQuerySchema, updateUserSchema } from "../schemas/user.js";

export class UserController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = getUsersQuerySchema.safeParse(req.query);

      if (!validationResult.success) {
        res
          .status(400)
          .json({ error: validationResult.error.format(), succeeded: false });
        return;
      }

      const queryData = validationResult.data;
      const users = await UserService.getAll(queryData);

      res.json({ data: users, succeeded: true });
    } catch (error) {
      next(new AppError("Ha ocurrido un error al obtener los usuarios"));
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.getById(id);
      res.json({ data: user, succeeded: true });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Usuario no autenticado", 401);
      }

      const { id } = req.params;

      const validatedData = updateUserSchema.parse(req.body);

      await UserService.update(Number(id), validatedData, req.user);

      res.status(200).json({
        succeeded: true,
        message: "Usuario actualizado correctamente",
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Usuario no autenticado", 401);
      }

      const { id } = req.params;

      await UserService.delete(id, req.user);

      res.json({
        message: "El usuario se eliminó correctamente",
        succeeded: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
