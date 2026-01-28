import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import ShippingService from "../../services/admin/shippings.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminShippingController {
  shippingService = new ShippingService();

  async createShippingAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const {
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
        !locationName.trim() ||
        !company.trim() ||
        !authorisedPerson.trim() ||
        !address.trim() ||
        !city.trim() ||
        !state.trim() ||
        !zipCode.trim()
      ) {
        return res
          .status(400)
          .json({ message: "some field missing", success: false });
      }

      const data = {
        locationName,
        company,
        authorisedPerson,
        address,
        city,
        state,
        address2,
        zipCode,
        instruction,
      };

      const response = await this.shippingService.create(data);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getAllShippingAddress(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { onlyAllowed } = req.query;
      const allowedLocations: string[] = [];
      (req.admin.role.viewCasesByLocation as Map<string, boolean>).forEach(
        (value, key) => {
          if (value) allowedLocations.push(key);
        }
      );
      const response = await this.shippingService.findAll({
        onlyAllowed: onlyAllowed === "true",
        allowedLocations,
      });

      res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(new CustomError(500, (error as Error).message));
    }
  }

  // shipping address updating
  async updateShippingAddress(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
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

      const id = req.params.id;

      if (
        !locationName.trim() ||
        !company.trim() ||
        !authorisedPerson.trim() ||
        !address.trim() ||
        !city.trim() ||
        !state.trim() ||
        !zipCode.trim()
      ) {
        return res
          .status(400)
          .json({ message: "some field missing", success: false });
      }
      const data = {
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
      const response = await this.shippingService.findByIdAndUpdate(id, data);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  // Deleting shippingAddress
  async deleteShippingAddress(
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
      const response = await this.shippingService.findByIdAndDelete(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  // activate shipping address
  async activateShippingAddress(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      if (!id.trim()) {
        return res
          .status(400)
          .json({ message: "shipping id is missing", success: false });
      }
      const response = await this.shippingService.findByIdAndActive(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
