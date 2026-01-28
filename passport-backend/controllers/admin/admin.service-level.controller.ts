import AdminServiceService from "../../services/admin/service-levels.service";
import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminServiceController {
  serviceService = new AdminServiceService();

  async createServiceLevel(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        serviceLevel,
        time,
        nonRefundableFee,
        price,
        inboundFee,
        outboundFee,
        paymentGateway,
        authOnlyFrontend,
        amex,
        speedInWeeks,
        doubleCharge,
        serviceTypes,
        loa,
      } = req.body;

      if (
        !serviceLevel.trim() ||
        !time.trim() ||
        !nonRefundableFee ||
        !price ||
        !paymentGateway.trim() ||
        !authOnlyFrontend.trim() ||
        !doubleCharge.trim() ||
        !serviceTypes ||
        !loa
      ) {
        return res
          .status(400)
          .json({ message: "fields are missing", success: false });
      }

      const data = {
        serviceLevel,
        time,
        nonRefundableFee,
        price: Number(price),
        speedInWeeks: Number(speedInWeeks),
        inboundFee,
        outboundFee,
        paymentGateway,
        authOnlyFrontend,
        amex,
        doubleCharge,
        serviceTypes,
        loa,
      };

      const response = await this.serviceService.create(data);

      res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(new CustomError(500, (error as Error).message));
    }
  }

  //get all service levels
  async getAllServiceLevels(req: Request, res: Response, next: NextFunction) {
    try {
      const onlyActive = req.query.onlyActive === "true";
      const populateServiceType = req.query.populateServiceType !== "false";
      const response = await this.serviceService.findAll({
        onlyActive,
        populateServiceType,
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  // updating service level
  async updateServiceLevels(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        serviceLevel,
        time,
        speedInWeeks,
        nonRefundableFee,
        price,
        inboundFee,
        outboundFee,
        paymentGateway,
        authOnlyFrontend,
        amex,
        doubleCharge,
        serviceTypes,
        isDeleted,
        isActive,
        loa,
      } = req.body;

      const id = req.params.id;

      if (
        !serviceLevel.trim() ||
        !time.trim() ||
        !nonRefundableFee ||
        !price ||
        !paymentGateway.trim() ||
        !authOnlyFrontend.trim() ||
        !doubleCharge.trim() ||
        !serviceTypes ||
        !loa
      ) {
        return res
          .status(400)
          .json({ message: "fields are missing", success: false });
      }

      const data = {
        serviceLevel,
        time,
        nonRefundableFee,
        price: Number(price),
        speedInWeeks: Number(speedInWeeks),
        inboundFee,
        outboundFee,
        paymentGateway,
        authOnlyFrontend,
        amex,
        doubleCharge,
        serviceTypes,
        isDeleted,
        isActive,
        loa,
      };

      const response = await this.serviceService.findByIdAndUpdate(id, data);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  // activate serviceLevel
  async activateServiceLevel(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      if (!id.trim()) {
        return res
          .status(400)
          .json({ message: "service level id is missing", success: false });
      }
      const response = await this.serviceService.findByIdAndActive(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async toggleArchiveState(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      if (!id.trim()) {
        return res
          .status(400)
          .json({ message: "service level id is missing", success: false });
      }
      const response = await this.serviceService.toggleArchiveState(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
