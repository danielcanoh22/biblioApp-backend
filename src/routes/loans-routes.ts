import { Router } from "express";
import { LoanController } from "../controllers/loan-controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/admin.js";

export const createLoansRouter = () => {
  const loansRouter = Router();

  loansRouter.use(authMiddleware);
  loansRouter.post("/", LoanController.create);
  loansRouter.get("/", LoanController.getAll);
  loansRouter.get("/:id", LoanController.getById);
  loansRouter.patch(
    "/:id",
    authMiddleware,
    adminMiddleware,
    LoanController.updateStatus
  );
  loansRouter.delete("/:id", LoanController.delete);

  return loansRouter;
};
