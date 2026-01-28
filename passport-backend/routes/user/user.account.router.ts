import express, { NextFunction, Request, Response } from "express";
import UserAccountController from "../../controllers/user/user.account.controller";
import { userAuthMiddleware } from "../../middlewares/auth.middleware";

const userAccountRouter = express.Router();
const userAccountController = new UserAccountController();

userAccountRouter.use(userAuthMiddleware);

userAccountRouter.put("/", (req: Request, res: Response, next: NextFunction) =>
  userAccountController.update(req, res, next)
);

userAccountRouter.get("/", (req: Request, res: Response, next: NextFunction) =>
  userAccountController.get(req, res, next)
);
userAccountRouter.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  userAccountController.getOne(req, res, next)
);

userAccountRouter.put(
  "/password",
  (req: Request, res: Response, next: NextFunction) =>
    userAccountController.updatePassword(req, res, next)
);

export default userAccountRouter;
