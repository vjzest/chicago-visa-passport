import mongoose, { Schema, Document } from "mongoose";

export interface IAddon {
  _id: mongoose.Types.ObjectId;
  subTitle: string;
  price: number;
}

export interface IAdditionalService extends Document {
  title: string;
  description: string;
  description2: string;
  price: number;
  serviceTypes: any;
  addons: IAddon[];
  isActive: boolean;
  isDeleted: boolean;
}

const AddonSchema = new Schema<IAddon>({
  subTitle: { type: String },
  price: { type: Number, min: 0 },
});

const AdditionalServiceSchema = new Schema<IAdditionalService>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    description2: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    serviceTypes: [
      { type: Schema.Types.ObjectId, ref: "servicetypes", required: true },
    ],
    addons: [AddonSchema],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AdditionalServicesModel = mongoose.model<IAdditionalService>(
  "additionalservices",
  AdditionalServiceSchema
);
