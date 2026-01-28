import { AccountsModel } from "../../models/accounts.model";
import { ServiceResponse } from "../../types/service-response.type";

export default class AccountsService {
  private readonly accountsModel = AccountsModel;

  async findAll(): ServiceResponse {
    try {
      const account = await this.accountsModel
        .find()
        .select("-password -userKey");
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

  async findOneByNumber(phone1: string): ServiceResponse {
    try {
      const account = await this.accountsModel
        .findOne({ phone1 })
        .select("-password");
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
}
