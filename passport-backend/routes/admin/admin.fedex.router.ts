import express, { NextFunction, Request, Response } from "express";
import AdminFedexController from "../../controllers/admin/admin.config.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminFedexRouter = express.Router();
const adminFedexController = new AdminFedexController();

adminFedexRouter.use(adminAuthMiddleware);

adminFedexRouter.post(
  "/",

  (req: Request, res: Response, next: NextFunction) =>
    adminFedexController.create(req as AuthenticatedAdminRequest, res, next)
);
adminFedexRouter.put(
  "/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminFedexController.update(req as AuthenticatedAdminRequest, res, next)
);
adminFedexRouter.patch(
  "/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminFedexController.activate(req as AuthenticatedAdminRequest, res, next)
);
adminFedexRouter.delete(
  "/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminFedexController.delete(req as AuthenticatedAdminRequest, res, next)
);
adminFedexRouter.get(
  "/",

  (req: Request, res: Response, next: NextFunction) =>
    adminFedexController.getAll(req as AuthenticatedAdminRequest, res, next)
);

export default adminFedexRouter;
