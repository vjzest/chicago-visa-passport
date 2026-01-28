import { Response, Request, NextFunction } from "express";
import CountryAccessService from "../../services/admin/country-access.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminCountryAccessController {
  countryAccessService = new CountryAccessService();

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.countryAccessService.findAll();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async getEnabledFromCountries(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response =
        await this.countryAccessService.getEnabledFromCountries();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async getEnabledToCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.countryAccessService.getEnabledToCountries();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async update(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { countryCode } = req.params;
      const { isEnabledFrom, isEnabledTo } = req.body;

      const response = await this.countryAccessService.update(countryCode, {
        isEnabledFrom,
        isEnabledTo,
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async bulkUpdate(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { updates } = req.body;

      if (!Array.isArray(updates)) {
        return res.status(400).json({
          success: false,
          message: "Updates must be an array",
        });
      }

      const response = await this.countryAccessService.bulkUpdate(updates);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async initialize(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.countryAccessService.initializeCountries();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
