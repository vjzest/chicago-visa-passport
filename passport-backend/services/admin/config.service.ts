import mongoose from "mongoose";
import { ConfigModel } from "../../models/config.model";
import { ServiceResponse } from "../../types/service-response.type";
import { resetProcessorCounts } from "../../utils/lib/load-balancer";
export default class ConfigService {
  private readonly model = ConfigModel;

  async create(data: any): Promise<ServiceResponse> {
    try {
      // Find the existing Config document
      let config = await this.model.findOne();

      if (config?.fedex) {
        const newFedexConfig: any = {
          _id: new mongoose.Types.ObjectId(),
          title: data.title!,
          price: data.price!,
          isActive: data.isActive ?? true,
          isDeleted: data.isDeleted ?? false,
        };

        config.fedex.push(newFedexConfig);
        await config.save();

        return {
          status: 200,
          message: "FedexConfig added successfully",
          data: config.fedex,
          success: true,
        };
      } else {
        // If no Config document exists, create a new one
        const newFedexConfig = {
          ...data,
          _id: new mongoose.Types.ObjectId(),
        };

        const newConfig = await this.model.create({ fedex: [newFedexConfig] });

        const created = newConfig?.fedex?.reverse()[0];
        return {
          status: 201,
          message: "Config created successfully with new FedexConfig",
          data: created,
          success: true,
        };
      }
    } catch (error) {
      console.error(
        "Error creating/updating configuration:",
        (error as Error).message
      );
      throw new Error((error as Error).message);
    }
  }

