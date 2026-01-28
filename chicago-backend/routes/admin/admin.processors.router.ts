import express, { NextFunction, Request, Response } from "express";
import AdminProcessorController from "../../controllers/admin/admin.processor.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminProcessorRouter = express.Router();
const adminProcessorController = new AdminProcessorController();

adminProcessorRouter.use(adminAuthMiddleware);

adminProcessorRouter.post(
  "/",

  (req: Request, res: Response, next: NextFunction) =>
    adminProcessorController.createProcessor(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminProcessorRouter.put(
  "/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminProcessorController.updateProcessor(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminProcessorRouter.patch(
  "/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminProcessorController.activateProcessor(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminProcessorRouter.patch(
  "/default/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminProcessorController.DefaultProcessor(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminProcessorRouter.delete(
  "/:id",

  (req: Request, res: Response, next: NextFunction) =>
    adminProcessorController.deleteProcessor(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminProcessorRouter.get(
  "/",

  (req: Request, res: Response, next: NextFunction) =>
    adminProcessorController.getAllProcessor(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminProcessorRouter.get(
  "/active-processor/:caseId",
  (req: Request, res: Response, next: NextFunction) =>
    adminProcessorController.GetActiveProcessor(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default adminProcessorRouter;
