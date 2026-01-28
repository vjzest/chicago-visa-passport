import express, {NextFunction, Request, Response} from "express";
import AdminLogsController from "../../controllers/admin/admin.logs.controller";
import {adminAuthMiddleware} from "../../middlewares/auth.middleware";

const adminLogsRouter = express.Router();
const adminLogsController = new AdminLogsController();

adminLogsRouter.get(
  "/",
  adminAuthMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    adminLogsController.findAll(req, res, next)
);

export default adminLogsRouter;
