import mongoose from "mongoose";

const promoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    codeType: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    min: { type: Number, required: true },
    max: { type: Number, required: true },

    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const PromoCodesModel = mongoose.model("promo", promoSchema);
