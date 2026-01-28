import mongoose, { Schema, Model, Document } from "mongoose";

export interface ICountryAccess extends Document {
  countryCode: string;
  countryName: string;
  isEnabledFrom: boolean; // Can select as "From Country"
  isEnabledTo: boolean; // Can select as "To Country"
  createdAt: Date;
  updatedAt: Date;
}

const CountryAccessSchema: Schema = new Schema(
  {
    countryCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    countryName: {
      type: String,
      required: true,
    },
    isEnabledFrom: {
      type: Boolean,
      default: true,
    },
    isEnabledTo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CountryAccessModel: Model<ICountryAccess> =
  mongoose.model<ICountryAccess>("countryaccess", CountryAccessSchema);
