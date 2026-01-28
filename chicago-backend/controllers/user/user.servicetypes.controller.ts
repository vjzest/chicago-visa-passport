import { Response, Request, NextFunction } from "express";
import ServiceTypeService from "../../services/admin/service-types.service";
import CustomError from "../../utils/classes/custom-error";

export default class UserServiceTypeController {
  serviceTypeService = new ServiceTypeService();

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract query parameters for visa filtering
      const citizenOf = req.query.citizenOf as string | undefined;
      // const residingIn = req.query.residingIn as string | undefined;
      const travelingTo = req.query.travelingTo as string | undefined;
      const isEvisa = req.query.isEvisa as string | undefined;

      console.log("User Service Types Query Params:", {
        citizenOf,
        // residingIn,
        travelingTo,
        isEvisa,
      });

      const response = await this.serviceTypeService.findAll({
        onlyActive: true,
        citizenOf,
        // residingIn,
        travelingTo,
        isEvisa: isEvisa !== undefined ? isEvisa === "true" : undefined,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
