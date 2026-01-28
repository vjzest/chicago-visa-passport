import mongoose from "mongoose";

const passportServiceLevelSchema = new mongoose.Schema(
  {
    serviceLevel: { type: String, required: true },
    time: { type: String, required: true },
    speedInWeeks: { type: Number, required: true, min: 1 },
    sortOrder: { type: Number, default: 0 },
    price: { type: String, required: true },
    nonRefundableFee: { type: Number, required: true, min: 1 },
    inboundFee: { type: Number, required: true, min: 0 },
    outboundFee: { type: Number, required: true, min: 0 },
    paymentGateway: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "processor",
    },
    authOnlyFrontend: { type: String, required: true },
    amex: { type: Boolean, required: true },
    doubleCharge: { type: String, required: true },
    loa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "loa",
      required: false,
    },
    serviceTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "servicetypes",
        required: true,
      },
    ],
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const ServiceLevelsModel = mongoose.model(
  "servicelevels",
  passportServiceLevelSchema
);
