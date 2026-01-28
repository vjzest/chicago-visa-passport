import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import ContactService from "../../services/common/contact.service";

export default class AdminQueriesController {
  private readonly contactService = new ContactService();

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.contactService.findAll();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async updateConsultationStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      if (!id.trim()) {
        return res
          .status(400)
          .json({ message: "required field is missing", success: false });
      }
      const response = await this.contactService.findByIdAndUpdate(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
