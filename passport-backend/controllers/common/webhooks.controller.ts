import { Response, Request, NextFunction } from "express";
import CasesUpdationService from "../../services/admin/cases-updation.service";
export class WebhookController {
  private readonly casesUpdationService = new CasesUpdationService();

  async receiveSms(req: Request, res: Response, next: NextFunction) {
    try {
      const { Body: receivedMsg } = req.body;
      let { From: fromNumber } = req.body;
      console.log("twilio message", req.body);
      await this.casesUpdationService.receiveMessage({
        receivedMsg,
        fromNumber,
      });
      // const twiml = new twilio.twiml.MessagingResponse();
      res.set("Content-Type", "text/xml");
      res.status(200).send("<Response></Response>");
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
