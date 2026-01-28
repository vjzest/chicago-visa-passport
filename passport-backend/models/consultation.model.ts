import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.ObjectId,
    ref: "accounts",
    required: false,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },
  phone: {
    type: String,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const ConsultationsModel = mongoose.model(
  "consultation",
  consultationSchema
);
