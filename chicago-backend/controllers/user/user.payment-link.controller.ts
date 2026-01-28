import { NextFunction, Request, Response } from "express";
import { OfflinePaymentService } from "../../services/user/offline.payment.service";
import CustomError from "../../utils/classes/custom-error";

export default class UserPaymentLinkController {
    private service = new OfflinePaymentService();

    // POST /api/v1/user/payment-links/pay
    async pay(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.processPayment(req.body);
            res.status(200).json(result);
        } catch (error) {
            next(new CustomError(500, (error as Error).message));
        }
    }
}
