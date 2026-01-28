import mongoose, { Schema } from "mongoose";

const caseManagerLoadsSchema = new Schema({
  caseManager: {
    type: Schema.Types.ObjectId,
    ref: "admins",
    required: true,
  },
  caseCount: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export const CaseManagerLoadsModel = mongoose.model(
  "casemanagerloads",
  caseManagerLoadsSchema
);
