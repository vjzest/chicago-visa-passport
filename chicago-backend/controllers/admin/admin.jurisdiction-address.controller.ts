import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import JurisdictionAddressService from "../../services/admin/jurisdiction-address.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminJurisdictionAddressController {
  jurisdictionAddressService = new JurisdictionAddressService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        countryPairId,
        jurisdictionId,
        locationName,
        company,
        authorisedPerson,
        address,
        address2,
        city,
        state,
        zipCode,
        instruction,
      } = req.body;

      if (
        !countryPairId?.trim() ||
        !jurisdictionId?.trim() ||
        !locationName?.trim() ||
        !company?.trim() ||
        !authorisedPerson?.trim() ||
        !address?.trim() ||
        !city?.trim() ||
        !state?.trim() ||
        !zipCode?.trim()
      ) {
        return res
          .status(400)
          .json({ message: "Required field is missing", success: false });
      }

      const data = {
        countryPairId,
        jurisdictionId,
        locationName,
        company,
        authorisedPerson,
        address,
        address2,
        city,
        state,
        zipCode,
        instruction,
      };

      const response = await this.jurisdictionAddressService.create(data);
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
          .json({ message: "Address ID is required", success: false });
      }

      const response = await this.jurisdictionAddressService.findById(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getByCountryPair(req: Request, res: Response, next: NextFunction) {
    try {
      const { countryPairId } = req.params;
      const { onlyActive, jurisdictionId } = req.query;

      if (!countryPairId?.trim()) {
        return res
          .status(400)
          .json({ message: "Country pair ID is required", success: false });
      }

      const response = await this.jurisdictionAddressService.findByCountryPair(
        countryPairId,
        {
          onlyActive: onlyActive === "true",
          jurisdictionId: jurisdictionId as string,
        }
      );

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
        jurisdictionId,
        locationName,
        company,
        authorisedPerson,
        address,
        address2,
        city,
        state,
        zipCode,
        instruction,
      } = req.body;

      const { id } = req.params;

      if (
        !countryPairId?.trim() ||
        !jurisdictionId?.trim() ||
        !locationName?.trim() ||
        !company?.trim() ||
        !authorisedPerson?.trim() ||
        !address?.trim() ||
        !city?.trim() ||
        !state?.trim() ||
        !zipCode?.trim()
      ) {
        return res
          .status(400)
          .json({ message: "Required field is missing", success: false });
      }

      const data = {
        countryPairId,
        jurisdictionId,
        locationName,
        company,
        authorisedPerson,
        address,
        address2,
        city,
        state,
        zipCode,
        instruction,
      };

      const response = await this.jurisdictionAddressService.findByIdAndUpdate(
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
          .json({ message: "Address ID is required", success: false });
      }

      const response = await this.jurisdictionAddressService.findByIdAndDelete(
        id
      );
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
          .json({ message: "Address ID is required", success: false });
      }

      const response =
        await this.jurisdictionAddressService.findByIdAndToggleActive(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
