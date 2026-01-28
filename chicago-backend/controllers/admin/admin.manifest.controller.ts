import { AdminManifestService } from "../../services/admin/manifest.service";
import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminManifestController {
  manifestService = new AdminManifestService();

  async getManifestRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 10;

      const response = await this.manifestService.getManifestRecords({
        page,
        pageSize,
      });

      res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(new CustomError(500, (error as Error).message));
    }
  }

  async updateRemarks(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { remark } = req.body;
      const caseId = req.params.id;

      if (!caseId.trim()) {
        return res
          .status(400)
          .json({ message: "case id is missing", success: false });
      }

      const response = await this.manifestService.updateRemarks(caseId, remark);

      res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(new CustomError(500, (error as Error).message));
    }
  }

  async searchCases(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, dateOfBirth, email } = req.query;

      if (!fullName && !dateOfBirth && !email) {
        return res.status(400).json({
          success: false,
          message:
            "At least one search parameter is required (fullName, dateOfBirth, or email)",
        });
      }

      const response = await this.manifestService.searchCases({
        fullName: fullName as string,
        dateOfBirth: dateOfBirth as string,
        email: email as string,
      });

      res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getCaseById(req: Request, res: Response, next: NextFunction) {
    try {
      const { caseId } = req.params;

      if (!caseId || !caseId.trim()) {
        return res.status(400).json({
          success: false,
          message: "Case ID is required",
        });
      }

      const response = await this.manifestService.getCaseById(caseId);

      res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(new CustomError(500, (error as Error).message));
    }
  }
}
