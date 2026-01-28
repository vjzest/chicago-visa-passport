import { ServiceResponse } from "../../types/service-response.type";
import FedexUtil from "../../utils/fedex";

export default class TrackingService {
  private readonly fedexUtil = new FedexUtil();

  async trackShipmentByTrackingId(trackingIds: string[]): ServiceResponse {
    try {
      const result = await this.fedexUtil.trackShipment(trackingIds);
      return {
        status: 201,
        success: true,
        message: "Tracking details fetched successfully",
        data: result,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
