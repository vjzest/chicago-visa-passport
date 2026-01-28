import {
  AdditionalServicesModel,
  IAdditionalService,
} from "../../models/additional.service.model";
import { ServiceResponse } from "../../types/service-response.type";

export default class AdminAdditionalService {
  private readonly model = AdditionalServicesModel;

  async create(data: IAdditionalService): Promise<ServiceResponse> {
    try {
      const existAdditionalService = await this.model.findOne({
        title: data.title,
      });
      if (existAdditionalService) {
        return {
          status: 400,
          message: "Add.service already exist",
          success: false,
        };
      }
      const response = await this.model.create(data);

      return {
        status: 201,
        message: "Created successfully",
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
    data: IAdditionalService
  ): Promise<ServiceResponse> {
    try {
      const exist = await this.model.findById(id);

      if (!exist) {
        return {
          status: 400,
          message: "Add. service is missing",
          success: false,
        };
      }

      const response = await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
      // .populate({path:'serviceTypes',model:'servicetype'});

      return {
        status: 200,
        message: "Add. service updated successfully",
        success: true,
        data: response,
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  // find single Additional
  async findById(id: string): Promise<ServiceResponse> {
    try {
      const shipping = await this.model.findById(id);
      return {
        status: 200,
        success: true,
        data: shipping,
        message: "Additional Service retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding Additional Service:", error);
      throw error;
    }
  }

  // find all additional
  async findAll(
    queryData?: {
      serviceType?: string;
      isActive?: boolean;
    } | null
  ): Promise<ServiceResponse> {
    try {
      let query = {};
      if (queryData?.serviceType) {
        query = {
          serviceTypes: {
            $in: queryData?.serviceType!,
          },
        };
      }
      if (queryData?.isActive) {
        query = {
          ...query,
          isActive: queryData?.isActive,
        };
      }
      const AdditionalService: any = await this.model
        .find(query)
        .populate(["serviceTypes"])
        .sort({ _id: -1 });

      return {
        status: 200,
        success: true,
        data: AdditionalService,
        message: "Additional Service retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding Additional Services:", error);
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
          message: "Additional Service not found in database",
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
          ? "Additional Service restored"
          : "Additional Service soft deleted",
      };
    } catch (error) {
      console.error("Error deleting/restoring Additional Service:", error);
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
          message: "Additional Service not found in database",
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
          ? "Additional Service Deactivated"
          : "Additional Service Activated",
      };
    } catch (error) {
      console.error("Error deleting/restoring Additional Service:", error);
      throw error;
    }
  }
}
