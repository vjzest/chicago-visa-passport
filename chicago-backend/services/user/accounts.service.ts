import { AccountsModel } from "../../models/accounts.model";
import bcrypt from "bcryptjs";
import { ServiceResponse } from "../../types/service-response.type";

export default class AccountsService {
  private readonly accountsModel = AccountsModel;

  async findOne(accountId: string, passport?: boolean): ServiceResponse {
    try {
      const account = await this.accountsModel.findById(accountId);
      if (!account) {
        return {
          status: 400,
          success: false,
          message: "Account not found",
        };
      }
      if (!passport) {
        account.password = "";
        account.userKey = "";
      }
      return {
        status: 200,
        success: true,
        message: "Account fetched successfully",
        data: account,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async findOneByEmail(email: string): ServiceResponse {
    try {
      const account = await this.accountsModel.findOne({ email1: email });
      if (!account) {
        return {
          status: 400,
          success: false,
          message: "Account not found",
        };
      }
      account.password = "";
      return {
        status: 200,
        success: true,
        message: "Account fetched successfully",
        data: account,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(
    accountId: string,
    data: {
      firstName: string;
      middleName: string;
      lastName: string;
      email1: string;
      email2: string;
      phone1: string;
      phone2: string;
    }
  ): ServiceResponse {
    try {
      const account = await this.accountsModel.findById(accountId);
      if (!account) {
        return {
          status: 404,
          success: false,
          message: "Account not found",
        };
      }
      account.set({
        firstName: data.firstName || account.firstName,
        middleName: data.middleName,
        lastName: data.lastName || account.lastName,
        email1: data.email1 || account.email1,
        email2: data.email2 || account.email2,
        phone1: data.phone1 || account.phone1,
        phone2: data.phone2 || account.phone2,
      });
      await account.save();
      return {
        status: 200,
        success: true,
        message: "Account updated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(
    accountId: string,
    oldPassword: string,
    newPassword: string
  ): ServiceResponse {
    try {
      const account = await this.accountsModel.findById(accountId);
      if (!account) {
        return {
          status: 400,
          success: false,
          message: "Account not found",
        };
      }
      const isMatch = await bcrypt.compare(oldPassword, account.password);
      if (!isMatch) {
        return {
          status: 400,
          success: false,
          message: "Invalid old password",
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

      account.set({
        password: await bcrypt.hash(newPassword, 10),
      });
      await account.save();
      return {
        status: 200,
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
