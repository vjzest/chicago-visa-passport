import { Response, Request, NextFunction } from "express";
import ConsularFeeService from "../../services/admin/consular-fee.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminConsularFeeController {
  consularFeeService = new ConsularFeeService();

  /**
   * Get all fees for a country pair
   */
  async findByCountryPair(req: Request, res: Response, next: NextFunction) {
    try {
      const { countryPairId } = req.params;
      const response = await this.consularFeeService.findByCountryPair(
        countryPairId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  /**
   * Get fees grouped by service level
   */
  async findGroupedByServiceLevel(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { countryPairId } = req.params;
      const response = await this.consularFeeService.findGroupedByServiceLevel(
        countryPairId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  /**
   * Get fees for a specific service level
   */
  async findByServiceLevel(req: Request, res: Response, next: NextFunction) {
    try {
      const { countryPairId, serviceLevelId } = req.params;
      const response = await this.consularFeeService.findByServiceLevel(
        countryPairId,
        serviceLevelId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  /**
   * Upsert a single fee
   */
  async upsert(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { countryPairId, serviceLevelId, serviceTypeId, fee } = req.body;

      if (!countryPairId || !serviceLevelId || !serviceTypeId || fee === undefined) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const response = await this.consularFeeService.upsert({
        countryPairId,
        serviceLevelId,
        serviceTypeId,
        fee: parseFloat(fee),
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  /**
   * Batch upsert multiple fees
   */
  async batchUpsert(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { countryPairId, serviceLevelId, fees } = req.body;

      if (!countryPairId || !serviceLevelId || !fees || !Array.isArray(fees)) {
        return res.status(400).json({
          success: false,
          message: "countryPairId, serviceLevelId, and fees array are required",
        });
      }

      const response = await this.consularFeeService.batchUpsert(
        countryPairId,
        serviceLevelId,
        fees
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  /**
   * Delete a specific fee
   */
  async delete(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { countryPairId, serviceLevelId, serviceTypeId } = req.params;
      const response = await this.consularFeeService.delete(
        countryPairId,
        serviceLevelId,
        serviceTypeId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  /**
   * Delete all fees for a service level
   */
  async deleteByServiceLevel(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { countryPairId, serviceLevelId } = req.params;
      const response = await this.consularFeeService.deleteByServiceLevel(
        countryPairId,
        serviceLevelId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}

