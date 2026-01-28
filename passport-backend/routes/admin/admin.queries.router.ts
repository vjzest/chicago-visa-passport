import express, { NextFunction, Request, Response } from "express";
import { adminAuthMiddleware } from "../../middlewares/auth.middleware";
import AdminQueriesController from "../../controllers/admin/admin.queries.controller";

const adminQueriesRouter = express.Router();

adminQueriesRouter.use(adminAuthMiddleware);
const adminQueriesController = new AdminQueriesController();

adminQueriesRouter.get("/", (req: Request, res: Response, next: NextFunction) =>
  adminQueriesController.findAll(req, res, next)
);

adminQueriesRouter.patch(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>
    adminQueriesController.updateConsultationStatus(req, res, next)
);

export default adminQueriesRouter;
