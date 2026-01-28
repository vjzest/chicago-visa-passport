import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
  {
    senderType: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },
    text: {
      type: String,
      required: true,
    },
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cases",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
      required: true,
    },
  },
  { timestamps: true }
);

export const MessagesModel = mongoose.model("messages", messagesSchema);
