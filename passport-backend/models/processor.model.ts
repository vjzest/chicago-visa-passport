import mongoose, { Document, Schema } from "mongoose";

export interface IProcessorId extends Document {
  _id: string;
  processorName: string;
  userName: string;
  password: string;
  isActive: boolean;
  isDefault: boolean;
  transactionLimit: number;
}

const ProcessorIdSchema: Schema = new Schema(
  {
    processorName: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    transactionLimit: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ProcessorsModel = mongoose.model<IProcessorId>(
  "processor",
  ProcessorIdSchema
);
