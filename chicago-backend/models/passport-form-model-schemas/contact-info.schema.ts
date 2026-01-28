import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: true, maxlength: 40 },
    line2: { type: String, maxlength: 40 },
    inCareOf: { type: String, maxlength: 50 }, // Only for non-permanent addresses
    city: { type: String, required: true },
    zipCode: { type: String, maxlength: 10 },
    country: { type: String, required: true },
    state: { type: String }, // Conditionally required for US and CA
  },
  {
    _id: false,
  }
);

addressSchema.pre("validate", function (next) {
  if (["US", "CA"].includes(this.country) && !this.state) {
    this.invalidate("state", "State is required for US and CA addresses");
  }
  if (["US", "CA"].includes(this.country) && !this.state) {
    this.invalidate("zipCode", "Zip code is required for US and CA addresses");
  }
  next();
});

const additionalPhoneNumbersSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      match: [/^\d+$/, "Phone number must contain only digits"],
      maxlength: 22,
    },
    type: {
      type: String,
      enum: ["work", "home", "cell"],
      required: true,
    },
  },
  { _id: false }
);

const contactInfoSchema = new mongoose.Schema(
  {
    mailing: {
      type: addressSchema,
      required: true,
    },
    permanent: {
      type: addressSchema,
    },
    sameAsMailing: {
      type: Boolean,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
      maxLength: 50,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email address",
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => value.length <= 22,
        message: "Maximum 22 digits only",
      },
    },
    phoneNumberType: {
      type: String,
      enum: ["home", "cell", "work"],
      required: true,
    },
    additionalPhoneNumbers: {
      type: [additionalPhoneNumbersSchema],
      default: [],
    },
    preferredCommunication: {
      type: String,
      enum: ["mail", "email", "both"],
      required: true,
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

// Add a custom validator for the permanent address
contactInfoSchema.pre("validate", function (next) {
  if (!this.sameAsMailing && !this.permanent) {
    return next(
      new Error("Permanent address is required if not same as mailing")
    );
  }

  if (!this.sameAsMailing && this.permanent) {
    const requiredFields = ["line1", "city", "zipCode", "country"];
    requiredFields.forEach((field) => {
      //@ts-ignore
      if (!this.permanent[field]) {
        this.invalidate(
          `permanent.${field}`,
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
      }
    });

    if (
      ["US", "CA"].includes(this.permanent.country) &&
      !this.permanent.state
    ) {
      this.invalidate(
        "permanent.state",
        "State is required for US and CA addresses"
      );
    }
  }

  next();
});

export { contactInfoSchema };
