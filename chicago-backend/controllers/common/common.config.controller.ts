import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import ConfigService from "../../services/admin/config.service";

export default class CommonConfigController {
  private configService = new ConfigService();

  async getPaymentDisclaimer(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.configService.getPaymentDisclaimer();
      res.status(response.status).json(response);
    } catch (error) {
      next(
        new CustomError(
          500,
          error instanceof Error ? error.message : "Unknown error"
        )
      );
    }
  }

  async getTermsAndConditions(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.configService.findTermsAndConditions();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async getPrivacyPolicy(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.configService.findPrivacyPolicy();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async getRefundPolicy(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.configService.findRefundPolicy();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getGovFee(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.configService.getGovFee();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getOnlineProcessingFee(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.configService.getOnlineProcessingFee();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async getDepartureDateStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.configService.getDepartureDateField();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
