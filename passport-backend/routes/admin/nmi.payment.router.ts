import express, { NextFunction, Request, Response } from "express";
import NmiPaymentController from "../../controllers/admin/nmi.payment.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminNmiRouter = express.Router();
const nmiPaymentController = new NmiPaymentController();

adminNmiRouter.use(adminAuthMiddleware);

adminNmiRouter
  // .post(
  //   "/initiate-payment",
  //   (req: Request, res: Response, next: NextFunction) => {
  //     nmiPaymentController.initiatePayment(req, res);
  //   }
  // )
  .post("/refund", (req: Request, res: Response, next: NextFunction) => {
    nmiPaymentController.refundPayment(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  })
  .post("/void", (req: Request, res: Response, next: NextFunction) => {
    nmiPaymentController.voidTransaction(req as AuthenticatedAdminRequest, res);
  });

export default adminNmiRouter;
