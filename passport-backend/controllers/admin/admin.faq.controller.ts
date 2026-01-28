import { Response, NextFunction } from "express";
import FaqService from "../../services/admin/faq.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminFaqController {
  faqService = new FaqService();

  async create(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.faqService.create(req.body);

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findAll(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.faqService.findAll();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findOne(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const response = await this.faqService.findOne(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async update(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const response = await this.faqService.update(id, req.body);

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async delete(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const response = await this.faqService.delete(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
