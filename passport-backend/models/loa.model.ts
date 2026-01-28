import mongoose from "mongoose";

const loaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const LoasModel = mongoose.model("loa", loaSchema);
