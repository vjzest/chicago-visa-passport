import mongoose from "mongoose";
import { contactInfoSchema } from "./passport-form-model-schemas/contact-info.schema";
import { emergencyContactSchema } from "./passport-form-model-schemas/emergency-contact.schema";
import { parentAndMarriageInfoSchema } from "./passport-form-model-schemas/parent-and-marriage-info.schema";
import { passportHistorySchema } from "./passport-form-model-schemas/passport-history.shema";
import { personalInfoSchema } from "./passport-form-model-schemas/personal-info.schema";
import { productInfoSchema } from "./passport-form-model-schemas/product-info.shema";
import { travelPlansSchema } from "./passport-form-model-schemas/travel-plans-info.schema";
import { lostInfoSchema } from "./passport-form-model-schemas/lost-info.shema";
import { nameChangeInfoSchema } from "./passport-form-model-schemas/name-change-info.schema";

const PassportFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cases",
      required: false,
      unique: true,
    },
    personalInfo: {
      type: personalInfoSchema,
      required: false,
    },
    contactInfo: {
      type: contactInfoSchema,
      required: false,
    },
    emergencyContact: {
      type: emergencyContactSchema,
      required: false,
    },
    parentAndMarriageInfo: {
      type: parentAndMarriageInfoSchema,
      required: false,
    },
    passportHistory: {
      type: passportHistorySchema,
      required: false,
    },
    productInfo: {
      type: productInfoSchema,
      required: false,
    },
    lostInfo: {
      type: lostInfoSchema,
      required: false,
    },
    travelPlans: {
      type: travelPlansSchema,
      required: false,
    },
    nameChangeInfo: {
      type: nameChangeInfoSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const PassportFormsModel = mongoose.model(
  "passportforms",
  PassportFormSchema
);
