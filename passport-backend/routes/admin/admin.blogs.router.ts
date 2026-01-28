import express, { NextFunction, Request, Response } from "express";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";
import AdminBlogsController from "../../controllers/admin/admin.blogs.controller";
import upload from "../../utils/multer";

const adminBlogsRouter = express.Router();
const adminBlogsController = new AdminBlogsController();

adminBlogsRouter.use(adminAuthMiddleware);

adminBlogsRouter
  .post(
    "/",
    upload.single("thumbnail"),
    (req: Request, res: Response, next: NextFunction) =>
      adminBlogsController.create(req as AuthenticatedAdminRequest, res, next)
  )
  .put(
    "/:blogId",
    upload.single("thumbnail"),

    (req: Request, res: Response, next: NextFunction) =>
      adminBlogsController.update(req as AuthenticatedAdminRequest, res, next)
  )
  .get(
    "/",

    (req: Request, res: Response, next: NextFunction) =>
      adminBlogsController.findAll(req as AuthenticatedAdminRequest, res, next)
  )
  .get(
    "/:blogId",

    (req: Request, res: Response, next: NextFunction) =>
      adminBlogsController.findOne(req as AuthenticatedAdminRequest, res, next)
  );

export default adminBlogsRouter;
