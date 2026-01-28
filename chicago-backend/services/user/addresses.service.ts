import {AccountsModel} from "../../models/accounts.model";

import {ServiceResponse} from "../../types/service-response.type";

export default class AddressesService {
  private readonly accountsModel = AccountsModel;

  async create(
    accountId: string,
    data: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      zip: string;
      phone: string;
      country: string;
    }
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
      account.addresses?.push(data);
      await account.save();
      return {
        status: 201,
        success: true,
        message: "Address created successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(accountId: string): ServiceResponse<any[]> {
    try {
      const account = await this.accountsModel
        .findById(accountId)
        .select("addresses");
      if (!account) {
        return {
          status: 404,
          success: false,
          message: "Account not found",
        };
      }
      return {
        status: 200,
        success: true,
        message: "Addresses fetched successfully",
        data: account?.addresses!,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(
    accountId: string,
    addressId: string,
    data: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      phone: string;
    }
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
      const address = account.addresses?.id(addressId);
      if (!address) {
        return {
          status: 404,
          success: false,
          message: "Address not found",
        };
      }
      address.set({
        line1: data.line1 || address.line1,
        line2: data.line2 || address.line2,
        city: data.city || address.city,
        state: data.state || address.state,
        zip: data.zip || address.zip,
        country: data.country || data.country,
        phone: data.phone || address.phone,
      });
      await account.save();
      return {
        status: 200,
        success: true,
        message: "Address updated successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async delete(accountId: string, addressId: string): ServiceResponse {
    try {
      await this.accountsModel.findOneAndUpdate(
        {
          _id: accountId,
          "addresses._id": addressId,
        },
        {
          $pull: {
            addresses: {
              _id: addressId,
            },
          },
        }
      );
      return {
        status: 200,
        success: true,
        message: "Address deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
