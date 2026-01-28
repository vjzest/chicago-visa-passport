import express, { NextFunction, Request, Response } from "express";
import UserAddressesController from "../../controllers/user/user.addresses.controller";
import { userAuthMiddleware } from "../../middlewares/auth.middleware";

const userAddressesRouter = express.Router();
const userAddressController = new UserAddressesController();
userAddressesRouter.use(userAuthMiddleware);

userAddressesRouter.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    return userAddressController.create(req, res, next);
  }
);

userAddressesRouter.put(
  "/:addressId",
  (req: Request, res: Response, next: NextFunction) => {
    return userAddressController.update(req, res, next);
  }
);

userAddressesRouter.delete(
  "/:addressId",
  (req: Request, res: Response, next: NextFunction) => {
    return userAddressController.delete(req, res, next);
  }
);

export default userAddressesRouter;
