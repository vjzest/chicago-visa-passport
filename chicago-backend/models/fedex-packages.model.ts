import mongoose from "mongoose";

export interface IFedexPackage {
  trackingNumber: string;
  case: mongoose.Types.ObjectId;
  deliveryDate?: Date;
  expectedDate: Date;
  isActive: boolean;
  isDelivered: boolean;
  labelUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const fedexPackagesSchema = new mongoose.Schema<IFedexPackage>(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cases",
      required: true,
    },
    expectedDate: {
      type: Date,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: false,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    labelUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FedexPackagesModel = mongoose.model(
  "fedexpackages",
  fedexPackagesSchema
);
