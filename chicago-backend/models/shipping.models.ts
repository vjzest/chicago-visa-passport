import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema(
  {
    locationName: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    authorisedPerson: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
      uppercase: true,
      validate: {
        validator: function (value: string) {
          return value.length === 2;
        },
        message: "State must be a 2-letter code",
      },
    },
    zipCode: {
      type: String,
      required: true,
    },
    instruction: {
      type: String,
      required: false,
      default: "N/A",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const ShippingsModel = mongoose.model("shippings", shippingSchema);
