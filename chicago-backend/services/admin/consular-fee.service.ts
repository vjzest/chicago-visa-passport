import { ServiceResponse } from "../../types/service-response.type";
import { ConsularFeeModel } from "../../models/consular-fee.model";
import { ServiceTypesModel } from "../../models/service-type.model";
import { ServiceLevelsModel } from "../../models/service-level.model";
import { CountryPairModel } from "../../models/country-pair.model";

export default class ConsularFeeService {
  private readonly model = ConsularFeeModel;
  private readonly serviceTypeModel = ServiceTypesModel;
  private readonly serviceLevelModel = ServiceLevelsModel;
  private readonly countryPairModel = CountryPairModel;

  /**
   * Get all consular fees for a specific country pair
   */
  async findByCountryPair(countryPairId: string): ServiceResponse {
    try {
      const fees = await this.model
        .find({ countryPairId })
        .populate("serviceTypeId", "serviceType shortHand")
        .populate("serviceLevelId", "serviceLevel time")
        .sort({ serviceLevelId: 1 });

      return {
        status: 200,
        success: true,
        message: "Consular fees retrieved successfully",
        data: fees,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: (error as Error).message,
      };
    }
  }

  /**
   * Get fees for a specific service level within a country pair
   */
  async findByServiceLevel(
    countryPairId: string,
    serviceLevelId: string
  ): ServiceResponse {
    try {
      const fees = await this.model
        .find({ countryPairId, serviceLevelId })
        .populate("serviceTypeId", "serviceType shortHand")
        .populate("serviceLevelId", "serviceLevel time");

      return {
        status: 200,
        success: true,
        message: "Service level fees retrieved successfully",
        data: fees,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: (error as Error).message,
      };
    }
  }

  /**
   * Get fees grouped by service level for easier display
   */
  async findGroupedByServiceLevel(countryPairId: string): ServiceResponse {
    try {
      const fees = await this.model
        .find({ countryPairId })
        .populate("serviceTypeId", "serviceType shortHand")
        .populate("serviceLevelId", "serviceLevel time")
        .sort({ serviceLevelId: 1 });

      // Group fees by service level
      const groupedFees: Record<string, any[]> = {};
      fees.forEach((fee) => {
        const serviceLevelId = (fee.serviceLevelId as any)?._id?.toString() || fee.serviceLevelId?.toString();
        if (serviceLevelId) {
          if (!groupedFees[serviceLevelId]) {
            groupedFees[serviceLevelId] = [];
          }
          groupedFees[serviceLevelId].push(fee);
        }
      });

      return {
        status: 200,
        success: true,
        message: "Consular fees grouped successfully",
        data: groupedFees,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: (error as Error).message,
      };
    }
  }

  /**
   * Upsert (create or update) a consular fee
   */
  async upsert(data: {
    countryPairId: string;
    serviceLevelId: string;
    serviceTypeId: string;
    fee: number;
  }): ServiceResponse {
    try {
      // Validate fee amount
      if (data.fee < 0) {
        return {
          status: 400,
          success: false,
          message: "Fee amount cannot be negative",
        };
      }

      // Check if service type exists
      const serviceType = await this.serviceTypeModel.findById(
        data.serviceTypeId
      );
      if (!serviceType) {
        return {
          status: 404,
          success: false,
          message: "Service type not found",
        };
      }

      // Check if service level exists
      const serviceLevel = await this.serviceLevelModel.findById(
        data.serviceLevelId
      );
      if (!serviceLevel) {
        return {
          status: 404,
          success: false,
          message: "Service level not found",
        };
      }

      // Upsert the fee (create if doesn't exist, update if exists)
      const fee = await this.model.findOneAndUpdate(
        {
          countryPairId: data.countryPairId,
          serviceLevelId: data.serviceLevelId,
          serviceTypeId: data.serviceTypeId,
        },
        {
          fee: data.fee,
        },
        {
          new: true,
          upsert: true,
        }
      );

      const populatedFee = await this.model
        .findById(fee._id)
        .populate("serviceTypeId", "serviceType shortHand")
        .populate("serviceLevelId", "serviceLevel time");

      return {
        status: 200,
        success: true,
        message: "Consular fee saved successfully",
        data: populatedFee,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: (error as Error).message,
      };
    }
  }

