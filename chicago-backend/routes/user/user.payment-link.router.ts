import express from "express";
import UserPaymentLinkController from "../../controllers/user/user.payment-link.controller";

const userPaymentLinkRouter = express.Router();
const controller = new UserPaymentLinkController();

// POST /api/v1/user/payment-links/pay
userPaymentLinkRouter.post(
    "/pay",
    (req, res, next) => controller.pay(req, res, next)
);

export default userPaymentLinkRouter;
