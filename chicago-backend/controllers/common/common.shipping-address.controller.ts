import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import ShippingAddressService from "../../services/admin/shippings.service";

export default class CommonShippingAddressController {
  private shippingService = new ShippingAddressService();

  async getAllShippingAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.shippingService.findAll({ onlyActive: true });
      res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(new CustomError(500, (error as Error).message));
    }
  }
}
