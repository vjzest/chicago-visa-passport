import mongoose from "mongoose";
import {
  FedexPackagesModel,
  IFedexPackage,
} from "../../models/fedex-packages.model";
import { ServiceResponse } from "../../types/service-response.type";

export class FedexPackagesService {
  private model = FedexPackagesModel;

  async findAll(
    queryData?: {
      caseId?: string;
      isActive?: boolean;
      isDelivered?: boolean;
      pageNo?: number;
    } | null
  ): Promise<ServiceResponse> {
    try {
      const page = queryData?.pageNo || 1;
      const limit = 10; // You can make this configurable
      const skip = (page - 1) * limit;

      let query: any = {};

      if (queryData?.caseId) {
        query.case = new mongoose.Types.ObjectId(queryData.caseId);
      }

      if (queryData?.isActive !== undefined) {
        query.isActive = queryData.isActive;
      }

      if (queryData?.isDelivered !== undefined) {
        query.isDelivered = queryData.isDelivered;
      }

      const [fedexPackages, totalCount] = await Promise.all([
        this.model
          .find(query)
          .populate({
            path: "case",
            select: "applicantInfo caseNo",
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        this.model.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        status: 200,
        success: true,
        data: { fedexPackages, totalPages, currentPage: page, totalCount },
        message: "FedEx packages retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding FedEx packages:", error);
      throw error;
    }
  }

  async toggleActive(packageId: string): Promise<ServiceResponse> {
    try {
      if (!mongoose.Types.ObjectId.isValid(packageId)) {
        return {
          status: 400,
          success: false,
          message: "Invalid package ID",
        };
      }

      const fedexPackage = await this.model.findById(packageId);

      if (!fedexPackage) {
        return {
          status: 404,
          success: false,
          message: "FedEx package not found",
        };
      }

      const updatedPackage = await this.model
        .findByIdAndUpdate(
          packageId,
          { isActive: !fedexPackage.isActive },
          { new: true }
        )
        .populate("case");

      return {
        status: 200,
        success: true,
        data: updatedPackage,
        message: `FedEx package ${
          updatedPackage!.isActive ? "activated" : "deactivated"
        } successfully`,
      };
    } catch (error) {
      console.error("Error toggling FedEx package active status:", error);
      throw error;
    }
  }

  async getDelayedCount(): Promise<ServiceResponse> {
    try {
      const delayedCount = await this.model.countDocuments({
        expectedDate: { $lte: new Date(new Date().setHours(0, 0, 0, 0)) },
        isActive: true,
        isDelivered: false,
      });

      return {
        status: 200,
        success: true,
        data: delayedCount,
        message: "Delayed packages count retrieved successfully",
      };
    } catch (error) {
      console.error("Error getting delayed packages count:", error);
      throw error;
    }
  }

  async getDelayedPackages(): Promise<ServiceResponse<IFedexPackage[]>> {
    try {
      const delayedPackages = await this.model
        .find({
          expectedDate: { $lte: new Date(new Date().setHours(0, 0, 0, 0)) },
          isActive: true,
          isDelivered: false,
        })
        .populate({
          path: "case",
          select: "applicantInfo caseNo",
        })
        .sort({ expectedDate: 1 });

      return {
        status: 200,
        success: true,
        data: delayedPackages,
        message: "Delayed packages retrieved successfully",
      };
    } catch (error) {
      console.error("Error getting delayed packages:", error);
      throw error;
    }
  }

  async getDelayedPackagesForReport(): Promise<ServiceResponse> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Query for delayed packages
      const delayedPackages = await this.model
        .find({
          isActive: true,
          isDelivered: false,
          expectedDate: { $lt: today },
        })
        .populate("case", "caseNo applicantInfo")
        .sort({ expectedDate: 1 }); // Sort by oldest expected date first

      const packagesWithDelay = delayedPackages.map((pkg) => {
        const expectedDate = new Date(pkg.expectedDate);
        expectedDate.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - expectedDate.getTime();
        const delayedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          ...pkg.toObject(),
          delayedDays,
        };
      });

      return {
        status: 200,
        success: true,
        data: packagesWithDelay,
        message: "Delayed packages for report retrieved successfully",
      };
    } catch (error) {
      console.error("Error getting delayed packages for report:", error);
      throw error;
    }
  }
}
