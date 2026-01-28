import AuthService from "../../services/user/auth.service";
import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import AccountsService from "../../services/user/accounts.service";
import MailService from "../../services/common/mail.service";

export default class UserAuthController {
  authService = new AuthService();
  accountService = new AccountsService();
  mailService = new MailService();

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const response = await this.authService.login(email, password);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, caseId } = req.body;
      const response = await this.authService.signup(
        email,
        password,
        name,
        caseId
      );

      if (response.success) {
        res.status(201).json({
          success: true,
          data: response.data,
          message: response.message,
        });
      }
    } catch (error) {
      if ((error as Error).message === "User with this email already exists") {
        res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
      } else {
        next(new CustomError(500, (error as Error).message));
      }
    }
  }
  async finalRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      //@ts-ignore
      const userId = req?.user?._id;
      //@ts-ignore
      const response = await this.authService.finalRegister(
        email,
        password,
        name,
        userId
      );

      if (response.success) {
        res.status(201).json({
          success: true,
          data: response.data,
          message: response.message,
        });
      }
    } catch (error) {
      if ((error as Error).message === "User with this email already exists") {
        res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
      } else {
        next(new CustomError(500, (error as Error).message));
      }
    }
  }

  async sendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, caseId } = req.body;
      const response = await this.authService.sendVerification(email, caseId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async sendForgotOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await this.accountService.findOneByEmail(email);
      let userName;
      if (user.success) {
        userName = user.data.firstName + " " + user.data.lastName;
        const response = await this.authService.sendForgotOtp(email, userName);
        res.status(response.status).json(response);
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      if (!token) {
        res.status(400).json({
          success: false,
          message: "required fields are missing",
        });
      }
      const response = await this.authService.verifyUser(token);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async newPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { confirmPassword, newPassword, email } = req.body;
      if (!newPassword.trim() || !confirmPassword.trim() || !email.trim()) {
        res.status(400).json({
          success: false,
          message: "required fields are missing",
        });
      }

      if (newPassword !== confirmPassword) {
        res.status(400).json({
          success: false,
          message: "passwords do not match",
        });
      }

      const response = await this.authService.newPassword(newPassword, email);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async forgotVerifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const response = await this.authService.forgotVerifyOtp(email, otp);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, fullName } = req.body;
      const response = await this.authService.resendOtp(email, fullName);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, caseId } = req.body;
      const response = await this.authService.resendVerification(email, caseId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      //@ts-ignore
      const userId = req?.user?._id;
      if (userId) {
        return res.status(200).json({
          success: true,
          message: "User is loggedIn",
          //@ts-ignore
          user: req?.user,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "User is not logged in",
        });
      }
    } catch (error) {
      next(new CustomError(401, (error as Error).message));
    }
  }
}
