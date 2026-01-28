import { PromoCodesModel } from "../../models/promo.models";
import { ServiceResponse } from "../../types/service-response.type";

type IPromoCode = {
  code: string;
  codeType: string;
  isActive?: boolean;
  startDate: Date;
  endDate: Date;
  discount: number;
  min: string;
  max: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class PromoService {
  private readonly model = PromoCodesModel;

  async create(data: IPromoCode): Promise<ServiceResponse> {
    try {
      const exist = await this.model.findOne({ code: data.code });

      if (exist) {
        return {
          status: 400,
          success: false,
          message: "Promo code already exists",
        };
      }

      const newPromoCode = await this.model.create(data);

      return {
        status: 201,
        success: true,
        message: "Promo code created successfully",
        data: newPromoCode,
      };
    } catch (error) {
      console.error("Error creating promo code:", error);
      throw error;
    }
  }

  async findByIdAndUpdate(
    id: string,
    data: IPromoCode
  ): Promise<ServiceResponse> {
    try {
      const exist = await this.findById(id);

      if (!exist.data) {
        return {
          status: 404,
          success: false,
          message: "Promo code not found in database",
        };
      }

      await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
      return {
        status: 200,
        success: true,
        message: "Promo code updated successfully",
      };
    } catch (error) {
      console.error("Error updating promo code:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<ServiceResponse> {
    try {
      const promoCode = await this.model.findById(id);
      return {
        status: 200,
        success: true,
        data: promoCode,
        message: "promo code retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding promo code:", error);
      throw error;
    }
  }

  async findAll(): Promise<ServiceResponse> {
    try {
      const promoCode = await this.model.find().sort({ createdAt: -1 });

      return {
        status: 200,
        success: true,
        data: promoCode,
        message: "Promo code retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding promo code:", error);
      throw error;
    }
  }

  async findByIdAndDelete(id: string): Promise<ServiceResponse> {
    try {
      const exist = await this.findById(id);

      if (!exist.data) {
        return {
          status: 404,
          success: false,
          message: "Promo code not found in database",
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
          ? "Promo code restored"
          : "Promo code soft deleted",
      };
    } catch (error) {
      console.error("Error deleting/restoring promo code:", error);
      throw error;
    }
  }
  async findByIdAndActive(id: string): Promise<ServiceResponse> {
    try {
      const exist = await this.findById(id);

      if (!exist.data) {
        return {
          status: 404,
          success: false,
          message: "Promo code not found in database",
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
          ? "Promo code Deactivated"
          : "Promo code Activated",
      };
    } catch (error) {
      console.error("Error deleting/restoring promo code:", error);
      throw error;
    }
  }
}
