import express, { NextFunction, Request, Response } from "express";
import AdminFaqController from "../../controllers/admin/admin.faq.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminFaqRouter = express.Router();
const adminFaqController = new AdminFaqController();

adminFaqRouter.use(adminAuthMiddleware);

adminFaqRouter
  .post(
    "/",

    (req: Request, res: Response, next: NextFunction) =>
      adminFaqController.create(req as AuthenticatedAdminRequest, res, next)
  )
  .get(
    "/",

    (req: Request, res: Response, next: NextFunction) =>
      adminFaqController.findAll(req as AuthenticatedAdminRequest, res, next)
  )
  .get(
    "/:id",

    (req: Request, res: Response, next: NextFunction) =>
      adminFaqController.findOne(req as AuthenticatedAdminRequest, res, next)
  )
  .put(
    "/:id",

    (req: Request, res: Response, next: NextFunction) =>
      adminFaqController.update(req as AuthenticatedAdminRequest, res, next)
  )
  .delete(
    "/:id",

    (req: Request, res: Response, next: NextFunction) =>
      adminFaqController.delete(req as AuthenticatedAdminRequest, res, next)
  );

export default adminFaqRouter;
