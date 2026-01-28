import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import ConfigService from "../../services/admin/config.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminConfigController {
  configService = new ConfigService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, price } = req.body;

      if (!title.trim() || !price) {
        return res
          .status(400)
          .json({ message: "some field missing", success: false });
      }

      const data: any = { title, price };

      const response = await this.configService.create(data);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.configService.findAll();
      res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(new CustomError(500, (error as Error).message));
    }
  }

  async update(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, price } = req.body;

      const id = req.params.id;

      if (!title.trim() || !price) {
        return res
          .status(400)
          .json({ message: "some field missing", success: false });
      }
      const data = { title, price };
      const response = await this.configService.findByIdAndUpdate(id, data);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  //   // Deleting
  async delete(
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
      const response = await this.configService.findByIdAndDelete(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  // activate
  async activate(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      if (!id.trim()) {
        return res
          .status(400)
          .json({ message: "processor id is missing", success: false });
      }
      const response = await this.configService.findByIdAndActive(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  // update terms and conditions
  async updateTermsAndConditions(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { content, verbiage } = req.body;
      const data = { content, verbiage };
      const response = await this.configService.tNCFindByIdAndUpdate(data);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async updatePrivacyPolicy(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { content } = req.body;
      const response = await this.configService.updatePrivacyPolicy(content);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async updateRefundPolicy(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { content } = req.body;
      const response = await this.configService.updateRefundPolicy(content);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async updateOnlineProcessingFee(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fee, chargeFee } = req.body;
      const response = await this.configService.updateOnlineProcessingFee(
        fee,
        chargeFee
      );

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
      next(
        new CustomError(
          500,
          error instanceof Error ? error.message : "Unknown error"
        )
      );
    }
  }

  async getGovFee(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.configService.getGovFee();
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
  async updateGovFee(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fee } = req.body;
      const response = await this.configService.updateGovFee(Number(fee));

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
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
  async updatePaymentDisclaimer(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { disclaimer } = req.body;
      const response = await this.configService.updatePaymentDisclaimer(
        String(disclaimer)
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.configService.findTermsAndConditions();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
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
  async getLoadBalancerSetup(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.configService.getLoadBalancerSetup();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async editLoadBalancerSetup(req: Request, res: Response, next: NextFunction) {
    try {
      const newSetupData = req.body.processors;
      const response = await this.configService.editLoadBalancerSetup(
        newSetupData
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async getIpLockStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.configService.getIpLockStatus();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async toggleIpLock(req: Request, res: Response, next: NextFunction) {
    try {
      const { action } = req.params as { action: "enable" | "disable" };
      const response = await this.configService.toggleIpLock(action);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getDepartureDateField(
    req: AuthenticatedAdminRequest,
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
  async toggleDepartureDateField(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.configService.toggleDepartureDateField();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
