import express, { Request, NextFunction, Response } from "express";
import AdminReportsController from "../../controllers/admin/admin.reports.controller";
import { adminAuthMiddleware } from "../../middlewares/auth.middleware";

const adminReportsRouter = express.Router();

const adminReportsController = new AdminReportsController();

adminReportsRouter.use(adminAuthMiddleware);

adminReportsRouter.get(
  "/applications",
  (req: Request, res: Response, next: NextFunction) => {
    adminReportsController.filterApplications(req, res, next);
  }
);
adminReportsRouter.get(
  "/cases",
  (req: Request, res: Response, next: NextFunction) => {
    adminReportsController.filterCase(req, res, next);
  }
);
adminReportsRouter.get(
  "/cases-applications",
  (req: Request, res: Response, next: NextFunction) => {
    adminReportsController.filterApplicationsAndCases(req, res, next);
  }
);
adminReportsRouter.get(
  "/transactions",
  (req: Request, res: Response, next: NextFunction) => {
    adminReportsController.getTotalTransactions(req, res, next);
  }
);
adminReportsRouter.get(
  "/case-managers",
  (req: Request, res: Response, next: NextFunction) =>
    adminReportsController.getCaseManagerReports(req, res, next)
);

adminReportsRouter.post(
  "/crm-reports",
  (req: Request, res: Response, next: NextFunction) => {
    adminReportsController.filterCRMReports(req, res, next);
  }
);

export default adminReportsRouter;
