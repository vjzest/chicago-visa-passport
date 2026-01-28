import { Response, NextFunction } from "express";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";
import ContingentCaseService from "../../services/common/contingent.service";

export default class AdminContingentController {
  private contingentCasesService = new ContingentCaseService();

  async sendReminderEmail(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const adminName = req.admin.firstName + " " + req.admin.lastName;
      const response = await this.contingentCasesService.sendContingentEmail(
        caseId,
        adminName
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
