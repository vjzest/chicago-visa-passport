import mongoose, { Schema, Model, Document, ObjectId } from "mongoose";

export interface IConsularFee extends Document {
  countryPairId: ObjectId;
  serviceLevelId: ObjectId; // Reference to service level (e.g., "Express", "Standard", "Rush")
  serviceTypeId: ObjectId;
  fee: number; // Fee amount in USD
  createdAt: Date;
  updatedAt: Date;
}

const ConsularFeeSchema: Schema = new Schema(
  {
    countryPairId: {
      type: Schema.Types.ObjectId,
      ref: "countrypair",
      required: true,
    },
    serviceLevelId: {
      type: Schema.Types.ObjectId,
      ref: "servicelevels",
      required: true,
    },
    serviceTypeId: {
      type: Schema.Types.ObjectId,
      ref: "servicetypes",
      required: true,
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique fee per country pair + service level + service type
ConsularFeeSchema.index(
  { countryPairId: 1, serviceLevelId: 1, serviceTypeId: 1 },
  { unique: true }
);

export const ConsularFeeModel: Model<IConsularFee> =
  mongoose.model<IConsularFee>("consularfee", ConsularFeeSchema);


