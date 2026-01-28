import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AdminFilesController } from "../../controllers/admin/admin.files.controller";
import { adminAuthMiddleware } from "../../middlewares/auth.middleware";

const adminFilesRouter = express.Router();
const adminFilesController = new AdminFilesController();
const upload = multer();

// adminFilesRouter.use(adminAuthMiddleware);

adminFilesRouter.get("/", adminAuthMiddleware, (req: Request, res: Response, next: NextFunction) =>
  adminFilesController.getAllFiles(req, res, next)
);

adminFilesRouter.delete(
  "/:fileId",
  adminAuthMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    adminFilesController.deleteFile(req, res, next)
);

adminFilesRouter.post(
  "/",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) =>
    adminFilesController.uploadFile(req, res, next)
);

adminFilesRouter.get(
  "/case/:caseId",
  (req: Request, res: Response, next: NextFunction) =>
    adminFilesController.getAllCaseFiles(req, res, next)
);

adminFilesRouter.post(
  "/case/:caseId",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) =>
    adminFilesController.uploadCaseFile(req, res, next)
);

adminFilesRouter.delete(
  "/case/:fileId",
  (req: Request, res: Response, next: NextFunction) =>
    adminFilesController.deleteCaseFile(req, res, next)
);

adminFilesRouter.patch(
  "/case/:fileId",
  (req: Request, res: Response, next: NextFunction) =>
    adminFilesController.editCaseFile(req, res, next)
);

export default adminFilesRouter;
