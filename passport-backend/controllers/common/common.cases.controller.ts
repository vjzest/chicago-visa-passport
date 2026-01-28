import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import CasesService from "../../services/common/cases.service";
import { getTokenInfo } from "../../middlewares/auth.middleware";
import { getIpFromRequest } from "../../utils/text.utils";
import CaseService from "../../services/user/case.service";
import CasesQueryService from "../../services/admin/cases-query.service";

export default class CommonCasesController {
  casesService = new CasesService();
  casesService2 = new CaseService();
  casesQueryService = new CasesQueryService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const caseData = req.body;

      // Ensure all required arguments are passed
      if (!caseData?.caseInfo) {
        return res.status(400).json({
          success: false,
          message: "Missing required data",
        });
      }

      let tokenData = getTokenInfo(req);

      const response = await this.casesService.create(
        caseData,
        tokenData && typeof tokenData === "object" ? tokenData.id : "",
        getIpFromRequest(req)
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async checkIfEmailUsed(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;

      let tokenData = getTokenInfo(req);

      const response = await this.casesService.checkIfEmailUsed(
        email,
        tokenData && typeof tokenData === "object" ? tokenData.id : ""
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getCaseByIdAndNo(req: Request, res: Response, next: NextFunction) {
    try {
      const { caseId, caseNo } = req.params;
      console.log(`[DEBUG] getCaseByIdAndNo - ID: ${caseId}, No: ${caseNo}`);
      const response = await this.casesQueryService.findOneByCaseIdAndNo(
        caseId,
        caseNo
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async createOrUpdateContingentCase(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.query;
      console.log("case id from params : ", caseId);
      const data = req.body;
      const response = await this.casesService2.createOrUpdateContingentCase(
        data,
        String(caseId)
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async makeCallbackRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { caseId } = req.params;
      const { note } = req.body;
      const response = await this.casesService2.makeCallbackRequest(
        caseId,
        note
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async getContingentCase(req: Request, res: Response, next: NextFunction) {
    try {
      const { caseId } = req.params;
      const response = await this.casesService2.findContingentCase(caseId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
