import mongoose, { Schema } from "mongoose";

// Define a new model for tracking processor usage
const processorUsageSchema = new Schema({
  processor: {
    type: Schema.Types.ObjectId,
    ref: "processor",
    required: true,
  },
  transactionCount: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Create model (or use existing one if you already have it)
export const ProcessorUsageModel = mongoose.model(
  "ProcessorUsage",
  processorUsageSchema
);
