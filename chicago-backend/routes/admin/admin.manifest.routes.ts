import express, { NextFunction, Request, Response } from "express";
import AdminManifestController from "../../controllers/admin/admin.manifest.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminManifestRoutes = express.Router();
const adminManifestController = new AdminManifestController();

adminManifestRoutes.use(adminAuthMiddleware);

adminManifestRoutes.get(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    adminManifestController.getManifestRecords(req, res, next),
);

adminManifestRoutes.get(
  "/cases",
  (req: Request, res: Response, next: NextFunction) =>
    adminManifestController.searchCases(req, res, next),
);

adminManifestRoutes.get(
  "/cases/:caseId",
  (req: Request, res: Response, next: NextFunction) =>
    adminManifestController.getCaseById(req, res, next),
);

adminManifestRoutes.patch(
  "/remarks/:id",
  (req: Request, res: Response, next: NextFunction) =>
    adminManifestController.updateRemarks(
      req as AuthenticatedAdminRequest,
      res,
      next,
    ),
);

export default adminManifestRoutes;
