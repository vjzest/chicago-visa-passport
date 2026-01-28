import express, { NextFunction, Request, Response } from "express";
import AdminServiceTypeController from "../../controllers/admin/admin.servicetypes.controller";
import upload from "../../utils/multer";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminServiceTypeRouter = express.Router();
const adminServiceTypeController = new AdminServiceTypeController();

adminServiceTypeRouter.use(adminAuthMiddleware);

adminServiceTypeRouter
  .post(
    "/",
    upload.any(),

    (req: Request, res: Response, next: NextFunction) =>
      adminServiceTypeController.create(
        req as AuthenticatedAdminRequest,
        res,
        next
      )
  )
  .get(
    "/",

    (req: Request, res: Response, next: NextFunction) =>
      adminServiceTypeController.findAll(
        req as AuthenticatedAdminRequest,
        res,
        next
      )
  )
  .get("/sort-orders", (req: Request, res: Response, next: NextFunction) =>
    adminServiceTypeController.getServiceTypeSortOrders(req, res, next)
  )
  .get(
    "/:id",

    (req: Request, res: Response, next: NextFunction) =>
      adminServiceTypeController.findOne(
        req as AuthenticatedAdminRequest,
        res,
        next
      )
  )
  .put(
    "/:id",
    upload.any(),

    (req: Request, res: Response, next: NextFunction) =>
      adminServiceTypeController.update(
        req as AuthenticatedAdminRequest,
        res,
        next
      )
  )
  .delete(
    "/:id",

    (req: Request, res: Response, next: NextFunction) =>
      adminServiceTypeController.delete(
        req as AuthenticatedAdminRequest,
        res,
        next
      )
  )
  .patch(
    "/:id/toggle-archive",

    (req: Request, res: Response, next: NextFunction) =>
      adminServiceTypeController.toggleArchiveState(
        req as AuthenticatedAdminRequest,
        res,
        next
      )
  );

export default adminServiceTypeRouter;
