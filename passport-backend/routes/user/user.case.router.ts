import express, { NextFunction, Request, Response } from "express";
import UserCaseController from "../../controllers/user/user.case.controller";
import { userAuthMiddleware } from "../../middlewares/auth.middleware";
import upload from "../../utils/multer";

const userCaseRouter = express.Router();
const userCaseController = new UserCaseController();

userCaseRouter.use(userAuthMiddleware);

userCaseRouter.get(
  "/",
  userAuthMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return userCaseController.findAll(req, res, next);
  }
);

userCaseRouter.get(
  "/:id",
  userAuthMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return userCaseController.findOne(req, res, next);
  }
);

userCaseRouter.get(
  "/:caseId/required-documents",
  (req: Request, res: Response, next: NextFunction) => {
    return userCaseController.getRequiredDocuments(req, res, next);
  }
);

userCaseRouter.get(
  "/:caseId/messages",
  (req: Request, res: Response, next: NextFunction) => {
    return userCaseController.getAllMessages(req, res, next);
  }
);

userCaseRouter.patch(
  "/add-tracking/:applicationId",
  (req: Request, res: Response, next: NextFunction) =>
    userCaseController.updatedTrackingId(req, res, next)
);
userCaseRouter.put(
  "/make-cancellation-request/:applicationId",
  (req: Request, res: Response, next: NextFunction) =>
    userCaseController.makeCancellationRequest(req, res, next)
);
userCaseRouter.put(
  "/undo-cancellation-request/:applicationId",
  (req: Request, res: Response, next: NextFunction) =>
    userCaseController.undoCancellationRequest(req, res, next)
);

userCaseRouter.get(
  "/passport-application/:caseId",
  (req: Request, res: Response, next: NextFunction) =>
    userCaseController.getPassportApplication(req, res, next)
);

userCaseRouter.post(
  "/record-action",
  (req: Request, res: Response, next: NextFunction) => {
    return userCaseController.recordAction(req, res, next);
  }
);

userCaseRouter.post(
  "/:caseId/submit-review-request",
  upload.any(),
  (req: Request, res: Response, next: NextFunction) =>
    userCaseController.submitReviewRequest(req, res, next)
);

userCaseRouter.put(
  "/shipment/confirm-user-shipment/:caseId",
  (req: Request, res: Response, next: NextFunction) =>
    userCaseController.confirmShipment(req, res, next)
);

export default userCaseRouter;
