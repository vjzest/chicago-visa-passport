import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  googleMapsUrl: {
    type: String,
    required: true,
  },
});

export const ContactInfoModel = mongoose.model(
  "contactinfo",
  contactInfoSchema
);
