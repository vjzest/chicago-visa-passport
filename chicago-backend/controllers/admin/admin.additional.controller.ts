import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import AdditionalService from "../../services/admin/additional.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminAdditionalController {
  additionalService = new AdditionalService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, price, description, description2, serviceTypes, addons } =
        req.body;

      if (
        !title.trim() ||
        !price ||
        !description.trim() ||
        serviceTypes.length < 1
      ) {
        return res
          .status(400)
          .json({ message: "some field missing", success: false });
      }

      const data: any = {
        title,
        price,
        description,
        description2,
        serviceTypes,
        addons,
      };

      const response = await this.additionalService.create(data);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceType } = req.query;
      const queryArg = serviceType
        ? { serviceType: String(serviceType) }
        : null;
      const response = await this.additionalService.findAll(queryArg);

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
      const {
        title,
        price,

        description,
        description2,
        serviceTypes,
        addons,
      } = req.body;

      const id = req.params.id;

      if (
        !title.trim() ||
        !price ||
        !description.trim() ||
        serviceTypes.length < 1
      ) {
        return res
          .status(400)
          .json({ message: "some field missing", success: false });
      }

      const data: any = {
        title,
        price,
        description,
        description2,
        serviceTypes,
        addons,
      };
      const response = await this.additionalService.findByIdAndUpdate(id, data);

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
      const response = await this.additionalService.findByIdAndDelete(id);

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
          .json({ message: "Additional Service is missing", success: false });
      }
      const response = await this.additionalService.findByIdAndActive(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
