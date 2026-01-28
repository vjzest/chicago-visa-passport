import ServiceTypesService from "../../services/admin/service-types.service";
import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";

export default class CommonServiceController {
  serviceTypesService = new ServiceTypesService();

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.serviceTypesService.findOne(
        req.params.visaTypeId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
