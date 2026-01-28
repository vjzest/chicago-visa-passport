import PromoService from "../../services/common/promo.service";
import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";

export default class CommonPromoController {
  promoService = new PromoService();

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.params.code;
      const response = await this.promoService.findByCode(code);
      if (!response?.data) {
        return res
          .status(400)
          .json({ message: `Invalid Promo Code`, success: false });
      }
      const startDay = new Date(response?.data.startDate).setHours(0, 0, 0);
      const endDay = new Date(response?.data.endDate).setHours(23, 59, 59);
      const currentDay = new Date().setHours(0, 0, 0);
      if (endDay < currentDay || startDay > currentDay) {
        return res
          .status(400)
          .json({ message: "Invalid Promo Code", success: false });
      }

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
