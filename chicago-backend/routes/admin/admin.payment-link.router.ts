import express from "express";
import adminPaymentLinkController from "../../controllers/admin/admin.payment-link.controller";
import { adminAuthMiddleware } from "../../middlewares/auth.middleware";

const adminPaymentLinkRouter = express.Router();

adminPaymentLinkRouter.use(adminAuthMiddleware);

adminPaymentLinkRouter.get("/", (req, res, next) => adminPaymentLinkController.getAll(req, res, next));
adminPaymentLinkRouter.post("/generate", (req, res, next) => adminPaymentLinkController.generate(req, res, next));

export default adminPaymentLinkRouter;
