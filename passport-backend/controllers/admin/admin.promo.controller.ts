import PromoService from "../../services/admin/promo.service";
import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminPromoController {
  promoService = new PromoService();

  // create coupon
  async createCoupon(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { code, codeType, discount, active, startDate, endDate, min, max } =
        req.body;

      if (
        !code.trim() ||
        !codeType.trim() ||
        !discount.trim() ||
        Number(max) < 0 ||
        Number(min) < 0 ||
        !startDate.trim() ||
        !endDate.trim()
      ) {
        return res
          .status(400)
          .json({ message: "required field is missing", success: false });
      }
      const data = {
        code,
        codeType,
        discount,
        active,
        startDate,
        endDate,
        min,
        max,
      };

      const response = await this.promoService.create(data);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getAllCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.promoService.findAll();

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  // promo-code updating
  async updateCoupon(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { code, codeType, discount, active, startDate, endDate, min, max } =
        req.body;
      const id = req.params.id;

      if (
        !code.trim() ||
        !codeType.trim() ||
        !discount.trim() ||
        Number(max) < 0 ||
        Number(min) < 0 ||
        !startDate.trim() ||
        !endDate.trim() ||
        !id.trim()
      ) {
        return res
          .status(400)
          .json({ message: "required field is missing", success: false });
      }
      const data = {
        code,
        codeType,
        discount,
        active,
        startDate,
        endDate,
        min,
        max,
      };
      const response = await this.promoService.findByIdAndUpdate(id, data);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  // Deleting promo-code
  async deleteCoupon(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      if (!id.trim()) {
        return res
          .status(400)
          .json({ message: "required field is missing", success: false });
      }
      const response = await this.promoService.findByIdAndDelete(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  // activate coupon
  async activeCoupon(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      if (!id.trim()) {
        return res
          .status(400)
          .json({ message: "required field is missing", success: false });
      }
      const response = await this.promoService.findByIdAndActive(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
