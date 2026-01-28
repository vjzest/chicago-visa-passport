import { Response, Request, NextFunction } from "express";
import ServiceTypeService from "../../services/admin/service-types.service";
import CustomError from "../../utils/classes/custom-error";

export default class UserServiceTypeController {
  serviceTypeService = new ServiceTypeService();

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.serviceTypeService.findAll({
        onlyActive: true,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
