import { ServiceResponse } from "../../types/service-response.type";
import { ServiceTypesModel } from "../../models/service-type.model";

export default class VisaTypeService {
  private readonly model = ServiceTypesModel;

  async findAll(): ServiceResponse<any> {
    try {
      const serviceTypes = await this.model
        .find()
        .populate("country")
        .populate("originCountries")
        .populate("shippingAddress");
      return {
        status: 200,
        success: true,
        message: "Visa types fetched successfully",
        data: serviceTypes,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
