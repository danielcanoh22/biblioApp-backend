import { Router } from "express";
import { LoanController } from "../controllers/loan-controller.js";

export const createLoansRouter = () => {
  const loansRouter = Router();

  loansRouter.post("/", LoanController.create);

  return loansRouter;
};
