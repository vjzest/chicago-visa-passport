import express, { NextFunction, Request, Response } from "express";
import AdminAdditionalController from "../../controllers/admin/admin.additional.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminAdditionalRouter = express.Router();
const adminAdditionalController = new AdminAdditionalController();

adminAdditionalRouter.use(adminAuthMiddleware);

adminAdditionalRouter.post(
  "/",

  (req: Request, res: Response, next: NextFunction) =>
    adminAdditionalController.create(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminAdditionalRouter.put(
  "/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminAdditionalController.update(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminAdditionalRouter.patch(
  "/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminAdditionalController.activate(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminAdditionalRouter.delete(
  "/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminAdditionalController.delete(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminAdditionalRouter.get(
  "/",

  (req: Request, res: Response, next: NextFunction) =>
    adminAdditionalController.getAll(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default adminAdditionalRouter;
