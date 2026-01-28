import express, { NextFunction, Request, Response } from "express";
import UserServiceLevelController from "../../controllers/user/user.servicelevel.controller";

const userServiceLevelRouter = express.Router();
const userServicelevelController = new UserServiceLevelController();
userServiceLevelRouter.get(
  "/",
  (req: Request, res: Response, next: NextFunction) =>
    userServicelevelController.findAll(req, res, next)
);

export default userServiceLevelRouter;
