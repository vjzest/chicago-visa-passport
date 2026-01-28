import { ServiceLevelsModel } from "../../models/service-level.model";
import { ServiceResponse } from "../../types/service-response.type";

type IServiceLevel = {
  serviceLevel: string;
  time: string;
  speedInWeeks: number;
  nonRefundableFee: string;
  price: number;
  inboundFee: number;
  outboundFee: number;
  paymentGateway: string;
  authOnlyFrontend: string;
  amex: string;
  loa: string;
  doubleCharge: number;
  serviceTypes: string[];
  isDeleted?: boolean;
  isActive?: boolean;
};

export default class AdminServiceLevelService {
  private readonly model = ServiceLevelsModel;

  async create(data: IServiceLevel): ServiceResponse {
    try {
      const response = await this.model.create({
        ...data,
        paymentGateway:
          data.paymentGateway === "none" ? null : data.paymentGateway,
      });
      return {
        status: 201,
        message: "created successfully",
        data: response,
        success: true,
      };
    } catch (error) {
      console.log("Service level create Error ", error);
      throw new Error((error as Error).message);
    }
  }
  async findByIdAndUpdate(id: string, data: IServiceLevel): ServiceResponse {
    try {
      const exist = await this.model.findById(id);

      if (!exist) {
        return {
          status: 400,
          message: "Service level is missing",
          success: false,
        };
      }

      const response = await this.model
        .findByIdAndUpdate(
          id,
          {
            ...data,
            paymentGateway:
              data.paymentGateway === "none" ? null : data.paymentGateway,
          },
          {
            new: true,
          }
        )
        .populate({ path: "serviceTypes", model: "servicetypes" });

      return {
        status: 200,
        message: "Service level updated successfully",
        data: response,
        success: true,
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  // find single service level
  async findById(id: string): ServiceResponse {
    try {
      const service = await this.model.findById(id);
      return {
        status: 200,
        success: true,
        data: service,
        message: "shipping address retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding shipping address:", error);
      throw error;
    }
  }

  // find all service level
  async findAll(
    options: { onlyActive: boolean; populateServiceType?: boolean } = {
      onlyActive: false,
      populateServiceType: true,
    }
  ): ServiceResponse {
    try {
      const serviceLevels = await this.model
        .find(options?.onlyActive ? { isActive: true } : {})
        .populate([
          ...(options?.populateServiceType
            ? [{ path: "serviceTypes", model: "servicetypes" }]
            : []),
          { path: "paymentGateway", model: "processor" },
        ])
        .sort({ createdAt: -1 });
      return {
        status: 200,
        success: true,
        data: serviceLevels,
        message: "Service levels retrieved successfully",
      };
    } catch (error) {
      console.log(error);
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
          message: "Service level not found in database",
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
          ? "Service level Deactivated"
          : "Service level Activated",
      };
    } catch (error) {
      console.error("Error deleting/restoring Service level:", error);
      throw error;
    }
  }

  async toggleArchiveState(serviceLevelId: string) {
    try {
      const serviceLevel = await this.model
        .findById(serviceLevelId)
        .select("isArchived");
      if (!serviceLevel) {
        return {
          status: 400,
          success: false,
          message: "Service type not found",
        };
      }
      await this.model.updateOne(
        { _id: serviceLevelId },
        {
          $set: {
            isArchived: !serviceLevel.isArchived,
            isActive: false,
          },
        }
      );
      return {
        status: 200,
        success: true,
        message: `Service type ${
          serviceLevel.isArchived ? "unarchived" : "archived"
        } successfully`,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
