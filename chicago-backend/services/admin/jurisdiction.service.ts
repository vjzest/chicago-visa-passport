import { JurisdictionModel, ICountyMapping, StateEntry, StateEntryCompat } from "../../models/jurisdiction.model";
import { ServiceResponse } from "../../types/service-response.type";

type IJurisdictionData = {
  countryPairId: string;
  consulateId: string;
  name: string;
  location: string;
  states: StateEntryCompat[];
  counties?: ICountyMapping;
  notes?: string;
};

export default class JurisdictionService {
  private readonly model = JurisdictionModel;

  /**
   * Helper function to normalize state entry to a comparable string
   * Supports both old format (string) and new format (object) for backwards compatibility
   */
  private normalizeStateEntry(entry: StateEntry | string): string {
    // Handle old format (string)
    if (typeof entry === "string") {
      return entry;
    }

    // Handle new format (object)
    if (entry && typeof entry === "object" && entry.state) {
      if (entry.region) {
        return `${entry.state}|${entry.region}`;
      }
      return entry.state;
    }

    // Fallback for unexpected data
    console.warn("Invalid state entry:", entry);
    return "";
  }

  /**
   * Check if any state+region combinations conflict with existing jurisdictions
   */
  private async checkStateConflicts(
    countryPairId: string,
    states: StateEntryCompat[],
    excludeJurisdictionId?: string
  ): Promise<{ hasConflict: boolean; conflicts: string[] }> {
    const conflicts: string[] = [];

    // Get all existing jurisdictions for this country pair
    const query: any = { countryPairId, isDeleted: false };
    if (excludeJurisdictionId) {
      query._id = { $ne: excludeJurisdictionId };
    }

    const existingJurisdictions = await this.model.find(query);

    // Build a set of all assigned state+region combinations
    const assignedStates = new Set<string>();
    existingJurisdictions.forEach((jurisdiction) => {
      jurisdiction.states.forEach((state) => {
        assignedStates.add(this.normalizeStateEntry(state));
      });
    });

    // Check for conflicts
    states.forEach((state) => {
      const normalized = this.normalizeStateEntry(state);

      // Skip if normalization failed
      if (!normalized) return;

      // Handle old format (string) - backwards compatibility
      if (typeof state === "string") {
        if (assignedStates.has(normalized)) {
          conflicts.push(state);
        }
        // Check if any region of this state is already assigned
        for (const assigned of assignedStates) {
          if (assigned && assigned.startsWith(`${state}|`)) {
            conflicts.push(`${state} (regions already assigned)`);
            break;
          }
        }
      }
      // Handle new format (object)
      else if (state && typeof state === "object" && state.state) {
        // If it's a state without a region
        if (!state.region) {
          // Check if the exact state is already assigned
          if (assignedStates.has(normalized)) {
            conflicts.push(state.state);
          }
          // Also check if any region of this state is already assigned
          for (const assigned of assignedStates) {
            if (assigned && assigned.startsWith(`${state.state}|`)) {
              conflicts.push(`${state.state} (regions already assigned)`);
              break;
            }
          }
        } else {
          // If it's a state+region, check if it's already assigned
          if (assignedStates.has(normalized)) {
            conflicts.push(`${state.state} - ${state.region}`);
          }
          // Also check if the entire state (without region) is already assigned
          if (assignedStates.has(state.state)) {
            conflicts.push(`${state.state} - ${state.region} (entire state already assigned)`);
          }
        }
      }
    });

    return {
      hasConflict: conflicts.length > 0,
      conflicts: Array.from(new Set(conflicts)), // Remove duplicates
    };
  }

