import express, { NextFunction, Request, Response } from "express";
import UserPassportFormController from "../../controllers/user/user.passport.form.controller";
import { userAuthMiddleware } from "../../middlewares/auth.middleware";

const userPassportFormRouter = express.Router();
const userPassportFormController = new UserPassportFormController();

userPassportFormRouter.post(
  "/:passportFormId/form-fill-success",
  (req: Request, res: Response, next: NextFunction) => {
    return userPassportFormController.recieveFormSuccess(req, res, next);
  }
);
userPassportFormRouter.use(userAuthMiddleware);

userPassportFormRouter.post(
  "/:caseId",
  userAuthMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return userPassportFormController.createPassportForm(req, res, next);
  }
);
userPassportFormRouter.get(
  "/:caseId",
  userAuthMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return userPassportFormController.findOneByCaseId(req, res, next);
  }
);

userPassportFormRouter.get(
  "/percentage/:caseId",
  (req: Request, res: Response, next: NextFunction) => {
    return userPassportFormController.getPercentage(req, res, next);
  }
);
userPassportFormRouter.get(
  "/:caseId/form-fill-status",
  (req: Request, res: Response, next: NextFunction) => {
    return userPassportFormController.getFormFillStatus(req, res, next);
  }
);

userPassportFormRouter.post(
  "/:caseId/fill-gov-form",
  (req: Request, res: Response, next: NextFunction) => {
    return userPassportFormController.fillGovForm(req, res, next);
  }
);

export default userPassportFormRouter;
