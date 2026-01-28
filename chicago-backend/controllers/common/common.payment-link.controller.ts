import { NextFunction, Request, Response } from "express";
import { PaymentLinkModel } from "../../models/payment-links.model";
import CustomError from "../../utils/classes/custom-error";

export default class CommonPaymentLinkController {

    // GET /api/v1/common/payment-links/:token
    async getPaymentLink(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;

            if (!token) {
                return next(new CustomError(400, "Token is required"));
            }

            const paymentLink = await PaymentLinkModel.findOne({ token })
                .populate("serviceType", "serviceType")
                .populate("serviceLevel", "serviceLevel price");

            if (!paymentLink) {
                return next(new CustomError(404, "Invalid or expired payment link"));
            }

            // Check for expiry
            if (paymentLink.expiresAt < new Date()) {
                return next(new CustomError(400, "This payment link has expired"));
            }

            // Check if already used
            if (paymentLink.status !== 'active') {
                return next(new CustomError(400, "This payment link is no longer active"));
            }

            res.status(200).json({
                success: true,
                data: paymentLink,
                message: "Payment link retrieved successfully"
            });

        } catch (error) {
            next(new CustomError(500, (error as Error).message));
        }
    }
}
