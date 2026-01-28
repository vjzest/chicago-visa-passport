import { ConsultationsModel } from "../../models/consultation.model";
import { ServiceResponse } from "../../types/service-response.type";

export default class ContactService {
  private readonly model = ConsultationsModel;

  async create(data: any): Promise<ServiceResponse> {
    try {
      const newRequest = await this.model.create(data);

      return {
        status: 201,
        success: true,
        message: "Request submitted successfully",
        data: newRequest,
      };
    } catch (error) {
      console.error("Error creating promo code:", error);
      throw error;
    }
  }

  async findByIdAndUpdate(id: string): Promise<ServiceResponse> {
    try {
      const exist = await this.model.findById(id);

      if (!exist) {
        return {
          status: 400,
          success: false,
          message: "Consultation not found in database",
        };
      }

      // Toggle the isResolved field
      exist.isResolved = !exist.isResolved;
      await exist.save();

      return {
        status: 200,
        success: true,
        message: "Consultation updated successfully",
      };
    } catch (error) {
      console.error("Error updating consultation:", error);
      return {
        status: 500,
        success: false,
        message: "Internal server error",
      };
    }
  }

  async findById(id: string): Promise<ServiceResponse> {
    try {
      const consultation = await this.model.findById(id);
      return {
        status: 200,
        success: true,
        data: consultation,
        message: "retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding consultation:", error);
      throw error;
    }
  }

  async findAll(): Promise<ServiceResponse> {
    try {
      const consultation = await this.model.find().sort({ _id: -1 });
      return {
        status: 200,
        success: true,
        data: consultation,
        message: "Retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding promo code:", error);
      throw error;
    }
  }
}
