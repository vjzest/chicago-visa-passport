import { Response, Request, NextFunction } from "express";
import FormsService from "../../services/admin/forms.service";

export default class CommonFormsController {
  private readonly formsService = new FormsService();

  async findFormsOfASection(req: Request, res: Response, next: NextFunction) {
    try {
      const { sectionId } = req.params;
      const response = await this.formsService.findFormsOfASection(sectionId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
