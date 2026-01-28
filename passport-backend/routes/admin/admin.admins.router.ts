import express, { NextFunction, Request, Response } from "express";
import AdminRolesController from "../../controllers/admin/admin.roles.controller";
import upload from "../../utils/multer";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";
import { validateImageOrPdf } from "../../middlewares/file-validation.middleware";

const adminAdminsRouter = express.Router();
const adminRolesController = new AdminRolesController();
adminAdminsRouter.use(adminAuthMiddleware);

adminAdminsRouter.post(
  "/",
  upload.single("image"),
  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.createAdmin(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminAdminsRouter.get("/", (req: Request, res: Response, next: NextFunction) =>
  adminRolesController.findAllAdmins(
    req as AuthenticatedAdminRequest,
    res,
    next
  )
);

adminAdminsRouter.get(
  "/admin-id/:id",
  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.findByIdAdmin(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminAdminsRouter.put(
  "/:adminId",
  upload.single("image"),

  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.updateAdmin(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminAdminsRouter.get(
  "/case-managers",
  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.findCaseManagers(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

// Admin files routes
adminAdminsRouter.post(
  "/files/:adminId",
  upload.single("file"),
  validateImageOrPdf,
  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.uploadAdminFile(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminAdminsRouter.put(
  "/files/:fileId",
  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.updateAdminFile(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminAdminsRouter.delete(
  "/files/:fileId",
  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.deleteAdminFile(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminAdminsRouter.get(
  "/files/:adminId",
  (req: Request, res: Response, next: NextFunction) =>
    adminRolesController.getAdminFiles(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default adminAdminsRouter;
