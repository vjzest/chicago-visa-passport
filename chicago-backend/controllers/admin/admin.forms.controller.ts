import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import FormsService from "../../services/admin/forms.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminFormsController {
  formsService = new FormsService();

  async createForm(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { formsSectionId, formData } = req.body;
      const response = await this.formsService.createForm(
        formsSectionId,
        formData
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async createField(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { formsSectionId, formId, fieldData } = req.body;
      const response = await this.formsService.addField(
        formsSectionId,
        formId,
        fieldData
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async findAllFormSections(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.formsService.findAllFormSections();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findFormsOfASection(req: Request, res: Response, next: NextFunction) {
    try {
      const { sectionId } = req.params;
      const response = await this.formsService.findFormsOfASection(sectionId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async deleteField(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { formsSectionId, formId, fieldId } = req.params;
      const response = await this.formsService.deleteField(
        formsSectionId,
        formId,
        fieldId
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async editField(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { formsSectionId, formId, fieldId } = req.params;
      if (!req.body) {
        return res.status(400).json({ message: "No data to update" });
      }
      const response = await this.formsService.editField(
        formsSectionId,
        formId,
        fieldId,
        req.body
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async deleteForm(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { formsSectionId, formId } = req.params;
      const response = await this.formsService.deleteForm(
        formsSectionId,
        formId
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async reorderFields(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { formId } = req.params;
      const response = await this.formsService.reorderFields(formId, req.body);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
