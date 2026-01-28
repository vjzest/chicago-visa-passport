import mongoose, { Document, Schema } from "mongoose";

// Interfaces
interface IOTP extends Document {
  email: string;
  otp: string;
  attempts: number;
  createdAt: Date;
}

// OTP Schema
const otpSchema: Schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  attempts: { type: Number, required: false, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // OTP expires after 2 minutes
});

export const OtpsModel = mongoose.model<IOTP>("otps", otpSchema);
