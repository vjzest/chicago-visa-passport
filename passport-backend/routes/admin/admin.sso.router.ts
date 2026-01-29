import express, { NextFunction, Request, Response } from "express";
import AdminSSOController from "../../controllers/admin/admin.sso.controller";

const adminSSORouter = express.Router();
const adminSSOController = new AdminSSOController();

adminSSORouter.post(
    "/verify",
    (req: Request, res: Response, next: NextFunction) =>
        adminSSOController.verifyCode(req, res, next)
);

adminSSORouter.get(
    "/roles",
    (req: Request, res: Response, next: NextFunction) =>
        adminSSOController.getRoles(req, res, next)
);

export default adminSSORouter;
