import express, { NextFunction, Request, Response } from "express";
import UserTransactionController from "../../controllers/user/user.transactions.controller";
import { userAuthMiddleware } from "../../middlewares/auth.middleware";

const userTransactionsRouter = express.Router();
const userTransactionController = new UserTransactionController();

userTransactionsRouter.use(userAuthMiddleware);



userTransactionsRouter.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    return userTransactionController.findAll(req, res, next);
  }
);
userTransactionsRouter.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    return userTransactionController.findOne(req, res, next);
  }
);




export default userTransactionsRouter;
