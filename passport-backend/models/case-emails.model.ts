import mongoose from "mongoose";

const caseEmailsSchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "cases",
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    recipientEmail: {
      type: String,
      required: true,
    },
    trackingId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const CaseEmailsModel = mongoose.model("caseemails", caseEmailsSchema);