  async create(data: IJurisdictionData): Promise<ServiceResponse> {
    try {
      // Check if consulate ID already exists for this country pair
      const existing = await this.model.findOne({
        countryPairId: data.countryPairId,
        consulateId: data.consulateId,
        isDeleted: false,
      });

      if (existing) {
        return {
          status: 400,
          message: `Consulate with ID '${data.consulateId}' already exists for this country pair`,
          success: false,
        };
      }

      // Check for state conflicts
      const stateCheck = await this.checkStateConflicts(
        data.countryPairId,
        data.states
      );

      if (stateCheck.hasConflict) {
        return {
          status: 400,
          message: `State conflict detected: ${stateCheck.conflicts.join(", ")} already assigned to another jurisdiction`,
          success: false,
        };
      }

      const response = await this.model.create(data);
      return {
        status: 201,
        message: "Jurisdiction created successfully",
        data: response,
        success: true,
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async findByCountryPair(
    countryPairId: string,
    options?: {
      onlyActive?: boolean;
    }
  ): Promise<ServiceResponse> {
    try {
      const query: any = { countryPairId, isDeleted: false };

      if (options?.onlyActive) {
        query.isActive = true;
      }

      const jurisdictions = await this.model
        .find(query)
        .populate("countryPairId")
        .sort({ location: 1 });

      return {
        status: 200,
        success: true,
        data: jurisdictions,
        message: "Jurisdictions retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding jurisdictions:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<ServiceResponse> {
    try {
      const jurisdiction = await this.model.findById(id);
      if (!jurisdiction) {
        return {
          status: 404,
          success: false,
          message: "Jurisdiction not found",
        };
      }
      return {
        status: 200,
        success: true,
        data: jurisdiction,
        message: "Jurisdiction retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding jurisdiction:", error);
      throw error;
    }
  }


  async findByIdAndUpdate(
    id: string,
    data: IJurisdictionData
  ): Promise<ServiceResponse> {
    try {
      const exist = await this.model.findById(id);

      if (!exist) {
        return {
          status: 404,
          message: "Jurisdiction not found",
          success: false,
        };
      }

      // Check if updating consulate ID would create a duplicate within the same country pair
      if (data.consulateId !== exist.consulateId || data.countryPairId !== exist.countryPairId.toString()) {
        const duplicate = await this.model.findOne({
          countryPairId: data.countryPairId,
          consulateId: data.consulateId,
          isDeleted: false,
          _id: { $ne: id },
        });

        if (duplicate) {
          return {
            status: 400,
            message: `Consulate with ID '${data.consulateId}' already exists for this country pair`,
            success: false,
          };
        }
      }

      // Check for state conflicts (excluding current jurisdiction)
      const stateCheck = await this.checkStateConflicts(
        data.countryPairId,
        data.states,
        id
      );

      if (stateCheck.hasConflict) {
        return {
          status: 400,
          message: `State conflict detected: ${stateCheck.conflicts.join(", ")} already assigned to another jurisdiction`,
          success: false,
        };
      }

      const updated = await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });

      return {
        status: 200,
        message: "Jurisdiction updated successfully",
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
          message: "Jurisdiction not found in database",
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
          ? "Jurisdiction restored"
          : "Jurisdiction soft deleted",
      };
    } catch (error) {
      console.error("Error deleting/restoring jurisdiction:", error);
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
          message: "Jurisdiction not found in database",
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
          ? "Jurisdiction deactivated"
          : "Jurisdiction activated",
      };
    } catch (error) {
      console.error("Error toggling jurisdiction status:", error);
      throw error;
    }
  }

  /**
   * Bulk create jurisdictions from JSON data
   * Useful for initial data migration or bulk imports
   */
  async bulkCreate(
    countryPairId: string,
    jurisdictions: Omit<IJurisdictionData, "countryPairId">[]
  ): Promise<ServiceResponse> {
    try {
      const created = [];
      const errors = [];

      for (const jurisdictionData of jurisdictions) {
        try {
          // Check if consulate ID already exists for this country pair
          const existing = await this.model.findOne({
            countryPairId,
            consulateId: jurisdictionData.consulateId,
            isDeleted: false,
          });

          if (existing) {
            errors.push({
              consulateId: jurisdictionData.consulateId,
              error: "Consulate ID already exists for this country pair",
            });
            continue;
          }

          const response = await this.model.create({
            ...jurisdictionData,
            countryPairId,
          });
          created.push(response);
        } catch (error) {
          errors.push({
            consulateId: jurisdictionData.consulateId,
            error: (error as Error).message,
          });
        }
      }

      return {
        status: created.length > 0 ? 201 : 400,
        message: `Created ${created.length} jurisdictions. ${errors.length} errors.`,
        data: {
          created,
          errors,
        },
        success: created.length > 0,
      };
    } catch (error) {
      console.error("Error in bulk create:", error);
      throw error;
    }
  }
}
