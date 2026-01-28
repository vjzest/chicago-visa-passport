import { AccountsModel } from "../../models/accounts.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CasesModel } from "../../models/cases.model";
import { ServiceResponse } from "../../types/service-response.type";
import { OtpsModel } from "../../models/otps.model";
import MailService from "../common/mail.service";
import ENV from "../../utils/lib/env.config";
import { randomUUID } from "crypto";

export default class UserAuthRouterService {
  private readonly model = AccountsModel;
  private mailService = new MailService();
  private readonly caseModel = CasesModel;
  private readonly JWTSECRET = process.env.JWT_SECRET!;

  async login(email: string, password: string): Promise<ServiceResponse> {
    try {
      // Fetching user from the database
      const user = await this.model
        .findOne({ email1: email, isActive: true })
        .exec();
      if (!user) {
        return {
          status: 404,
          message: "User not found",
          success: false,
        };
      }

      let isPasswordValid = false;

      // Checking if the login is via userKey
      if (user.userKey === password) {
        isPasswordValid = true;
      } else {
        // Validating the password
        isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return {
            status: 400,
            message: "Invalid password",
            success: false,
          };
        }
      }
      const latestTokenVersion = randomUUID();
      user.authTokenVersion = latestTokenVersion;
      user.save();
      // Generating JWT
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email1,
          role: "user",
          tokenVersion: latestTokenVersion,
        },
        this.JWTSECRET,
        { expiresIn: "72h" }
      );

      return {
        data: {
          token,
          user: {
            id: user._id.toString(),
            email: user.email1,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            phone: user.phone1,
          },
        },
        status: 200,
        message: "Login successful",
        success: true,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        status: 500,
        message: "Internal server error",
        success: false,
      };
    }
  }

  async signup(
    email: string,
    password: string,
    name: {
      firstName: string;
      middleName: string;
      lastName: string;
    },
    caseId?: string,
    phone?: string
  ) {
    try {
      // Check if user already exists
      const existingUser = await this.model.findOne({ email1: email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = await this.model.create({
        email,
        password: hashedPassword,
        firstName: name.firstName,
        middleName: name.middleName,
        lastName: name.lastName,
        phone,
      });

      await this.caseModel.findByIdAndUpdate(caseId, {
        $set: { account: newUser._id },
      });

      // Generate JWT
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email1, role: "user" },
        this.JWTSECRET,
        { expiresIn: "72h" }
      );

      return {
        data: {
          token,
          user: {
            id: newUser._id,
            email: newUser.email1,
            firstName: newUser.firstName,
            middleName: newUser.middleName,
            lastName: newUser.lastName,
          },
        },
        message: "Signup successful",
        success: true,
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async finalRegister(
    email: string,
    password: string,
    name: string,
    userId: string
  ) {
    try {
      const existingUser = await this.model.findById(userId);
      if (!existingUser) {
        throw new Error("User does not exists");
      }

      const userByEmail = await this.model.findOne({ email1: email });
      if (userByEmail?._id?.toString() === userId) {
        throw new Error("Email already exists.");
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = await this.model.findByIdAndUpdate(
        userId,
        {
          email,
          password: hashedPassword,
          fullName: name,
        },
        { new: true }
      );
      if (newUser) {
        const token = jwt.sign(
          { id: newUser._id, email: newUser.email1, role: "user" },
          this.JWTSECRET,
          { expiresIn: "72h" }
        );
        return {
          data: {
            token,
            user: {
              id: newUser._id,
              email: newUser.email1,
              firstName: newUser.firstName,
              middleName: newUser.middleName,
              lastName: newUser.lastName,
            },
          },
          message: "Signup successful",
          success: true,
        };
      } else {
        throw new Error("User does not exists");
      }
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async sendVerification(email: string, caseId: string): ServiceResponse {
    try {
      // Find the case by caseId
      const case_ = await this.caseModel
        .findOne({ _id: caseId })
        .populate("account");
      if (!case_) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }
      //@ts-ignore
      const { firstName, middleName, lastName } = case_?.account ?? {};
      const fullName = [firstName, middleName, lastName]
        .filter(Boolean)
        .join(" ");

      const token = jwt.sign(
        {
          email,
          caseId,
        },

        ENV.JWT_SECRET!,
        {
          expiresIn: "1h",
        }
      );
      const verificationLink = `${ENV.USER_URL}/verify?token=${token}`;

      const emailData = {
        to: email,
        fullName,
        subject: "Verify Your Account - Chicago Passport & Visa Expedite Services",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #0056b3;">Welcome to Chicago Passport & Visa Expedite Services!</h2>
            <p>Dear ${fullName},</p>
            <p>Thank you for registering with Chicago Passport & Visa Expedite Services. To complete your account setup, please click the link below to verify your email:</p>
           <div style="text-align: center; margin: 20px 0;">
  <a href="${verificationLink}" 
     style="font-size: 18px; font-weight: bold; color: white; text-decoration: none; 
            background-color: #0056b3; padding: 10px 20px; border: 2px solid #004494; 
            border-radius: 5px; display: inline-block;">
    Verify My Account
  </a>
</div>

            <p>This verification link is valid for the next 1 hour.</p>
            <p>If you did not request this registration, please ignore this email.</p>
            <br />
          </div>
        `,
      };

      // Send the email using your mail service
      await this.mailService.sendEmailText(emailData, "");

      return {
        status: 200,
        success: true,
        message: "Verification email sent successfully",
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }
  async sendForgotOtp(email: string, fullName: string): ServiceResponse {
    try {
      const existingAccount = await this.model.findOne({ email1: email });
      await OtpsModel.deleteMany({ email });
      if (!existingAccount) {
        return {
          status: 400,
          success: false,
          message: "Account not found please check your email",
        };
      }

      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      const newOTP = new OtpsModel({ email, otp });
      await newOTP.save();

      const smsData = {
        to: email,
        fullName: email,
        subject: "Your Chicago Passport & Visa Expedite Services OTP for Password Recovery",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #0056b3;">Forgot Your Password?</h2>
            <p>Dear ${fullName},</p>
            <p>We received a request to reset the password for your Chicago Passport & Visa Expedite Services account. To proceed with the password reset, please use the One-Time Password (OTP) provided below:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #0056b3;">${otp}</span>
            </div>
            <p>This OTP is valid for the next 10 minutes. Please use it to reset your password. If you did not request a password reset, please ignore this email.</p>
            <br />
            <p>Best regards,</p>
            <p>The Chicago Passport & Visa Expedite Services Team</p>
          </div>`,
      };

      this.mailService.sendEmailText(smsData, "");

      return {
        status: 200,
        success: true,
        message: "OTP sent successfully",
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async verifyUser(token: string): Promise<ServiceResponse> {
    try {
      if (!token) {
        return {
          status: 400,
          success: false,
          message: "Verification token is missing",
        };
      }

      // Verify the token
      let decoded;
      try {
        decoded = jwt.verify(token, ENV.JWT_SECRET!);
      } catch (error) {
        return {
          status: 400,
          success: false,
          message: "Invalid or expired token",
        };
      }

      const { email, caseId } = decoded as { email: string; caseId: string };

      // Find the case by the decoded caseId with populated account fields
      const case_ = await this.caseModel
        .findById(caseId)
        .populate({
          path: "account",
          select: "email1 isActive firstName lastName userKey",
        })
        .select("account");

      if (!case_) {
        return {
          status: 404,
          success: false,
          message: "Case not found",
        };
      }

      // Access the populated account object
      const updateUser = case_.account!;

      // Check if the user's account is already active
      //@ts-ignore
      if (updateUser?.isActive) {
        return {
          status: 200,
          success: true,
          message: "Account already verified. Please check your email.",
          //@ts-ignore
          data: updateUser.email1,
        };
      }

      // Update case and associated user account if the email doesn't match
      //@ts-ignore
      if (updateUser.email1 !== email) {
        // Update the email in the case and mark it as verified
        await this.caseModel.findByIdAndUpdate(
          caseId,
          { $set: { "account.email1": email, "account.emailVerified": true } },
          { new: true }
        );

        // Update the email in the associated user account and mark as active
        await this.model.findByIdAndUpdate(
          updateUser._id,
          { $set: { email1: email, isActive: true } },
          { new: true }
        );
      } else {
        // If the email matches, just activate the user
        await this.model.findByIdAndUpdate(
          updateUser._id,
          { $set: { isActive: true } },
          { new: true }
        );
      }

      // Prepare mail data
      const mailData = {
        from: "developer@zikrabyte.in",
        //@ts-ignore
        fullName:
          //@ts-ignore
          `${updateUser?.firstName ?? ""} ${updateUser?.lastName ?? ""}` ||
          "Chicago Passport & Visa Expedite Services User",
        caseId,
        //@ts-ignore
        to: updateUser?.email1!,
        //@ts-ignore
        password: updateUser?.userKey!,
      };

      // Send verification email only after the first activation
      await this.mailService.sendMail(mailData);

      return {
        status: 200,
        success: true,
        message: "Account verified successfully",
        //@ts-ignore
        data: updateUser.email1,
      };
    } catch (error) {
      console.log((error as Error).message);
      return {
        status: 500,
        success: false,
        message: "An internal server error occurred",
      };
    }
  }

  async verifyOtp(
    email: string,
    otp: string,
    name: {
      firstName: string;
      middleName: string;
      lastName: string;
    },
    phone: string
  ): ServiceResponse {
    try {
      const otpRecord = await OtpsModel.findOne({ email }).sort({ _id: -1 });

      if (!otpRecord) {
        return {
          status: 404,
          success: false,
          message: "OTP not found. Please request a new OTP.",
        };
      }

      if (otpRecord.attempts >= 5) {
        return {
          status: 400,
          success: false,
          message: "Maximum attempts reached. Please request a new OTP.",
        };
      }

      if (otpRecord.otp !== otp) {
        otpRecord.attempts += 1;
        await otpRecord.save();

        return {
          status: 400,
          success: false,
          message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`,
        };
      }

      // OTP is valid
      await OtpsModel.deleteOne({ email });

      // Check if user already exists
      const existingUser = await AccountsModel.findOne({ email1: email });

      if (existingUser) {
        if (!existingUser.isActive) {
          // Update existing inactive user
          existingUser.firstName = name.firstName;
          existingUser.middleName = name.middleName;
          existingUser.lastName = name.lastName;
          existingUser.phone1 = phone;
          await existingUser.save();

          const token = jwt.sign(
            { id: existingUser._id, email, role: "user" },
            this.JWTSECRET,
            { expiresIn: "72h" }
          );

          const data = { registrationToken: token, user: existingUser };
          return {
            status: 200,
            success: true,
            message: "Email verified successfully. Existing account activated.",
            data,
          };
        } else {
          // Active user already exists
          return {
            status: 400,
            success: false,
            message: "An active account with this email already exists.",
          };
        }
      } else {
        const { data } = await this.signup(
          email,
          Math.random().toString(36).slice(-8),
          {
            firstName: name.firstName,
            middleName: name.middleName,
            lastName: name.lastName,
          },
          undefined,
          phone
        );
        const registrationToken = data?.token;

        return {
          status: 200,
          success: true,
          message: "OTP verified successfully. New account created.",
          data: { registrationToken, user: data.user },
        };
      }
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async newPassword(newPassword: string, email: string): ServiceResponse {
    try {
      const account = await AccountsModel.findOne({ email1: email });

      if (!account) {
        return {
          status: 404,
          success: false,
          message: "Account not found. Please check your email.",
        };
      }

      const isPasswordSame =
        newPassword === account.userKey ||
        (await bcrypt.compare(newPassword, account.password));
      if (isPasswordSame) {
        return {
          success: false,
          status: 400,
          message: "New and old passwords cannnot be the same!",
        };
      }

      // Delete the OTP associated with this email
      await OtpsModel.deleteOne({ email });

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the account password and generate a new userKey
      account.password = hashedPassword;
      const newUserKey = Math.random().toString(36).slice(-8);
      account.userKey = newUserKey;
      await account.save();

      // Prepare the email content
      const emailData = {
        to: email,
        fullName: `${account.firstName + " " + account.lastName}`,
        subject: "Your Chicago Passport & Visa Expedite Services Account Password has been Updated",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #0056b3;">Password Updated Successfully</h2>
            <p>Dear ${account.firstName + " " + account.lastName},</p>
            <p>Your password has been successfully updated for your Chicago Passport & Visa Expedite Services account. Please use the new credentials below to log in:</p>
            <div style="background-color: #f1f1f1; padding: 10px; margin: 20px 0;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>New Password:</strong> ${newPassword}</p>
            </div>
            <p>If you did not request this change, please contact our support team immediately.</p>
            <br />
          </div>`,
      };

      // Send the email
      this.mailService.sendEmailText(emailData, "");

      return {
        status: 201,
        message:
          "Password successfully updated. Please log in with your new password.",
        success: true,
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async forgotVerifyOtp(email: string, otp: string): ServiceResponse {
    try {
      const otpRecord = await OtpsModel.findOne({ email });

      if (!otpRecord) {
        return {
          status: 404,
          success: false,
          message: "OTP not found. Please request a new OTP.",
        };
      }

      if (otpRecord.attempts >= 5) {
        return {
          status: 400,
          success: false,
          message: "Maximum attempts reached. Please request a new OTP.",
        };
      }

      if (otpRecord.otp !== otp) {
        otpRecord.attempts += 1;
        await otpRecord.save();

        return {
          status: 400,
          success: false,
          message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`,
        };
      }

      // OTP is valid
      await OtpsModel.deleteOne({ email });
      return {
        status: 200,
        success: true,
        message:
          "Email verified successfully.Provide new Password account activated.",
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async resendOtp(email: string, fullName: string): ServiceResponse {
    try {
      const existingOTP = await OtpsModel.findOne({ email });

      if (existingOTP) {
        await OtpsModel.deleteOne({ email });
      }

      return await this.sendForgotOtp(email, fullName);
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }
  async resendVerification(email: string, caseId: string): ServiceResponse {
    try {
      return await this.sendVerification(email, caseId);
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }
}
