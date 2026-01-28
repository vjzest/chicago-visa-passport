import { Response, Request, NextFunction } from "express";
import PassportFormService from "../../services/user/passport-form.service";
import CustomError from "../../utils/classes/custom-error";

export default class UserPassportFormController {
  passportFormService = new PassportFormService();

  async getPercentage(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      const userId = req?.user._id;
      const caseId = req.params.caseId;

      const response = await this.passportFormService.getCompletionPercentage(
        userId,
        caseId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async findOneByCaseId(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      const userId = req?.user._id;
      const caseId = req.params.caseId;

      const response = await this.passportFormService.findOne(userId, caseId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async createPassportForm(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      const userId = req?.user._id;
      const caseId = req.params.caseId;
      console.log(userId);
      const response = await this.passportFormService.create(
        userId,
        req.body,
        caseId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async fillGovForm(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      const userId = req?.user._id;
      const caseId = req.params.caseId;
      const response = await this.passportFormService.fillGovForm(
        // userId,
        caseId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getFormFillStatus(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      const userId = req?.user._id;
      const caseId = req.params.caseId;
      const response = await this.passportFormService.getFormFillStatus(
        userId,
        caseId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async recieveFormSuccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { passportFormId } = req.params;
      const response = await this.passportFormService.receiveFormSuccess(
        passportFormId,
        req.body
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
