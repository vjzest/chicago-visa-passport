import { ContactInfoModel } from "../../models/contact-info-model";
import { ServiceResponse } from "../../types/service-response.type";

export class ContactInfoService {
  private contactInfoModel = ContactInfoModel;

  async getContactDetails(): ServiceResponse {
    try {
      const doc = await this.contactInfoModel.findOne();
      return {
        success: true,
        message: "Contact info fetched successfully",
        status: 200,
        data: doc,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(data: {
    email: string;
    phone: string;
    address: string;
    googleMapsUrl: string;
  }): ServiceResponse {
    try {
      const doc = await this.contactInfoModel.findOne();
      if (doc) {
        doc.email = data.email;
        doc.phone = data.phone;
        doc.address = data.address;
        doc.googleMapsUrl = data.googleMapsUrl;
        await doc.save();
      }
      return {
        success: true,
        message: "Contact info updated successfully",
        status: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
