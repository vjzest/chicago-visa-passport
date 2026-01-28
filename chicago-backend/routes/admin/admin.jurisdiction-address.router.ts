import express, { NextFunction, Request, Response } from "express";
import AdminJurisdictionAddressController from "../../controllers/admin/admin.jurisdiction-address.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminJurisdictionAddressRouter = express.Router();
const adminJurisdictionAddressController =
  new AdminJurisdictionAddressController();

adminJurisdictionAddressRouter.use(adminAuthMiddleware);

// Create new jurisdiction address
adminJurisdictionAddressRouter.post(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionAddressController.create(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

// Get address by ID
adminJurisdictionAddressRouter.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionAddressController.getById(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

// Get all addresses for a country pair
adminJurisdictionAddressRouter.get(
  "/country-pair/:countryPairId",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionAddressController.getByCountryPair(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

// Update jurisdiction address
adminJurisdictionAddressRouter.patch(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionAddressController.update(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

// Soft delete/restore jurisdiction address
adminJurisdictionAddressRouter.patch(
  "/:id/delete",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionAddressController.delete(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

// Toggle active status
adminJurisdictionAddressRouter.patch(
  "/:id/toggle-active",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionAddressController.toggleActive(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default adminJurisdictionAddressRouter;
