import mongoose, { Schema, Model, Document, ObjectId } from "mongoose";

/**
 * Jurisdiction Model
 *
 * This model stores jurisdiction (consulate/embassy) data for specific country pairs
 * that require visa applications to be processed at specific consulates
 * based on the applicant's state of residence.
 */

export interface ICountyMapping {
  [state: string]: string[];
}

export interface StateEntry {
  state: string;
  region: string | null;
}

// Backwards compatibility: Allow both old (string) and new (object) formats during transition
export type StateEntryCompat = StateEntry | string;

export interface IJurisdiction extends Document {
  countryPairId: ObjectId; // Reference to the country pair (e.g., US → CN)
  consulateId: string; // Unique identifier for the consulate (e.g., "china-washington-dc")
  name: string; // Full name (e.g., "Embassy of China - Washington, D.C.")
  location: string; // City/location (e.g., "Washington, D.C.")
  states: StateEntryCompat[]; // Array of state entries (supports old and new formats)
  counties?: ICountyMapping; // Optional county-level mappings
  notes?: string; // Additional notes for this consulate
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JurisdictionSchema: Schema = new Schema(
  {
    countryPairId: {
      type: Schema.Types.ObjectId,
      ref: "countrypair",
      required: true,
      index: true,
    },
    consulateId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    states: {
      type: [Schema.Types.Mixed],
      required: true,
      validate: {
        validator: function (value: StateEntry[]) {
          return value.length > 0;
        },
        message: "At least one state must be assigned to the jurisdiction",
      },
    },
    counties: {
      type: Schema.Types.Mixed,
      default: {},
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying by country pair and consulate
JurisdictionSchema.index({ countryPairId: 1, consulateId: 1 });

// Compound index for filtering active jurisdictions by country pair
JurisdictionSchema.index({ countryPairId: 1, isDeleted: 1, isActive: 1 });

export const JurisdictionModel: Model<IJurisdiction> =
  mongoose.model<IJurisdiction>("jurisdiction", JurisdictionSchema);
