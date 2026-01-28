import express, { NextFunction, Request, Response } from "express";
import { WebhookController } from "../../controllers/common/webhooks.controller";

export const webhookRouter = express.Router();
const webhookController = new WebhookController();

webhookRouter.post(
  "/receive-twilio-sms",
  (req: Request, res: Response, next: NextFunction) =>
    webhookController.receiveSms(req, res, next)
);
