import mongoose, { Document, Schema } from "mongoose";

export interface ICaseFile extends Document {
  case: string;
  title: string;
  description: string;
  url: string;
  fileType: string;
  createdAt: Date;
}

const FileSchema: Schema = new Schema(
  {
    case: { type: Schema.Types.ObjectId, ref: "cases", required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: false, default: "" },
    fileType: { type: String, required: true },
  },
  { timestamps: true }
);

export const CaseFilesModel = mongoose.model<ICaseFile>(
  "casefiles",
  FileSchema
);
