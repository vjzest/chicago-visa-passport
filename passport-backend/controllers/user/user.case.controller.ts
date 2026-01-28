import { Response, Request, NextFunction } from "express";
import CaseService from "../../services/user/case.service";
import PassportFormService from "../../services/user/passport-form.service";

export default class UserCaseController {
  caseService = new CaseService();
  passportFormService = new PassportFormService();

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.caseService.findAll(
        //@ts-ignore
        req?.user?._id
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.caseService.findOne(
        //@ts-ignore
        req?.user?._id,
        req.params.id
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async getRequiredDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const { caseId } = req.params;
      const response = await this.caseService.getRequiredDocuments(caseId);
      res.status(response.status).json(response);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getAllMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { caseId } = req.params;
      const response = await this.caseService.getAllMessages(caseId);
      res.status(response.status).json(response);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updatedTrackingId(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      // const admin = req?.user;
      const { applicationId } = req.params;
      const { tracking } = req.body;
      console.log({ tracking });
      let id = "",
        note = "",
        processingLocation = "";
      if (tracking) {
        id = tracking.id;
        note = tracking.note;
        processingLocation = tracking.processingLocation;
      }
      console.log({ processingLocation });
      const response = await this.caseService.updatedTrackingId(
        applicationId,
        { id, note },
        processingLocation
      );
      // await this.logService.createLog(
      //   admin._id,
      //   "cases",
      //   `Documents of applicationId "${applicationId}" send to expert review`,
      //   applicationId
      // );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async submitReviewRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.caseService.submitReviewRequest(
        req.params.caseId,
        req.files as { [key: string]: Express.Multer.File[] }
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async confirmShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.caseService.confirmInboundShipment(
        req.params.caseId,
        req.body.note
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async makeCancellationRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { note } = req.body;
      const response = await this.caseService.makeCancellationRequest(
        req.params.applicationId,
        note
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async undoCancellationRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.caseService.undoCancellationRequest(
        req.params.applicationId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  getPassportApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { caseId } = req.params;
      //@ts-ignore
      console.log({ caseId, userId: req.user._id });
      const response = await this.passportFormService.getPassportForm(
        caseId,
        //@ts-ignore
        req.user._id
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  };

  async recordAction(req: Request, res: Response, next: NextFunction) {
    try {
      const { actionNote, caseId } = req.body;
      const response = await this.caseService.recordAction(caseId, actionNote);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