  /**
   * Batch upsert multiple fees at once
   */
  async batchUpsert(
    countryPairId: string,
    serviceLevelId: string,
    fees: Array<{ serviceTypeId: string; fee: number }>
  ): ServiceResponse {
    try {
      const results = [];

      for (const feeData of fees) {
        const result = await this.upsert({
          countryPairId,
          serviceLevelId,
          serviceTypeId: feeData.serviceTypeId,
          fee: feeData.fee,
        });

        if (!result.success) {
          return result;
        }

        results.push(result.data);
      }

      return {
        status: 200,
        success: true,
        message: "All consular fees saved successfully",
        data: results,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: (error as Error).message,
      };
    }
  }

  /**
   * Delete a specific consular fee
   */
  async delete(
    countryPairId: string,
    serviceLevelId: string,
    serviceTypeId: string
  ): ServiceResponse {
    try {
      const fee = await this.model.findOneAndDelete({
        countryPairId,
        serviceLevelId,
        serviceTypeId,
      });

      if (!fee) {
        return {
          status: 404,
          success: false,
          message: "Consular fee not found",
        };
      }

      return {
        status: 200,
        success: true,
        message: "Consular fee deleted successfully",
        data: fee,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: (error as Error).message,
      };
    }
  }

  /**
   * Delete all fees for a specific service level
   */
  async deleteByServiceLevel(
    countryPairId: string,
    serviceLevelId: string
  ): ServiceResponse {
    try {
      const result = await this.model.deleteMany({
        countryPairId,
        serviceLevelId,
      });

      return {
        status: 200,
        success: true,
        message: `Deleted ${result.deletedCount} consular fees`,
        data: { deletedCount: result.deletedCount },
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: (error as Error).message,
      };
    }
  }

  /**
   * Find consular fee by country codes, service level ID, and service type ID
   * This is used by the frontend to look up consular fees without needing the countryPairId
   */
  async findByCountryCodes(
    fromCountryCode: string,
    toCountryCode: string,
    serviceLevelId: string,
    serviceTypeId: string
  ): ServiceResponse {
    try {
      // First, find the country pair by country codes
      const countryPair = await this.countryPairModel.findOne({
        fromCountryCode: fromCountryCode.toUpperCase(),
        toCountryCode: toCountryCode.toUpperCase(),
      });

      if (!countryPair) {
        return {
          status: 404,
          success: false,
          message: "Country pair not found",
        };
      }

      // Then find the consular fee for this country pair
      const fee = await this.model
        .findOne({
          countryPairId: countryPair._id,
          serviceLevelId,
          serviceTypeId,
        })
        .populate("serviceTypeId", "serviceType shortHand")
        .populate("serviceLevelId", "serviceLevel time");

      if (!fee) {
        return {
          status: 404,
          success: false,
          message: "Consular fee not found for this combination",
        };
      }

      return {
        status: 200,
        success: true,
        message: "Consular fee retrieved successfully",
        data: fee,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: (error as Error).message,
      };
    }
  }

  /**
   * Get all consular fees for a country pair by country codes
   * Returns all fees for the given country pair (useful for batch lookup)
   */
  async findAllByCountryCodes(
    fromCountryCode: string,
    toCountryCode: string
  ): ServiceResponse {
    try {
      // First, find the country pair by country codes
      const countryPair = await this.countryPairModel.findOne({
        fromCountryCode: fromCountryCode.toUpperCase(),
        toCountryCode: toCountryCode.toUpperCase(),
      });

      if (!countryPair) {
        return {
          status: 404,
          success: false,
          message: "Country pair not found",
        };
      }

      // Get all consular fees for this country pair
      const fees = await this.model
        .find({ countryPairId: countryPair._id })
        .populate("serviceTypeId", "serviceType shortHand")
        .populate("serviceLevelId", "serviceLevel time");

      return {
        status: 200,
        success: true,
        message: "Consular fees retrieved successfully",
        data: fees,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: (error as Error).message,
      };
    }
  }
}
