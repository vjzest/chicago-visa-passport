import mongoose, { Schema } from "mongoose";

const AdminFilesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdminFiles = mongoose.model("AdminFiles", AdminFilesSchema);

export default AdminFiles;