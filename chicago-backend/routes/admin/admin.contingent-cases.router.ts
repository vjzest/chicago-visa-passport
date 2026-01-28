import express, { NextFunction, Request, Response } from "express";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";
import AdminContingentController from "../../controllers/admin/admin.contingentcases.controller";

const adminContingentRouter = express.Router();
const adminContingentController = new AdminContingentController();
adminContingentRouter.use(adminAuthMiddleware);

adminContingentRouter.post(
  "/:caseId/send-email",
  adminAuthMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    adminContingentController.sendReminderEmail(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default adminContingentRouter;
