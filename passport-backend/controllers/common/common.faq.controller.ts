import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import FaqService from "../../services/admin/faq.service";

export default class CommonFaqController {
  private readonly faqService = new FaqService();

  async findActive(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.faqService.findActive();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
