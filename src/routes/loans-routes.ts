import { Router } from "express";
import { LoanController } from "../controllers/loan-controller.js";

export const createLoansRouter = () => {
  const loansRouter = Router();

  loansRouter.post("/", LoanController.create);
  loansRouter.get("/", LoanController.getAll);
  loansRouter.get("/:id", LoanController.getById);
  loansRouter.patch("/:id", LoanController.updateStatus);
  loansRouter.delete("/:id", LoanController.delete);

  return loansRouter;
};
