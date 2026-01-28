import express, { NextFunction, Request, Response } from "express";
import AdminAuthController from "../../controllers/admin/admin.auth.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminAuthRouter = express.Router();
const adminAuthController = new AdminAuthController();

adminAuthRouter.post(
  "/login",
  (req: Request, res: Response, next: NextFunction) =>
    adminAuthController.login(req as AuthenticatedAdminRequest, res, next)
);
adminAuthRouter.get(
  "/my-profile",
  (req: Request, res: Response, next: NextFunction) =>
    adminAuthMiddleware(req as AuthenticatedAdminRequest, res, next),

  (req: Request, res: Response, next: NextFunction) =>
    adminAuthController.getProfile(req as AuthenticatedAdminRequest, res, next)
);

export default adminAuthRouter;
