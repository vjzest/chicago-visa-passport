import express, { NextFunction, Request, Response } from "express";
import AdminPromoController from "../../controllers/admin/admin.promo.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminPromoRouter = express.Router();
const adminPromoController = new AdminPromoController();

adminPromoRouter.use(adminAuthMiddleware);

adminPromoRouter.post(
  "/create",

  (req: Request, res: Response, next: NextFunction) =>
    adminPromoController.createCoupon(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminPromoRouter.patch(
  "/update/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminPromoController.updateCoupon(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminPromoRouter.patch(
  "/delete/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminPromoController.deleteCoupon(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminPromoRouter.patch(
  "/active/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminPromoController.activeCoupon(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminPromoRouter.get(
  "/",

  (req: Request, res: Response, next: NextFunction) =>
    adminPromoController.getAllCoupons(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default adminPromoRouter;
