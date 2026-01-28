import { Response, Request, NextFunction } from "express";
import TransactionService from "../../services/user/transactions.service";

export default class UserTransactionController {
  transactionService = new TransactionService();

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.transactionService.findAll(
        //@ts-ignore
        req?.user?._id
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.transactionService.findOne(
        //@ts-ignore
        req?.user?._id,
        req.params.id

      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

}
