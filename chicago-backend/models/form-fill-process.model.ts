import mongoose from "mongoose";

const formFillProcessSchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cases",
      required: true,
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "passportforms",
      required: true,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "failed", "success"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const FormFillProcessesModel = mongoose.model(
  "formfillprocesses",
  formFillProcessSchema
);
