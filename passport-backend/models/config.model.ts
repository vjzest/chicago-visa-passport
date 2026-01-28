import mongoose, { Document, Schema } from "mongoose";

export interface FedexConfig {
  title: string;
  price: number;
  isActive: boolean;
  isDeleted: boolean;
}

export interface TermsAndConditionsConfig {
  content: string;
  verbiage: string;
}

export interface Config extends Document {
  fedex: FedexConfig[];
  tnc: TermsAndConditionsConfig;
  privacyPolicy: string;
  refundPolicy: string;
  onlineProcessingFee: string;
  chargeOnlineProcessingFee: boolean;
  govFee: number;
  pptFormAvailable: boolean;
  paymentDisclaimer: string;
  loadBalancer: [{ processor: string | Schema.Types.ObjectId; weight: number }];
  ipLockEnabled: boolean;
  departureDateFieldEnabled: boolean;
}

const FedexSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const TermsAndConditionsSchema: Schema = new Schema({
  content: { type: String, required: true },
  verbiage: { type: String, required: true },
});

const ConfigSchema: Schema = new Schema({
  fedex: { type: [FedexSchema], required: false },
  tnc: { type: TermsAndConditionsSchema },
  privacyPolicy: { type: String },
  refundPolicy: { type: String },
  onlineProcessingFee: { type: String, required: false },
  chargeOnlineProcessingFee: { type: Boolean, required: false },
  paymentDisclaimer: { type: String, required: false },
  govFee: { type: Number, required: false },
  pptFormAvailable: {
    type: Boolean,
    default: true,
  },
  loadBalancer: {
    type: [
      {
        processor: {
          type: Schema.Types.ObjectId,
          ref: "processor",
          required: true,
        },
        weight: { type: Number, required: true },
      },
    ],
    required: false,
    default: [],
  },
  ipLockEnabled: {
    type: Boolean,
    default: false,
  },
  departureDateFieldEnabled: {
    type: Boolean,
    default: false,
  },
});

export const ConfigModel = mongoose.model<Config>("Config", ConfigSchema);
