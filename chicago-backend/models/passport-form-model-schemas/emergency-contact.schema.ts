import mongoose from "mongoose";

export const emergencyContactSchema = new mongoose.Schema(
  {
    emergencyContactName: {
      type: String,
      trim: true,
      maxLength: 40,
    },
    emergencyContactPhone: {
      type: String,
      trim: true,
      maxLength: 25,
    },
    emergencyContactRelationship: {
      type: String,
      trim: true,
      maxLength: 70,
    },
    street: {
      type: String,
      trim: true,
      maxLength: 40,
    },
    apartmentOrUnit: {
      type: String,
      trim: true,
      maxLength: 40,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      maxLength: 40,
    },
    zipCode: {
      type: String,
      trim: true,
      maxLength: 10,
    },
    isComplete: {
      type: Boolean,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// Pre-validation hook for custom logic
emergencyContactSchema.pre("validate", function (next) {
  const keysToCheck = [
    "emergencyContactName",
    "emergencyContactPhone",
    "emergencyContactRelationship",
    "street",
    "state",
    "city",
    "zipCode",
  ];

  const isAnyFieldFilled =
    //@ts-ignore
    keysToCheck.some((key) => this[key]?.trim()) || !!this.apartmentOrUnit;

  if (isAnyFieldFilled) {
    // Check all required fields except apartmentOrUnit
    //@ts-ignore
    const missingFields = keysToCheck.filter((key) => !this[key]?.trim());

    if (missingFields.length > 0) {
      const errors = missingFields.map((field) => ({
        path: field,
        message: `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} is required`,
      }));
      //@ts-ignore
      return next(new mongoose.Error.ValidationError({ errors }));
    }
  }

  next();
});
