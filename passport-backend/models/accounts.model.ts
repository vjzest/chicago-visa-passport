import mongoose, { Document } from "mongoose";

export interface IAddressDoc extends Document {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: mongoose.Schema.Types.ObjectId;
  zip: string;
  phone: string;
}

const addressesSchema = new mongoose.Schema({
  line1: {
    type: String,
    required: true,
  },
  line2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "countries",
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const accountsSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    middleName: { type: String, required: false, trim: true },
    email1: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    email2: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      // unique: true,
    },
    phone1: {
      type: String,
      required: false,
    },
    phone2: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    userKey: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
      required: false,
      validate: {
        validator: function (value: Date) {
          return value < new Date();
        },
        message: "Date of birth must be in the past",
      },
    },
    addresses: {
      type: [addressesSchema],
      default: [],
      required: false,
    },
    isActive: { type: Boolean, default: false },
    consentToUpdates: { type: Boolean, default: true },
    lastActivity: { type: Date, default: new Date() },
    authTokenVersion: {
      type: String,
    },
  },
  { timestamps: true }
);

export const AccountsModel = mongoose.model("accounts", accountsSchema);
