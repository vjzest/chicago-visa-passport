import { FaqsModel } from "../../models/faq.model";
import { ServiceResponse } from "../../types/service-response.type";

export default class FaqService {
  private readonly model = FaqsModel;

  async create(data: any): Promise<ServiceResponse> {
    try {
      const faq = await this.model.create(data);
      return {
        status: 201,
        success: true,
        message: "FAQ created successfully",
        data: faq,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll(): Promise<ServiceResponse<any>> {
    try {
      const faqs = await this.model.find();
      return {
        status: 200,
        success: true,
        message: "FAQs fetched successfully",
        data: faqs,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findActive(): ServiceResponse {
    try {
      const faqs = await this.model.find({ isActive: true });
      return {
        status: 200,
        success: true,
        message: "FAQs fetched successfully",
        data: faqs,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<ServiceResponse<any>> {
    try {
      const faq = await this.model.findById(id);
      if (!faq) {
        return {
          status: 404,
          success: false,
          message: "FAQ not found",
        };
      }
      return {
        status: 200,
        success: true,
        message: "FAQ fetched successfully",
        data: faq,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id: string, data: any): Promise<ServiceResponse> {
    try {
      const faq = await this.model.findByIdAndUpdate(id, data, { new: true });
      if (!faq) {
        return {
          status: 404,
          success: false,
          message: "FAQ not found",
        };
      }
      return {
        status: 200,
        success: true,
        message: "FAQ updated successfully",
        data: faq,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id: string): Promise<ServiceResponse> {
    try {
      const faq = await this.model.findByIdAndDelete(id);
      if (!faq) {
        return {
          status: 404,
          success: false,
          message: "FAQ not found",
        };
      }
      return {
        status: 200,
        success: true,
        message: "FAQ deleted successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
