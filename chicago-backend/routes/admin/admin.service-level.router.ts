import express, { NextFunction, Request, Response } from "express";
import AdminServiceController from "../../controllers/admin/admin.service-level.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminServiceRouter = express.Router();
const adminServiceController = new AdminServiceController();

adminServiceRouter.use(adminAuthMiddleware);

adminServiceRouter.post(
  "/create",

  (req: Request, res: Response, next: NextFunction) =>
    adminServiceController.createServiceLevel(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminServiceRouter.patch(
  "/update/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminServiceController.updateServiceLevels(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminServiceRouter.patch(
  "/active/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminServiceController.activateServiceLevel(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminServiceRouter.get(
  "/",

  (req: Request, res: Response, next: NextFunction) =>
    adminServiceController.getAllServiceLevels(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminServiceRouter.patch(
  "/:id/toggle-archive",

  (req: Request, res: Response, next: NextFunction) =>
    adminServiceController.toggleArchiveState(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default adminServiceRouter;
