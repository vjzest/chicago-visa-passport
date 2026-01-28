import { Response, Request, NextFunction } from "express";
import JurisdictionAddressService from "../../services/admin/jurisdiction-address.service";

export default class CommonJurisdictionAddressController {
  jurisdictionAddressService = new JurisdictionAddressService();

  async getByCountryCodes(req: Request, res: Response, next: NextFunction) {
    try {
      const { fromCountryCode, toCountryCode, stateCode } = req.query;

      if (!fromCountryCode || !toCountryCode) {
        return res.status(400).json({
          success: false,
          message: "fromCountryCode and toCountryCode are required",
        });
      }

      const response = await this.jurisdictionAddressService.findByCountryCodes(
        fromCountryCode as string,
        toCountryCode as string,
        stateCode as string | undefined
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
