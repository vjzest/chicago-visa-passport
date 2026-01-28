import express from "express";
import adminPaymentLinkController from "../../controllers/admin/admin.payment-link.controller";
import { adminAuthMiddleware } from "../../middlewares/auth.middleware";

const adminPaymentLinkRouter = express.Router();

adminPaymentLinkRouter.get("/", adminAuthMiddleware, adminPaymentLinkController.getAll);
adminPaymentLinkRouter.post("/generate", adminAuthMiddleware, adminPaymentLinkController.generate);

export default adminPaymentLinkRouter;
