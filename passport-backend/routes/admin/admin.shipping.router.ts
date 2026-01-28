import express, { NextFunction, Request, Response } from "express";
import AdminShippingController from "../../controllers/admin/admin.shipping.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminShippingRouter = express.Router();
const adminShippingController = new AdminShippingController();

adminShippingRouter.use(adminAuthMiddleware);

adminShippingRouter.post(
  "/create",

  (req: Request, res: Response, next: NextFunction) =>
    adminShippingController.createShippingAddress(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminShippingRouter.patch(
  "/update/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminShippingController.updateShippingAddress(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminShippingRouter.patch(
  "/delete/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminShippingController.deleteShippingAddress(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminShippingRouter.patch(
  "/active/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminShippingController.activateShippingAddress(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminShippingRouter.get(
  "/",

  (req: Request, res: Response, next: NextFunction) =>
    adminShippingController.getAllShippingAddress(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default adminShippingRouter;
