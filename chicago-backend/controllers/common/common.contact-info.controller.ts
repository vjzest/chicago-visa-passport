import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import { ContactInfoService } from "../../services/admin/contact-info.service";

export default class CommonContactInfoController {
  private contactInfoService = new ContactInfoService();

  async getContactInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.contactInfoService.getContactDetails();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
