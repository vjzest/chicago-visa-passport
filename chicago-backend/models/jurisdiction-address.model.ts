import mongoose, { Schema, Model, Document, ObjectId } from "mongoose";

export interface IJurisdictionAddress extends Document {
  countryPairId: ObjectId;
  jurisdictionId: string; // Consulate ID from visa-jurisdictions.ts
  locationName: string;
  company: string;
  authorisedPerson: string;
  address: string;
  address2?: string;
  city: string;
  state: string; // 2-letter state code
  zipCode: string;
  instruction?: string;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JurisdictionAddressSchema: Schema = new Schema(
  {
    countryPairId: {
      type: Schema.Types.ObjectId,
      ref: "countrypair",
      required: true,
      index: true,
    },
    jurisdictionId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    locationName: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    authorisedPerson: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    address2: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      uppercase: true,
      validate: {
        validator: function (value: string) {
          return value.length === 2;
        },
        message: "State must be a 2-letter code",
      },
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value: string) {
          return /^\d{5}(-\d{4})?$/.test(value);
        },
        message: "Invalid zip code format",
      },
    },
    instruction: {
      type: String,
      trim: true,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying by country pair and jurisdiction
JurisdictionAddressSchema.index({ countryPairId: 1, jurisdictionId: 1 });

// Index for filtering active/deleted addresses
JurisdictionAddressSchema.index({ isDeleted: 1, isActive: 1 });

export const JurisdictionAddressModel: Model<IJurisdictionAddress> =
  mongoose.model<IJurisdictionAddress>(
    "jurisdictionaddress",
    JurisdictionAddressSchema
  );
