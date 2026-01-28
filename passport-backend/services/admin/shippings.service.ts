import { ShippingsModel } from "../../models/shipping.models";
import { ServiceResponse } from "../../types/service-response.type";

type IShippingCode = {
  locationName: string;
  company: string;
  authorisedPerson: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  instruction: string;
};

export default class ShippingAddressService {
  private readonly model = ShippingsModel;

  async create(data: IShippingCode): Promise<ServiceResponse> {
    try {
      const response = await this.model.create(data);
      return {
        status: 201,
        message: "created successfully",
        data: response,
        success: true,
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }
  async findByIdAndUpdate(
    id: string,
    data: IShippingCode
  ): Promise<ServiceResponse> {
    try {
      const exist = await this.model.findById(id);

      if (!exist) {
        return {
          status: 400,
          message: "shipping address is missing",
          success: false,
        };
      }

      await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });

      return {
        status: 200,
        message: "shipping address updated successfully",
        success: true,
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  // find single address
  async findById(id: string): Promise<ServiceResponse> {
    try {
      const shipping = await this.model.findById(id);
      return {
        status: 200,
        success: true,
        data: shipping,
        message: "shipping address retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding shipping address:", error);
      throw error;
    }
  }

  // find all shipping address
  async findAll(options?: {
    onlyActive?: boolean;
    onlyAllowed?: boolean;
    allowedLocations?: string[];
  }): Promise<ServiceResponse> {
    try {
      const query: { isActive?: boolean; _id?: { $in?: string[] } } = {};
      if (options?.onlyActive) {
        query["isActive"] = true;
      }
      if (options?.onlyAllowed) {
        query["_id"] = { $in: options?.allowedLocations };
      }

      const shippingAddresses = await this.model
        .find(query)
        .sort({ createdAt: -1 });
      return {
        status: 200,
        success: true,
        data: shippingAddresses,
        message: "Shipping address retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding shipping address:", error);
      throw error;
    }
  }

  // find and delete
  async findByIdAndDelete(id: string): Promise<ServiceResponse> {
    try {
      const exist = await this.findById(id);

      if (!exist.data) {
        return {
          status: 404,
          success: false,
          message: "Shipping address not found in database",
        };
      }
      await this.model.findByIdAndUpdate(
        id,
        { isDeleted: !exist?.data?.isDeleted },
        { new: true }
      );

      return {
        status: 200,
        success: true,
        message: exist?.data?.isDeleted
          ? "Shipping address restored"
          : "Shipping address soft deleted",
      };
    } catch (error) {
      console.error("Error deleting/restoring shipping address:", error);
      throw error;
    }
  }

  // activating and deleting
  async findByIdAndActive(id: string): Promise<ServiceResponse> {
    try {
      const exist = await this.findById(id);

      if (!exist.data) {
        return {
          status: 404,
          success: false,
          message: "shipping address not found in database",
        };
      }
      await this.model.findByIdAndUpdate(
        id,
        { isActive: !exist?.data?.isActive },
        { new: true }
      );

      return {
        status: 200,
        success: true,
        message: exist?.data?.isActive
          ? "Shipping address Deactivated"
          : "Shipping address Activated",
      };
    } catch (error) {
      console.error("Error deleting/restoring shipping address:", error);
      throw error;
    }
  }
}
