import { JurisdictionAddressModel } from "../../models/jurisdiction-address.model";
import { CountryPairModel } from "../../models/country-pair.model";
import { JurisdictionModel } from "../../models/jurisdiction.model";
import { ServiceResponse } from "../../types/service-response.type";
import { US_STATES } from "../../data/countries";

type IJurisdictionAddressData = {
  countryPairId: string;
  jurisdictionId: string;
  locationName: string;
  company: string;
  authorisedPerson: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  instruction?: string;
};

export default class JurisdictionAddressService {
  private readonly model = JurisdictionAddressModel;

  async create(data: IJurisdictionAddressData): Promise<ServiceResponse> {
    try {
      const existing = await this.model.findOne({
        countryPairId: data.countryPairId,
        jurisdictionId: data.jurisdictionId,
        isDeleted: false,
      });

      if (existing) {
        return {
          status: 400,
          message: "Address already exists for this jurisdiction",
          success: false,
        };
      }

      const response = await this.model.create(data);
      return {
        status: 201,
        message: "Jurisdiction address created successfully",
        data: response,
        success: true,
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async findById(id: string): Promise<ServiceResponse> {
    try {
      const address = await this.model.findById(id);
      if (!address) {
        return {
          status: 404,
          success: false,
          message: "Jurisdiction address not found",
        };
      }
      return {
        status: 200,
        success: true,
        data: address,
        message: "Jurisdiction address retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding jurisdiction address:", error);
      throw error;
    }
  }

  async findByCountryPair(
    countryPairId: string,
    options?: {
      onlyActive?: boolean;
      jurisdictionId?: string;
    }
  ): Promise<ServiceResponse> {
    try {
      const query: any = { countryPairId, isDeleted: false };

      if (options?.onlyActive) {
        query.isActive = true;
      }

      if (options?.jurisdictionId) {
        query.jurisdictionId = options.jurisdictionId;
      }

      const addresses = await this.model
        .find(query)
        .populate("countryPairId")
        .sort({ createdAt: -1 });

      return {
        status: 200,
        success: true,
        data: addresses,
        message: "Jurisdiction addresses retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding jurisdiction addresses:", error);
      throw error;
    }
  }

  async findByIdAndUpdate(
    id: string,
    data: IJurisdictionAddressData
  ): Promise<ServiceResponse> {
    try {
      const exist = await this.model.findById(id);

      if (!exist) {
        return {
          status: 404,
          message: "Jurisdiction address not found",
          success: false,
        };
      }

      const updated = await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });

      return {
        status: 200,
        message: "Jurisdiction address updated successfully",
        data: updated,
        success: true,
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async findByIdAndDelete(id: string): Promise<ServiceResponse> {
    try {
      const exist = await this.model.findById(id);

      if (!exist) {
        return {
          status: 404,
          success: false,
          message: "Jurisdiction address not found in database",
        };
      }

      await this.model.findByIdAndUpdate(
        id,
        { isDeleted: !exist.isDeleted },
        { new: true }
      );

      return {
        status: 200,
        success: true,
        message: exist.isDeleted
          ? "Jurisdiction address restored"
          : "Jurisdiction address soft deleted",
      };
    } catch (error) {
      console.error("Error deleting/restoring jurisdiction address:", error);
      throw error;
    }
  }

  async findByIdAndToggleActive(id: string): Promise<ServiceResponse> {
    try {
      const exist = await this.model.findById(id);

      if (!exist) {
        return {
          status: 404,
          success: false,
          message: "Jurisdiction address not found in database",
        };
      }

      await this.model.findByIdAndUpdate(
        id,
        { isActive: !exist.isActive },
        { new: true }
      );

      return {
        status: 200,
        success: true,
        message: exist.isActive
          ? "Jurisdiction address deactivated"
          : "Jurisdiction address activated",
      };
    } catch (error) {
      console.error("Error toggling jurisdiction address status:", error);
      throw error;
    }
  }

  async findByCountryCodes(
    fromCountryCode: string,
    toCountryCode: string,
    stateCode?: string
  ): Promise<ServiceResponse> {
    try {
      // Find the country pair by country codes
      const countryPair = await CountryPairModel.findOne({
        fromCountryCode: fromCountryCode.toUpperCase(),
        toCountryCode: toCountryCode.toUpperCase(),
        isActive: true,
      });

      if (!countryPair) {
        return {
          status: 404,
          success: false,
          message: "Country pair not found",
          data: [],
        };
      }

      // If stateCode is provided, find the matching jurisdiction(s) for that state
      let jurisdictionIds: string[] = [];

      if (stateCode) {
        // Convert state code to state name
        const stateInfo = US_STATES.find(
          (s) => s.code.toUpperCase() === stateCode.toUpperCase()
        );
        const stateName = stateInfo?.name;

        if (stateName) {
          // Find jurisdictions that cover this state
          const jurisdictions = await JurisdictionModel.find({
            countryPairId: countryPair._id,
            isDeleted: false,
            isActive: true,
          });

          // Filter jurisdictions that include this state
          // states array can contain objects like { state: "New York", region: null } or strings
          jurisdictionIds = jurisdictions
            .filter((j) =>
              j.states.some((s: any) => {
                const stateValue = typeof s === "string" ? s : s.state;
                return stateValue?.toLowerCase() === stateName.toLowerCase();
              })
            )
            .map((j) => j.consulateId);
        }
      }

      // Build the query for addresses
      const addressQuery: any = {
        countryPairId: countryPair._id,
        isDeleted: false,
        isActive: true,
      };

      // If we found matching jurisdictions, filter by them
      if (stateCode && jurisdictionIds.length > 0) {
        addressQuery.jurisdictionId = { $in: jurisdictionIds };
      } else if (stateCode && jurisdictionIds.length === 0) {
        // State was provided but no matching jurisdiction found
        return {
          status: 200,
          success: true,
          data: [],
          message: "No jurisdiction found for the specified state",
        };
      }

      // Find active jurisdiction addresses
      const addresses = await this.model
        .find(addressQuery)
        .sort({ createdAt: -1 });

      return {
        status: 200,
        success: true,
        data: addresses,
        message: "Jurisdiction addresses retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding jurisdiction addresses by country codes:", error);
      throw error;
    }
  }
}
