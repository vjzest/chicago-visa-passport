import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import JurisdictionService from "../../services/admin/jurisdiction.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminJurisdictionController {
  jurisdictionService = new JurisdictionService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        countryPairId,
        consulateId,
        name,
        location,
        states,
        counties,
        notes,
      } = req.body;

      if (
        !countryPairId?.trim() ||
        !consulateId?.trim() ||
        !name?.trim() ||
        !location?.trim() ||
        !Array.isArray(states) ||
        states.length === 0
      ) {
        return res
          .status(400)
          .json({ message: "Required field is missing", success: false });
      }

      const data = {
        countryPairId,
        consulateId,
        name,
        location,
        states,
        counties,
        notes,
      };

      const response = await this.jurisdictionService.create(data);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getByCountryPair(req: Request, res: Response, next: NextFunction) {
    try {
      const { countryPairId } = req.params;
      const { onlyActive } = req.query;

      if (!countryPairId?.trim()) {
        return res
          .status(400)
          .json({ message: "Country pair ID is required", success: false });
      }

      const response = await this.jurisdictionService.findByCountryPair(
        countryPairId,
        {
          onlyActive: onlyActive === "true",
        }
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id?.trim()) {
        return res
          .status(400)
          .json({ message: "Jurisdiction ID is required", success: false });
      }

      const response = await this.jurisdictionService.findById(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }


  async update(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        countryPairId,
        consulateId,
        name,
        location,
        states,
        counties,
        notes,
      } = req.body;

      const { id } = req.params;

      if (
        !countryPairId?.trim() ||
        !consulateId?.trim() ||
        !name?.trim() ||
        !location?.trim() ||
        !Array.isArray(states) ||
        states.length === 0
      ) {
        return res
          .status(400)
          .json({ message: "Required field is missing", success: false });
      }

      const data = {
        countryPairId,
        consulateId,
        name,
        location,
        states,
        counties,
        notes,
      };

      const response = await this.jurisdictionService.findByIdAndUpdate(
        id,
        data
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async delete(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      if (!id?.trim()) {
        return res
          .status(400)
          .json({ message: "Jurisdiction ID is required", success: false });
      }

      const response = await this.jurisdictionService.findByIdAndDelete(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async toggleActive(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      if (!id?.trim()) {
        return res
          .status(400)
          .json({ message: "Jurisdiction ID is required", success: false });
      }

      const response = await this.jurisdictionService.findByIdAndToggleActive(
        id
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async bulkCreate(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { countryPairId, jurisdictions } = req.body;

      if (!countryPairId?.trim()) {
        return res.status(400).json({
          message: "Country pair ID is required",
          success: false,
        });
      }

      if (!Array.isArray(jurisdictions) || jurisdictions.length === 0) {
        return res.status(400).json({
          message: "Jurisdictions array is required and must not be empty",
          success: false,
        });
      }

      const response = await this.jurisdictionService.bulkCreate(
        countryPairId,
        jurisdictions
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
