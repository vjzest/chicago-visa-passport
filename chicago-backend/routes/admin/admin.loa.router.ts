// import express, { NextFunction, Request, Response } from "express";
// import AdminLoaController from "../../controllers/admin/admin.loa.controller";

// const adminLoaRouter = express.Router();
// const adminLoaController = new AdminLoaController();

import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AdminLoaController } from "../../controllers/admin/admin.loa.controller";
import { adminAuthMiddleware } from "../../middlewares/auth.middleware";

const adminLoaRouter = express.Router();
const adminLoaController = new AdminLoaController();
const upload = multer();

adminLoaRouter.use(adminAuthMiddleware);

adminLoaRouter.post(
  "/",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) =>
    adminLoaController.uploadFile(req, res, next)
);

adminLoaRouter.put(
  "/:loaId",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) =>
    adminLoaController.editFile(req, res, next)
);

adminLoaRouter.get("/", (req: Request, res: Response, next: NextFunction) =>
  adminLoaController.getFiles(req, res, next)
);

adminLoaRouter.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) =>
    adminLoaController.deleteFile(req, res, next)
);

export default adminLoaRouter;
