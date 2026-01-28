import mongoose, { Schema, Model, Document } from "mongoose";

export interface ICountryPair extends Document {
  fromCountryCode: string;
  fromCountryName: string;
  toCountryCode: string;
  toCountryName: string;
  isJurisdictional: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CountryPairSchema: Schema = new Schema(
  {
    fromCountryCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    fromCountryName: {
      type: String,
      required: true,
    },
    toCountryCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    toCountryName: {
      type: String,
      required: true,
    },
    isJurisdictional: {
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

// Compound index to ensure unique country pairs
CountryPairSchema.index(
  { fromCountryCode: 1, toCountryCode: 1 },
  { unique: true }
);

export const CountryPairModel: Model<ICountryPair> =
  mongoose.model<ICountryPair>("countrypair", CountryPairSchema);
