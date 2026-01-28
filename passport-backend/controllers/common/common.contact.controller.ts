import ContactService from "../../services/common/contact.service";
import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";

export default class CommonContactController {
  contactService = new ContactService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const formData = req.body;
      const response = await this.contactService.create(formData);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
