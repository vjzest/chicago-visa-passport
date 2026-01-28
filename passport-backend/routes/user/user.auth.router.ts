import express, { NextFunction, Request, Response } from "express";
import UserAuthController from "../../controllers/user/user.auth.controller";
import { userAuthMiddleware } from "../../middlewares/auth.middleware";

const userAuthRouter = express.Router();
const userAuthController = new UserAuthController();

userAuthRouter.post(
  "/login",
  (req: Request, res: Response, next: NextFunction) => {
    return userAuthController.login(req, res, next);
  }
);

userAuthRouter.post(
  "/signup",
  (req: Request, res: Response, next: NextFunction) => {
    return userAuthController.signup(req, res, next);
  }
);
userAuthRouter.post(
  "/final-register",
  userAuthMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return userAuthController.finalRegister(req, res, next);
  }
);

// for verifying when creating case (includes mail and name)
userAuthRouter.post(
  "/verification",
  (req: Request, res: Response, next: NextFunction) => {
    return userAuthController.sendVerification(req, res, next);
  }
);

userAuthRouter.post(
  "/resend-verification",
  (req: Request, res: Response, next: NextFunction) => {
    return userAuthController.resendVerification(req, res, next);
  }
);

// for forgot-password (include only email)
userAuthRouter.post(
  "/send-otp",
  (req: Request, res: Response, next: NextFunction) => {
    return userAuthController.sendForgotOtp(req, res, next);
  }
);
userAuthRouter.post(
  "/verify-user",
  (req: Request, res: Response, next: NextFunction) => {
    return userAuthController.verifyUser(req, res, next);
  }
);
userAuthRouter.post(
  "/new-password",
  (req: Request, res: Response, next: NextFunction) => {
    return userAuthController.newPassword(req, res, next);
  }
);
userAuthRouter.post(
  "/forgot/verify-otp",
  (req: Request, res: Response, next: NextFunction) => {
    return userAuthController.forgotVerifyOtp(req, res, next);
  }
);

userAuthRouter.post(
  "/resend-otp",
  (req: Request, res: Response, next: NextFunction) => {
    return userAuthController.resendOtp(req, res, next);
  }
);
// check if token is valid
userAuthRouter.get(
  "/check-token",
  userAuthMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    return userAuthController.checkToken(req, res, next);
  }
);

export default userAuthRouter;
