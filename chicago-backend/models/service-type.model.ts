import mongoose, { Schema, Model, Document, ObjectId } from "mongoose";

type RequiredDocument = {
  _id: string;
  title: string;
  instruction: string;
  sampleImage: string;
  attachment: string;
  isRequired: boolean;
  silentKey: string;
};
export interface IServiceType extends Document {
  serviceType: string;
  shippingAddress: ObjectId;
  description: string;
  shortHand: string;
  isActive: boolean;
  isArchived: boolean;
  processingTime: string;
  silentKey: string;
  sortOrder: number;
  requiredDocuments: RequiredDocument[];
  requiredDocuments2?: RequiredDocument[];
  // Country pair reference - single source of truth for country configuration
  countryPair: ObjectId;
  isEvisa: boolean;
}

const requiredDocumentSchema: Schema = new Schema({
  title: { type: String, required: false },
  instruction: { type: String, required: false },
  sampleImage: { type: String, required: false },
  attachment: { type: String, required: false },
  isRequired: { type: Boolean, default: true },
  silentKey: { type: String },
});

const ServiceTypeSchema: Schema = new Schema(
  {
    serviceType: { type: String, required: true },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "shippings",
      required: false,
    },
    sortOrder: {
      type: Number,
      min: 1,
    },
    description: { type: String, required: true },
    shortHand: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    processingTime: { type: String, required: false },
    silentKey: {
      type: String,
    },
    requiredDocuments: {
      type: [requiredDocumentSchema],
      required: true,
    },
    requiredDocuments2: {
      type: [requiredDocumentSchema],
      required: false,
    },
    // Country pair reference - single source of truth for country configuration
    countryPair: {
      type: Schema.Types.ObjectId,
      ref: "countrypair",
      required: true,
    },
    isEvisa: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ServiceTypesModel: Model<IServiceType> =
  mongoose.model<IServiceType>("servicetypes", ServiceTypeSchema);

