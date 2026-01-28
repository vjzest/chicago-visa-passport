import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import AdminAdditionalService from "../../services/admin/additional.service";

export default class CommonAdditionalController {
  private additionalService = new AdminAdditionalService();

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceType } = req.query;
      const queryArg = {
        ...(serviceType ? { serviceType: String(serviceType) } : {}),
        isActive: true,
      };
      const response = await this.additionalService.findAll(queryArg);

      res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(new CustomError(500, (error as Error).message));
    }
  }
}
