import express, { NextFunction, Request, Response } from "express";
import AdminCountryAccessController from "../../controllers/admin/admin.country-access.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const router = express.Router();
const controller = new AdminCountryAccessController();

// Apply admin authentication middleware to all routes
router.use(adminAuthMiddleware);

// Initialize countries (can be called once to set up initial data)
router.post("/initialize", (req: Request, res: Response, next: NextFunction) =>
  controller.initialize(req as AuthenticatedAdminRequest, res, next)
);

// Get all country access settings
router.get("/", (req: Request, res: Response, next: NextFunction) =>
  controller.findAll(req as AuthenticatedAdminRequest, res, next)
);

// Get enabled countries for "From" selection
router.get(
  "/enabled-from",
  (req: Request, res: Response, next: NextFunction) =>
    controller.getEnabledFromCountries(req as AuthenticatedAdminRequest, res, next)
);

// Get enabled countries for "To" selection
router.get(
  "/enabled-to",
  (req: Request, res: Response, next: NextFunction) =>
    controller.getEnabledToCountries(req as AuthenticatedAdminRequest, res, next)
);

// Update single country access settings
router.put(
  "/:countryCode",
  (req: Request, res: Response, next: NextFunction) =>
    controller.update(req as AuthenticatedAdminRequest, res, next)
);

// Bulk update country access settings
router.post(
  "/bulk-update",
  (req: Request, res: Response, next: NextFunction) =>
    controller.bulkUpdate(req as AuthenticatedAdminRequest, res, next)
);

export default router;
