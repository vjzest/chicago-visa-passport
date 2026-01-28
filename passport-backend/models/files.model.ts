import mongoose, { Document, Schema } from "mongoose";

export interface IFile extends Document {
  title: string;
  url: string;
  fileType: string;
  createdAt: Date;
}

const FileSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    fileType: { type: String, required: true },
  },
  { timestamps: true }
);

export const FilesModel = mongoose.model<IFile>("File", FileSchema);
