import { Response, Request, NextFunction } from "express";
import CountryPairService from "../../services/admin/country-pair.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminCountryPairController {
  countryPairService = new CountryPairService();

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.countryPairService.findAll();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await this.countryPairService.findOne(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async create(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        fromCountryCode,
        fromCountryName,
        toCountryCode,
        toCountryName,
        isJurisdictional,
      } = req.body;

      if (
        !fromCountryCode ||
        !fromCountryName ||
        !toCountryCode ||
        !toCountryName
      ) {
        return res.status(400).json({
          success: false,
          message: "All country fields are required",
        });
      }

      const response = await this.countryPairService.create({
        fromCountryCode,
        fromCountryName,
        toCountryCode,
        toCountryName,
        isJurisdictional: isJurisdictional || false,
      });

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
      const { id } = req.params;
      const { isJurisdictional, isActive } = req.body;

      const response = await this.countryPairService.update(id, {
        isJurisdictional,
        isActive,
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async toggleActive(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const response = await this.countryPairService.toggleActive(id);
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
