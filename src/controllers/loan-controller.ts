import { NextFunction, Request, Response } from "express";
import { createLoanApiSchema } from "../schemas/loan.js";
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
}
