import { Response, Request, NextFunction } from "express";
import AccountsService from "../../services/user/accounts.service";

export default class UserAccountController {
  accountsService = new AccountsService();

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.accountsService.findOne(
        //@ts-ignore
        req?.user?._id
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const response = await this.accountsService.findOne(
        //@ts-ignore
        req?.user?._id
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        firstName,
        middleName,
        lastName,
        email1,
        phone1,
        email2,
        phone2,
      } = req.body;
      const response = await this.accountsService.update(
        //@ts-ignore
        req?.user?._id,
        {
          firstName,
          middleName,
          lastName,
          email1,
          email2,
          phone1,
          phone2,
        }
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { oldPassword, newPassword } = req.body;
      const response = await this.accountsService.updatePassword(
        //@ts-ignore
        req?.user?._id,
        oldPassword,
        newPassword
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
