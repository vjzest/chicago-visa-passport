import AdminServiceService from "../../services/admin/service-levels.service";
import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";

export default class CommonServiceController {
  serviceService = new AdminServiceService();
  async getAllServiceLevels(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.serviceService.findAll({ onlyActive: true });

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.serviceService.findById(req.params.id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
