import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import AdminServiceLevelService from "../../services/admin/service-levels.service";

export default class UserServiceLevelController {
  serviceLevelService = new AdminServiceLevelService();

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.serviceLevelService.findAll({
        onlyActive: true,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
