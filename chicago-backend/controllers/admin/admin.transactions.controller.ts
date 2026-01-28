import { Response, NextFunction } from "express";
import TransactionService from "../../services/user/transactions.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminTransactionController {
  transactionService = new TransactionService();

  async findAll(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.transactionService.findAll(req?.admin?._id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findOne(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.transactionService.findOne(
        req?.admin?._id,
        req.params.caseId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findAllPaymentsByCase(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.transactionService.findAllPaymentsByCase(
        req.params.caseId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
