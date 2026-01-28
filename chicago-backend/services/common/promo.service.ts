import { PromoCodesModel } from "../../models/promo.models";
import { ServiceResponse } from "../../types/service-response.type";

export default class PromoService {
  private readonly model = PromoCodesModel;

  async findByCode(code: string): Promise<ServiceResponse> {
    try {
      const upperCaseCode = code.toUpperCase();
      const promoCode = await this.model.findOne({ code: upperCaseCode });
      return {
        status: 200,
        success: true,
        data: promoCode,
        message: "Retrieved promo code",
      };
    } catch (error) {
      console.error("Error finding consultation:", error);
      throw error;
    }
  }
}
