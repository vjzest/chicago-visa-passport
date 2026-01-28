import mongoose from "mongoose";
import { ConfigModel } from "../../models/config.model";
import { TransactionsModel } from "../../models/transaction.model";
import { ProcessorsModel } from "../../models/processor.model";
import { ServiceResponse } from "../../types/service-response.type";
import { encrypt } from "../../utils/lib/cryptography";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

type IProcessor = {
  userName: string;
  password: string;
  processorName: string;
  description: string;
  transactionLimit: number;
  isActive?: boolean;
  isDefault: boolean;
};

export default class AdminProcessorService {
  private readonly model = ProcessorsModel;
  private readonly configModel = ConfigModel;
  private readonly transactionModel = TransactionsModel;

  async create(data: IProcessor): Promise<ServiceResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const existProcessorId = await this.model
        .findOne({
          userName: data.userName,
        })
        .session(session);

      if (existProcessorId) {
        await session.abortTransaction();
        await session.endSession();
        return {
          status: 400,
          message: "Processor ID already exists",
          success: false,
        };
      }

      const encryptedPassword = encrypt(data.password);
      const response = await this.model.create(
        [
          {
            ...data,
            password: encryptedPassword,
          },
        ],
        { session }
      );

      await this.configModel.updateOne(
        {},
        {
          $push: {
            loadBalancer: {
              processor: response[0]._id,
              weight: 0,
            },
          },
        },
        { session }
      );

      await session.commitTransaction();
      await session.endSession();

      return {
        status: 201,
        message: "Created successfully",
        data: response[0],
        success: true,
      };
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }
  async findByIdAndUpdate(
    id: string,
    data: {
      userName: string;
      password: string;
      description: string;
      processorName: string;
      transactionLimit: number;
    }
  ): Promise<ServiceResponse> {
    try {
      const exist = await this.model.findById(id);

      if (!exist) {
        return {
          status: 400,
          message: "Processor ID is missing",
          success: false,
        };
      }
      const query = data.password
        ? {
            userName: data.userName,
            processorName: data.processorName,
            password: encrypt(data.password),
            transactionLimit: data.transactionLimit,
            description: data.description,
          }
        : {
            userName: data.userName,
            processorName: data.processorName,
            transactionLimit: data.transactionLimit,
            description: data.description,
          };

      await this.model.findByIdAndUpdate(id, query, {
        new: true,
      });

      return {
        status: 200,
        message: "Processor ID updated successfully",
        success: true,
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  // find single processorId
  async findById(id: string): Promise<ServiceResponse> {
    try {
      const processor = await this.model.findById(id);
      return {
        status: 200,
        success: true,
        data: processor,
        message: "Processor ID retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding Processor ID:", error);
      throw error;
    }
  }

  // find all ProcessorId
  async findAll(): Promise<ServiceResponse> {
    try {
      const ProcessorIds = await this.model
        .find()
        .sort({ _id: -1 })
        .select("-password");
      return {
        status: 200,
        success: true,
        data: ProcessorIds,
        message: "Processor IDs retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding Processor IDs:", error);
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
          message: "Processor ID not found in database",
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
          ? "Processor ID restored"
          : "Processor ID soft deleted",
      };
    } catch (error) {
      console.error("Error deleting/restoring Processor ID:", error);
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
          message: "Processor ID not found in database",
        };
      }
      if (exist.data.isDefault && exist.data.isActive) {
        return {
          status: 400,
          success: false,
          message: "You cannot Inactivate Default Processor ID.",
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
          ? "Processor ID Deactivated"
          : "Processor ID Activated",
      };
    } catch (error) {
      console.error("Error deleting/restoring Processor ID:", error);
      throw error;
    }
  }
  async findByIdAndDefault(id: string): Promise<ServiceResponse> {
    try {
      // Find the processor by ID
      const exist = await this.findById(id);

      if (!exist.data) {
        return {
          status: 404,
          success: false,
          message: "Processor ID not found in database",
        };
      }

      await this.model.updateMany({}, { $set: { isDefault: false } });
      await this.model.findByIdAndUpdate(
        id,
        { isDefault: true, isActive: true, isDeleted: false },
        { new: true }
      );

      return {
        status: 200,
        success: true,
        message: "Processor ID set as Default",
        data: "",
      };
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  async GetActiveProcessor(req: AuthenticatedAdminRequest) {
    try {
      const { caseId } = req.params;

      if (!caseId) {
        throw new Error("Case ID is required");
      }

      // Fix typo in the field name
      const transaction = await this.transactionModel.findOne({
        caseId,
        transactionType: "casepayment",
      });

      return {
        success: true,
        data: transaction,
        status: 200,
        message: "transaction fetched successfully",
      };
    } catch (error) {
      console.error("Error in GetActiveProcessor service:", error);
      throw error;
    }
  }
}
