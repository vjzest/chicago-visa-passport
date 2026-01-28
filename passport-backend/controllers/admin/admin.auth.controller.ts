import AuthService from "../../services/admin/auth.service";
import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";
import { getIpFromRequest } from "../../utils/text.utils";

export default class AdminAuthController {
  authService = new AuthService();

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const ipAddress = getIpFromRequest(req);
      const response = await this.authService.login(email, password, ipAddress);

      return res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async getProfile(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.authService.getProfile(req.admin?._id);

      if (response.success) {
        res.json({
          success: true,
          data: response.data,
        });
      }
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
