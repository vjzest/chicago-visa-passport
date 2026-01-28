import express, { NextFunction, Request, Response } from "express";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";
import { AdminFedexPackagesController } from "../../controllers/admin/admin.fedex-packages.controller";

const adminFedexPackagesRouter = express.Router();
const adminFedexPackagesController = new AdminFedexPackagesController();

adminFedexPackagesRouter.use(adminAuthMiddleware);

adminFedexPackagesRouter.get(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    adminFedexPackagesController.getAllPackages(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminFedexPackagesRouter.get(
  "/delayed-packages",
  (req: Request, res: Response, next: NextFunction) =>
    adminFedexPackagesController.getDelayedPackages(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminFedexPackagesRouter.get(
  "/delayed-count",
  (req: Request, res: Response, next: NextFunction) =>
    adminFedexPackagesController.getDelayedPackagesCount(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminFedexPackagesRouter.patch(
  "/toggle-active/:packageId",

  (req: Request, res: Response, next: NextFunction) =>
    adminFedexPackagesController.toggleActiveStatus(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminFedexPackagesRouter.get(
  "/delay-report",
  (req: Request, res: Response, next: NextFunction) =>
    adminFedexPackagesController.generateDelayReport(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default adminFedexPackagesRouter;
