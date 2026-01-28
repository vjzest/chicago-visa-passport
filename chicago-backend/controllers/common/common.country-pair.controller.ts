import { Response, Request, NextFunction } from "express";
import CountryPairService from "../../services/admin/country-pair.service";

export default class CommonCountryPairController {
  countryPairService = new CountryPairService();

  async getEnabledFromCountries(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.countryPairService.getEnabledFromCountries();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async getEnabledToCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const { fromCountryCode } = req.query;
      const response = await this.countryPairService.getEnabledToCountries(
        fromCountryCode as string
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
