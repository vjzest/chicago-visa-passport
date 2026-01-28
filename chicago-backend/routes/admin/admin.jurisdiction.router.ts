import express, { NextFunction, Request, Response } from "express";
import AdminJurisdictionController from "../../controllers/admin/admin.jurisdiction.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminJurisdictionRouter = express.Router();
const adminJurisdictionController = new AdminJurisdictionController();

adminJurisdictionRouter.use(adminAuthMiddleware);

// Get jurisdictions by country pair ID
adminJurisdictionRouter.get(
  "/country-pair/:countryPairId",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionController.getByCountryPair(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

// Get jurisdiction by ID
adminJurisdictionRouter.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionController.getById(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

// Create new jurisdiction
adminJurisdictionRouter.post(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionController.create(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

// Bulk create jurisdictions
adminJurisdictionRouter.post(
  "/bulk",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionController.bulkCreate(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

// Update jurisdiction
adminJurisdictionRouter.patch(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionController.update(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

// Soft delete/restore jurisdiction
adminJurisdictionRouter.patch(
  "/:id/delete",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionController.delete(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

// Toggle active status
adminJurisdictionRouter.patch(
  "/:id/toggle-active",
  (req: Request, res: Response, next: NextFunction) =>
    adminJurisdictionController.toggleActive(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default adminJurisdictionRouter;
