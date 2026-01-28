import express, { NextFunction, Request, Response } from "express";
import AdminTransactionController from "../../controllers/admin/admin.transactions.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminTransactionsRouter = express.Router();
const userTransactionController = new AdminTransactionController();

adminTransactionsRouter.use(adminAuthMiddleware);

adminTransactionsRouter.get(
  "/",

  (req: Request, res: Response, next: NextFunction) => {
    return userTransactionController.findAll(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminTransactionsRouter.get(
  "/:caseId",

  (req: Request, res: Response, next: NextFunction) => {
    return userTransactionController.findOne(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminTransactionsRouter.get(
  "/payments/:caseId",

  (req: Request, res: Response, next: NextFunction) => {
    return userTransactionController.findAllPaymentsByCase(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

export default adminTransactionsRouter;
