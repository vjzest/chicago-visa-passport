import { FaqsModel } from "../../models/faq.model";
import { ServiceResponse } from "../../types/service-response.type";

export default class DashboardService {
  private readonly model = FaqsModel;

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
}
