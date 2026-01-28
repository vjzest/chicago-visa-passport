import express, { NextFunction, Request, Response } from "express";
import AdminStatusController from "../../controllers/admin/admin.status.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminStatusRouter = express.Router();
const adminStatusController = new AdminStatusController();

adminStatusRouter.use(adminAuthMiddleware);

adminStatusRouter
  .post(
    "/",

    (req: Request, res: Response, next: NextFunction) =>
      adminStatusController.create(req as AuthenticatedAdminRequest, res, next)
  )
  .get(
    "/",

    (req: Request, res: Response, next: NextFunction) =>
      adminStatusController.findAll(req as AuthenticatedAdminRequest, res, next)
  )
  .get(
    "/parent-statuses",

    (req: Request, res: Response, next: NextFunction) =>
      adminStatusController.findAllParentStatuses(
        req as AuthenticatedAdminRequest,
        res,
        next
      )
  )
  .get(
    "/:id",

    (req: Request, res: Response, next: NextFunction) =>
      adminStatusController.findOne(req as AuthenticatedAdminRequest, res, next)
  )
  .get(
    "/:id/substatuses",

    (req: Request, res: Response, next: NextFunction) =>
      adminStatusController.findSubstatuses(
        req as AuthenticatedAdminRequest,
        res,
        next
      )
  )
  .put(
    "/:id",
    adminAuthMiddleware,

    (req: Request, res: Response, next: NextFunction) =>
      adminStatusController.update(req as AuthenticatedAdminRequest, res, next)
  )
  .delete(
    "/:id",
    adminAuthMiddleware,

    (req: Request, res: Response, next: NextFunction) =>
      adminStatusController.delete(req as AuthenticatedAdminRequest, res, next)
  );

export default adminStatusRouter;
