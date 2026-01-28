import express, { NextFunction, Request, Response } from "express";
import AdminRolesController from "../../controllers/admin/admin.roles.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminRolesRouter = express.Router();
const adminRolesController = new AdminRolesController();

adminRolesRouter.use(adminAuthMiddleware);

adminRolesRouter.get(
  "/",

  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.findAll(req as AuthenticatedAdminRequest, res, next)
);

adminRolesRouter.get(
  "/my-role",

  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.findMyRole(req as AuthenticatedAdminRequest, res, next)
);

adminRolesRouter.get(
  "/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.findById(req as AuthenticatedAdminRequest, res, next)
);

adminRolesRouter.post(
  "/",

  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.create(req as AuthenticatedAdminRequest, res, next)
);

adminRolesRouter.put(
  "/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.update(req as AuthenticatedAdminRequest, res, next)
);

adminRolesRouter.patch(
  "/activate/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.activate(req as AuthenticatedAdminRequest, res, next)
);

adminRolesRouter.patch(
  "/deactivate/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.deactivate(req as AuthenticatedAdminRequest, res, next)
);

adminRolesRouter.get(
  "/access/service-access",

  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.getAdminAccessDetails(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default adminRolesRouter;
