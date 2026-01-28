import express, { NextFunction, Request, Response } from "express";
import UserServiceTypeController from "../../controllers/user/user.servicetypes.controller";

const userServiceTypeRouter = express.Router();
const userServiceTypeController = new UserServiceTypeController();

userServiceTypeRouter.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    userServiceTypeController.findAll(req, res, next);
  }
);
export default userServiceTypeRouter;