  async findByIdAndUpdate(
    id: string,
    data: { title: string; price: number }
  ): Promise<ServiceResponse> {
    try {
      // Find the existing Config document
      const config = await this.model.findOne();

      if (!config || !config.fedex) {
        return {
          status: 400,
          message: "Configuration not found",
          success: false,
        };
      }

      // Find the specific FedEx configuration by ID
      const fedexItem = config.fedex.find(
        (item: any) => item._id.toString() === id
      );

      if (!fedexItem) {
        return {
          status: 400,
          message: "FedEx configuration not found",
          success: false,
        };
      }

      // Update the specific FedEx configuration fields
      fedexItem.title = data.title;
      fedexItem.price = data.price;

      // Save the updated configuration
      const response = await config.save();

      return {
        status: 200,
        message: "FedEx configuration updated successfully",
        success: true,
        data: response.fedex.find((item: any) => item._id.toString() === id),
      };
    } catch (error) {
      console.log("Error updating configuration:", (error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async findById(id: string): Promise<ServiceResponse> {
    try {
      const config = await this.model.findById(id);
      return {
        status: 200,
        success: true,
        data: config,
        message: "Retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding:", error);
      throw error;
    }
  }

  async findAll(): Promise<ServiceResponse> {
    try {
      const configs: any = await this.model.findOne();
      return {
        status: 200,
        success: true,
        data: configs.fedex.reverse(),
        message: "Retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding:", error);
      throw error;
    }
  }

  async findByIdAndDelete(id: string): Promise<ServiceResponse> {
    try {
      const config = await this.model.findOne();

      if (!config || !config.fedex) {
        return {
          status: 400,
          message: "Configuration not found",
          success: false,
        };
      }

      // Find the specific FedEx configuration by ID
      const fedexItem = config.fedex.find(
        (item: any) => item._id.toString() === id
      );

      if (!fedexItem) {
        return {
          status: 400,
          message: "FedEx configuration not found",
          success: false,
        };
      }

      // Update the specific FedEx configuration fields
      fedexItem.isDeleted = !fedexItem.isDeleted;

      // Save the updated configuration
      const response = await config.save();

      return {
        status: 200,
        message: response.fedex.find((item: any) => item._id.toString() === id)
          ?.isDeleted
          ? "Fedex configuration soft deleted"
          : "Fedex configuration restored",
        success: true,
        data: response.fedex.find((item: any) => item._id.toString() === id),
      };
    } catch (error) {
      console.error("Error deleting/restoring Fedex configuration:", error);
      throw error;
    }
  }

  async findByIdAndActive(id: string): Promise<ServiceResponse> {
    try {
      const config = await this.model.findOne();

      if (!config || !config.fedex) {
        return {
          status: 400,
          message: "Configuration not found",
          success: false,
        };
      }

      // Find the specific FedEx configuration by ID
      const fedexItem = config.fedex.find(
        (item: any) => item._id.toString() === id
      );

      if (!fedexItem) {
        return {
          status: 400,
          message: "FedEx configuration not found",
          success: false,
        };
      }

      // Update the specific FedEx configuration fields
      fedexItem.isActive = !fedexItem.isActive;

      // Save the updated configuration
      const response = await config.save();

      return {
        status: 200,
        message: response.fedex.find((item: any) => item._id.toString() === id)
          ?.isActive
          ? "Fedex configuration activated"
          : "Fedex configuration deactivated",
        success: true,
        data: response.fedex.find((item: any) => item._id.toString() === id),
      };
    } catch (error) {
      console.error(
        "Error activating/deactivating Fedex configuration:",
        error
      );
      throw error;
    }
  }

  async tNCFindByIdAndUpdate(data: {
    content: string;
    verbiage: string;
  }): ServiceResponse {
    try {
      // Find the existing Config document
      const config = await this.model.findOne();
      if (!config) {
        return {
          status: 400,
          message: "Configuration not found",
          success: false,
        };
      }

      // check if tnc exists in the config document, if not, intialize it
      if (!config.tnc) {
        config.tnc = {
          content: "",
          verbiage: "",
        };
      }

      // Update the specific terms and conditions fields
      config.tnc.content = data.content;
      config.tnc.verbiage = data.verbiage;

      // Save the updated terms and conditions
      const response = await config.save();

      return {
        status: 200,
        message: "terms and conditions updated successfully",
        success: true,
        data: response.tnc,
      };
    } catch (error) {
      console.log("Error updating configuration:", (error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async updatePrivacyPolicy(content: string): ServiceResponse {
    try {
      // Find the existing Config document
      const config = await this.model.findOne();
      if (!config) {
        return {
          status: 400,
          message: "Configuration not found",
          success: false,
        };
      }

      config.privacyPolicy = content;

      const response = await config.save();

      return {
        status: 200,
        message: "Privacy policy updated successfully",
        success: true,
        data: response.privacyPolicy,
      };
    } catch (error) {
      console.log("Error updating configuration:", (error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async updateRefundPolicy(content: string): ServiceResponse {
    try {
      // Find the existing Config document
      const config = await this.model.findOne();
      if (!config) {
        return {
          status: 400,
          message: "Configuration not found",
          success: false,
        };
      }

      config.refundPolicy = content;

      const response = await config.save();

      return {
        status: 200,
        message: "Refund policy updated successfully",
        success: true,
        data: response.refundPolicy,
      };
    } catch (error) {
      console.log("Error updating configuration:", (error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async updateOnlineProcessingFee(
    fee: string,
    chargeFee: boolean
  ): Promise<ServiceResponse> {
    try {
      // Find the existing Config document
      const config = await this.model.findOne();

      if (!config) {
        return {
          status: 400,
          message: "Configuration not found",
          success: false,
        };
      }

      // Update the fee regardless if it exists or not
      config.onlineProcessingFee = fee;
      config.chargeOnlineProcessingFee = chargeFee;

      // Save the updated configuration
      const updatedConfig = await config.save();

      return {
        status: 200,
        message: "Online processing fee updated successfully",
        success: true,
        data: updatedConfig.onlineProcessingFee,
      };
    } catch (error) {
      console.error(
        "Error updating online processing fee:",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  }

  async getOnlineProcessingFee(): Promise<ServiceResponse> {
    try {
      const config = await this.model.findOne();

      if (!config) {
        return {
          status: 404,
          message: "Configuration not found",
          success: false,
        };
      }

      return {
        status: 200,
        message: "Online processing fee retrieved successfully",
        success: true,
        data: {
          onlineProcessingFee: config.onlineProcessingFee,
          chargeOnlineProcessingFee: config.chargeOnlineProcessingFee,
        },
      };
    } catch (error) {
      console.error(
        "Error getting online processing fee:",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  }
  async updateGovFee(fee: number): Promise<ServiceResponse> {
    try {
      // Find the existing Config document
      const config = await this.model.findOne();

      if (!config) {
        return {
          status: 400,
          message: "Configuration not found",
          success: false,
        };
      }

      // Update the fee regardless if it exists or not
      config.govFee = fee;

      // Save the updated configuration
      const updatedConfig = await config.save();

      return {
        status: 200,
        message: "Online processing fee updated successfully",
        success: true,
        data: updatedConfig.govFee,
      };
    } catch (error) {
      console.error(
        "Error updating online processing fee:",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  }

  async getGovFee(): Promise<ServiceResponse> {
    try {
      const config = await this.model.findOne();

      if (!config) {
        return {
          status: 404,
          message: "Configuration not found",
          success: false,
        };
      }

      return {
        status: 200,
        message: "Online processing fee retrieved successfully",
        success: true,
        data: config.govFee,
      };
    } catch (error) {
      console.error(
        "Error getting online processing fee:",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  }
  async updatePaymentDisclaimer(disclaimer: string): Promise<ServiceResponse> {
    try {
      // Find the existing Config document
      const config = await this.model.findOne();

      if (!config) {
        return {
          status: 400,
          message: "Configuration not found",
          success: false,
        };
      }

      // Update the disclaimer regardless if it exists or not
      config.paymentDisclaimer = disclaimer;

      // Save the updated configuration
      const updatedConfig = await config.save();

      return {
        status: 200,
        message: "Payment disclaimer updated successfully",
        success: true,
        data: updatedConfig.paymentDisclaimer,
      };
    } catch (error) {
      console.error(
        "Error updating online processing fee:",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  }

  async getPaymentDisclaimer(): Promise<ServiceResponse> {
    try {
      const config = await this.model.findOne();

      if (!config) {
        return {
          status: 404,
          message: "Configuration not found",
          success: false,
        };
      }

      return {
        status: 200,
        message: "Payment disclaimer retrieved successfully",
        success: true,
        data: config.paymentDisclaimer,
      };
    } catch (error) {
      console.error(
        "Error getting online processing fee:",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  }

  async findTermsAndConditions(): ServiceResponse {
    try {
      const config: any = await this.model.findOne();
      return {
        status: 200,
        success: true,
        data: config.tnc,
        message: "Retrieved successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async findPrivacyPolicy(): ServiceResponse {
    try {
      const config = await this.model.findOne();
      return {
        status: 200,
        success: true,
        data: config?.privacyPolicy,
        message: "Retrieved successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async findRefundPolicy(): ServiceResponse {
    try {
      const config = await this.model.findOne().select("refundPolicy");
      return {
        status: 200,
        success: true,
        data: config?.refundPolicy,
        message: "Retrieved successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLoadBalancerSetup(): ServiceResponse {
    try {
      const config: any = await this.model
        .findOne({})
        .select("loadBalancer")
        .populate([
          {
            path: "loadBalancer.processor",
            select: "processorName description",
          },
        ]);
      return {
        status: 200,
        success: true,
        data: config.loadBalancer,
        message: "Retrieved successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async editLoadBalancerSetup(
    newSetupArr: { processor: string; weight: number }[]
  ): ServiceResponse {
    try {
      let totalWeight = 0;
      newSetupArr.forEach((setup) => {
        totalWeight += setup.weight;
      });
      if (totalWeight !== 100) {
        return {
          status: 400,
          success: false,
          message: "Total weight must be 100",
        };
      }
      const config = await this.model.findOne({});
      config?.loadBalancer.forEach((setup: any) => {
        const newSetup = newSetupArr.find(
          (newSetup) => newSetup.processor === setup.processor.toString()
        );
        if (newSetup) {
          setup.weight = newSetup.weight;
        }
      });
      await config?.save();
      resetProcessorCounts();
      return {
        status: 200,
        success: true,
        message: "Edited setup successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async toggleIpLock(action: "enable" | "disable") {
    try {
      const config = await this.model.findOne({});
      if (!config) {
        return {
          status: 400,
          success: false,
          message: "Configuration not found",
        };
      }
      config.ipLockEnabled = action === "enable" ? true : false;
      await config.save();
      return {
        status: 200,
        success: true,
        message: `IP lock ${
          action === "enable" ? "enabled" : "disabled"
        } successfully`,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getIpLockStatus() {
    try {
      const config = await this.model.findOne({});
      if (!config) {
        return {
          status: 400,
          success: false,
          message: "Configuration not found",
        };
      }

      return {
        status: 200,
        success: true,
        message: `IP lock status fetched successfully`,
        data: config.ipLockEnabled,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getDepartureDateField(): ServiceResponse {
    try {
      const config = await this.model.findOne({});
      if (!config) {
        return {
          status: 400,
          success: false,
          message: "Configuration not found",
        };
      }
      return {
        status: 200,
        success: true,
        message: `Departure date field status fetched successfully`,
        data: config.departureDateFieldEnabled,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async toggleDepartureDateField(): ServiceResponse {
    try {
      const config = await this.model.findOne({});
      if (!config) {
        return {
          status: 400,
          success: false,
          message: "Configuration not found",
        };
      }
      config.departureDateFieldEnabled = !config.departureDateFieldEnabled;
      await config.save();
      return {
        status: 200,
        success: true,
        message: `Departure date field ${
          config.departureDateFieldEnabled ? "enabled" : "disabled"
        } successfully`,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
