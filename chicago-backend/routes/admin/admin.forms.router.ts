import express, { NextFunction, Request, Response } from "express";
import AdminFormsController from "../../controllers/admin/admin.forms.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminFormRouter = express.Router();
const adminFormsController = new AdminFormsController();

adminFormRouter.use(adminAuthMiddleware);

adminFormRouter.put(
  "/form",

  (req: Request, res: Response, next: NextFunction) =>
    adminFormsController.createForm(req as AuthenticatedAdminRequest, res, next)
);
adminFormRouter.get(
  "/sections",

  (req: Request, res: Response, next: NextFunction) =>
    adminFormsController.findAllFormSections(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminFormRouter.get(
  "/:sectionId",

  (req: Request, res: Response, next: NextFunction) =>
    adminFormsController.findFormsOfASection(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminFormRouter.put(
  "/field",

  (req: Request, res: Response, next: NextFunction) =>
    adminFormsController.createField(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminFormRouter.delete(
  "/form/:formsSectionId/:formId",

  (req: Request, res: Response, next: NextFunction) => {
    adminFormsController.deleteForm(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);
adminFormRouter.delete(
  "/field/:formsSectionId/:formId/:fieldId",

  (req: Request, res: Response, next: NextFunction) => {
    adminFormsController.deleteField(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminFormRouter.put(
  "/field/:formsSectionId/:formId/:fieldId",

  (req: Request, res: Response, next: NextFunction) => {
    adminFormsController.editField(req as AuthenticatedAdminRequest, res, next);
  }
);

adminFormRouter.patch(
  "/fields/reorder/:formId",

  (req: Request, res: Response, next: NextFunction) => {
    adminFormsController.reorderFields(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

export default adminFormRouter;
