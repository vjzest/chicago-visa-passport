import { ServiceResponse } from "../../types/service-response.type";
import { CountryAccessModel } from "../../models/country-access.model";
import { countries } from "../../data/countries";

export default class CountryAccessService {
  private readonly model = CountryAccessModel;

  /**
   * Initialize country access records for all countries
   * This will create records for countries that don't exist yet
   */
  async initializeCountries(): ServiceResponse {
    try {
      const existingCountries = await this.model.find().lean();
      const existingCodes = new Set(
        existingCountries.map((c) => c.countryCode)
      );

      const newCountries = countries
        .filter((country) => !existingCodes.has(country.code))
        .map((country) => ({
          countryCode: country.code,
          countryName: country.name,
          isEnabledFrom: true,
          isEnabledTo: true,
        }));

      if (newCountries.length > 0) {
        await this.model.insertMany(newCountries);
      }

      return {
        status: 200,
        success: true,
        message: `Initialized ${newCountries.length} new countries`,
        data: { initialized: newCountries.length },
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
   * Get all country access settings
   */
  async findAll(): ServiceResponse {
    try {
      // Ensure all countries are initialized
      await this.initializeCountries();

      const countryAccess = await this.model.find().sort({ countryName: 1 });

      return {
        status: 200,
        success: true,
        message: "Country access settings retrieved successfully",
        data: countryAccess,
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
   * Get enabled countries for "From" selection
   */
  async getEnabledFromCountries(): ServiceResponse {
    try {
      await this.initializeCountries();

      const countries = await this.model
        .find({ isEnabledFrom: true })
        .sort({ countryName: 1 })
        .lean();

      return {
        status: 200,
        success: true,
        message: "Enabled 'From' countries retrieved successfully",
        data: countries,
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
   * Get enabled countries for "To" selection
   */
  async getEnabledToCountries(): ServiceResponse {
    try {
      await this.initializeCountries();

      const countries = await this.model
        .find({ isEnabledTo: true })
        .sort({ countryName: 1 })
        .lean();

      return {
        status: 200,
        success: true,
        message: "Enabled 'To' countries retrieved successfully",
        data: countries,
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
   * Update country access settings
   */
  async update(
    countryCode: string,
    data: {
      isEnabledFrom?: boolean;
      isEnabledTo?: boolean;
    }
  ): ServiceResponse {
    try {
      const country = await this.model.findOne({ countryCode });

      if (!country) {
        return {
          status: 404,
          success: false,
          message: "Country not found",
        };
      }

      if (data.isEnabledFrom !== undefined) {
        country.isEnabledFrom = data.isEnabledFrom;
      }

      if (data.isEnabledTo !== undefined) {
        country.isEnabledTo = data.isEnabledTo;
      }

      await country.save();

      return {
        status: 200,
        success: true,
        message: "Country access settings updated successfully",
        data: country,
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
   * Bulk update country access settings
   */
  async bulkUpdate(
    updates: Array<{
      countryCode: string;
      isEnabledFrom?: boolean;
      isEnabledTo?: boolean;
    }>
  ): ServiceResponse {
    try {
      const bulkOps = updates.map((update) => ({
        updateOne: {
          filter: { countryCode: update.countryCode },
          update: {
            $set: {
              ...(update.isEnabledFrom !== undefined && {
                isEnabledFrom: update.isEnabledFrom,
              }),
              ...(update.isEnabledTo !== undefined && {
                isEnabledTo: update.isEnabledTo,
              }),
            },
          },
        },
      }));

      const result = await this.model.bulkWrite(bulkOps);

      return {
        status: 200,
        success: true,
        message: "Country access settings updated successfully",
        data: {
          modified: result.modifiedCount,
          matched: result.matchedCount,
        },
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
