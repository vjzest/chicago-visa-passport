import { ServiceResponse } from "../../types/service-response.type";
import { CountryPairModel } from "../../models/country-pair.model";

export default class CountryPairService {
  private readonly model = CountryPairModel;

  /**
   * Get all country pairs
   */
  async findAll(): ServiceResponse {
    try {
      const countryPairs = await this.model
        .find()
        .sort({ fromCountryName: 1, toCountryName: 1 });

      return {
        status: 200,
        success: true,
        message: "Country pairs retrieved successfully",
        data: countryPairs,
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
   * Get a single country pair by ID
   */
  async findOne(id: string): ServiceResponse {
    try {
      const countryPair = await this.model.findById(id);

      if (!countryPair) {
        return {
          status: 404,
          success: false,
          message: "Country pair not found",
        };
      }

      return {
        status: 200,
        success: true,
        message: "Country pair retrieved successfully",
        data: countryPair,
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
   * Create a new country pair
   */
  async create(data: {
    fromCountryCode: string;
    fromCountryName: string;
    toCountryCode: string;
    toCountryName: string;
    isJurisdictional: boolean;
  }): ServiceResponse {
    try {
      // Check if pair already exists
      const existingPair = await this.model.findOne({
        fromCountryCode: data.fromCountryCode.toUpperCase(),
        toCountryCode: data.toCountryCode.toUpperCase(),
      });

      if (existingPair) {
        return {
          status: 400,
          success: false,
          message: "This country pair already exists",
        };
      }

      const countryPair = await this.model.create({
        fromCountryCode: data.fromCountryCode.toUpperCase(),
        fromCountryName: data.fromCountryName,
        toCountryCode: data.toCountryCode.toUpperCase(),
        toCountryName: data.toCountryName,
        isJurisdictional: data.isJurisdictional,
      });

      return {
        status: 201,
        success: true,
        message: "Country pair created successfully",
        data: countryPair,
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
   * Update a country pair
   */
  async update(
    id: string,
    data: {
      isJurisdictional?: boolean;
      isActive?: boolean;
    }
  ): ServiceResponse {
    try {
      const countryPair = await this.model.findById(id);

      if (!countryPair) {
        return {
          status: 404,
          success: false,
          message: "Country pair not found",
        };
      }

      if (data.isJurisdictional !== undefined) {
        countryPair.isJurisdictional = data.isJurisdictional;
      }

      if (data.isActive !== undefined) {
        countryPair.isActive = data.isActive;
      }

      await countryPair.save();

      return {
        status: 200,
        success: true,
        message: "Country pair updated successfully",
        data: countryPair,
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
   * Toggle active status of a country pair
   */
  async toggleActive(id: string): ServiceResponse {
    try {
      const countryPair = await this.model.findById(id);

      if (!countryPair) {
        return {
          status: 404,
          success: false,
          message: "Country pair not found",
        };
      }

      countryPair.isActive = !countryPair.isActive;
      await countryPair.save();

      return {
        status: 200,
        success: true,
        message: `Country pair ${countryPair.isActive ? 'activated' : 'deactivated'} successfully`,
        data: countryPair,
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
   * Get enabled "from" countries (countries that have at least one active pair)
   */
  async getEnabledFromCountries(): ServiceResponse {
    try {
      const fromCountries = await this.model.aggregate([
        {
          $match: { isActive: true },
        },
        {
          $group: {
            _id: "$fromCountryCode",
            countryName: { $first: "$fromCountryName" },
            countryCode: { $first: "$fromCountryCode" },
          },
        },
        {
          $sort: { countryName: 1 },
        },
      ]);

      return {
        status: 200,
        success: true,
        message: "Enabled 'From' countries retrieved successfully",
        data: fromCountries,
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
   * Get enabled "to" countries for a specific "from" country (only active pairs)
   */
  async getEnabledToCountries(fromCountryCode?: string): ServiceResponse {
    try {
      const query: { isActive: boolean; fromCountryCode?: string } = {
        isActive: true,
      };

      if (fromCountryCode) {
        query.fromCountryCode = fromCountryCode.toUpperCase();
      }

      const toCountries = await this.model
        .find(query)
        .select("toCountryCode toCountryName isJurisdictional")
        .sort({ toCountryName: 1 });

      return {
        status: 200,
        success: true,
        message: "Enabled 'To' countries retrieved successfully",
        data: toCountries,
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
