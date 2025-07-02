import { NextFunction, Request, Response } from "express";
import { createLoanApiSchema, getLoansQuerySchema } from "../schemas/loan.js";
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
}
