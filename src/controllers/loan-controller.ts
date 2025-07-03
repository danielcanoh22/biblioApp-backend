import { NextFunction, Request, Response } from "express";
import {
  createLoanApiSchema,
  getLoansQuerySchema,
  updateLoanStatusApiSchema,
} from "../schemas/loan.js";
import { LoanService } from "../services/loan-service.js";
import { AppError } from "../middlewares/error-handler.js";

export class LoanController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = createLoanApiSchema.safeParse(req.body);

      if (!result.success) {
        res
          .status(400)
          .json({ error: result.error.format(), succeeded: false });
        return;
      }

      const newLoan = await LoanService.create(result.data);

      res.status(201).json({ data: newLoan, succeeded: true });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = getLoansQuerySchema.safeParse(req.query);

      if (!validationResult.success) {
        res
          .status(400)
          .json({ error: validationResult.error.format(), succeeded: false });
        return;
      }

      const queryData = validationResult.data;
      const loans = await LoanService.getAll(queryData);

      res.json({ data: loans, succeeded: true });
    } catch (error) {
      next(
        new AppError(
          "Ha ocurrido un error al obtener las solicitudes de préstamo"
        )
      );
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const loan = await LoanService.getById(id);
      res.json({ data: loan, succeeded: true });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = updateLoanStatusApiSchema.safeParse(req.body);

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

      await LoanService.updateStatus(id, result.data);

      res.json({
        message: "El estado del préstamo se actualizó correctamente",
        succeeded: true,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await LoanService.delete(id);

      res.json({
        message: "La solicitud de préstamo se eliminó correctamente",
        succeeded: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
