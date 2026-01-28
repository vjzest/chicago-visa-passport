import mongoose, { Schema } from "mongoose";
import { IStatus } from "../typings";

const statusSchema = new Schema<IStatus>(
  {
    title: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    description: String,
    sortOrder: Number,
    level: { type: Number, enum: [1, 2, 3], required: true },
    parent: { type: Schema.Types.ObjectId, ref: "statuses" },
    disableCase: {
      type: Boolean,
      default: false,
    },
    sendAutoEmail: {
      type: Boolean,
      default: false,
    },
    autoEmailMessage: {
      type: String,
      default: "",
      trim: true,
    },
    isStatic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const StatusesModel = mongoose.model<IStatus>("statuses", statusSchema);

export { StatusesModel, IStatus };
