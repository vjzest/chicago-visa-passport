import mongoose from "mongoose";

const passportCardDetailsSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["yes", "damaged", "lost", "stolen"],
      required: true,
    },
    firstNameAndMiddleName: {
      type: String,
      maxlength: 80,
    },
    lastName: {
      type: String,
      maxlength: 80,
    },
    number: {
      type: String,
      maxlength: 9,
    },
    issueDate: {
      type: String,
    },
    hasReportedLostOrStolen: {
      type: Boolean,
    },
  },
  {
    _id: false,
  }
);

passportCardDetailsSchema.pre("validate", function (next) {
  if (this.status === "yes" && !this.issueDate) {
    this.invalidate("issueDate", "Issue date is required");
  }
  if (this.status === "yes" && !this.number) {
    this.invalidate("number", "Number is required");
  }
  if (
    (this.status === "lost" || this.status === "stolen") &&
    this.hasReportedLostOrStolen === undefined
  ) {
    this.invalidate(
      "hasReportedLostOrStolen",
      "Please specify if you have reported the lost or stolen passport"
    );
  }
  next();
});

const passportBookDetailsSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["yes", "damaged", "lost", "stolen"],
      required: true,
    },
    firstNameAndMiddleName: {
      type: String,
      maxlength: 80,
    },
    lastName: {
      type: String,
      maxlength: 80,
    },
    number: {
      type: String,
      maxlength: 9,
    },
    issueDate: {
      type: String,
    },
    isOlderThan15Years: {
      type: String,
      enum: ["yes", "no", "unknown"],
    },
    hasReportedLostOrStolen: {
      type: Boolean,
    },
  },
  {
    _id: false,
  }
);

passportBookDetailsSchema.pre("validate", function (next) {
  if (this.status === "yes" && !this.issueDate) {
    this.invalidate("issueDate", "Issue date is required");
  }
  if (this.status === "yes" && !this.number) {
    this.invalidate("number", "Number is required");
  }
  if (
    (this.status === "lost" || this.status === "stolen") &&
    !this.hasReportedLostOrStolen &&
    !this.issueDate &&
    !this.isOlderThan15Years
  ) {
    this.invalidate(
      "isOlderThan15Years",
      "Please specify if the passport was issued more than 15 years ago"
    );
  }
  if (
    (this.status === "lost" || this.status === "stolen") &&
    this.hasReportedLostOrStolen === undefined
  ) {
    this.invalidate(
      "hasReportedLostOrStolen",
      "Please specify if you have reported the lost or stolen passport"
    );
  }
  next();
});

const passportHistorySchema = new mongoose.Schema(
  {
    hasPassportCardOrBook: {
      type: String,
      enum: ["book", "card", "both", "none"],
      required: true,
    },
    passportCardDetails: {
      type: passportCardDetailsSchema,
      required: [
        function () {
          return (
            //@ts-ignore
            this.hasPassportCardOrBook === "card" ||
            //@ts-ignore
            this.hasPassportCardOrBook === "both"
          );
        },
        "Passport card details are required when having one",
      ],
    },
    passportBookDetails: {
      type: passportBookDetailsSchema,
      required: [
        function () {
          return (
            //@ts-ignore
            this.hasPassportCardOrBook === "book" ||
            //@ts-ignore
            this.hasPassportCardOrBook === "both"
          );
        },
        "Passport book details are required when having one",
      ],
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

passportHistorySchema.pre("validate", function (next) {
  if (
    (this.hasPassportCardOrBook === "card" ||
      this.hasPassportCardOrBook === "both") &&
    !this.passportCardDetails
  ) {
    this.invalidate(
      "passportCardDetails",
      "Passport card details are required"
    );
  }
  if (
    (this.hasPassportCardOrBook === "book" ||
      this.hasPassportCardOrBook === "both") &&
    !this.passportBookDetails
  ) {
    this.invalidate(
      "passportBookDetails",
      "Passport book details are required"
    );
  }
  next();
});

export { passportHistorySchema };
