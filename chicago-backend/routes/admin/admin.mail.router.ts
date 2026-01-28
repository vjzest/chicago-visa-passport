import express, { NextFunction, Request, Response } from "express";
import AdminMailController from "../../controllers/admin/admin.mail.controller";

const adminMailRouter = express.Router();
const adminMailController = new AdminMailController();

adminMailRouter.post(
  "/resend",
  (req: Request, res: Response, next: NextFunction) =>
    adminMailController.resendCredentials(req, res, next)
);

export default adminMailRouter;
