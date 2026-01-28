import { Response, Request, NextFunction } from "express";
import MailService from "../../services/common/mail.service";
import AccountsService from "../../services/user/accounts.service";
import ENV from "../../utils/lib/env.config";

export default class AdminMailController {
  mailService = new MailService();
  accountService = new AccountsService();

  async resendCredentials(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId, caseId } = req.body;
      const password = true;
      const getUserData = await this.accountService.findOne(
        accountId,
        password
      );
      const { email1, firstName, lastName, userKey } = getUserData.data;

      // DATA TO PASS THE EMAIL FUNCTION
      const smsData = {
        from: ENV.FROM_EMAIL!,
        fullName: firstName + " " + lastName,
        caseId,
        to: email1,
        password: userKey,
      };

      // EMAIL SENDING FUNCTION
      const response = await this.mailService.sendMail(smsData);
      res.status(response?.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
