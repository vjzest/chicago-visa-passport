import { Schema, Document } from "mongoose";

// Define an interface for the document structure
interface IPassport extends Document {
  isOwnPassport: boolean;
  reporterFirstName?: string;
  reporterMiddleName?: string;
  reporterLastName?: string;
  reporterRelationship?: string;
  policeReport: boolean;
  lostAtSameTime?: boolean;
  cardLostDetails?: string;
  cardLostLocation?: string;
  cardLostDate?: string;
  bookLostDetails?: string;
  bookLostLocation?: string;
  bookLostDate?: string;
  hadPreviousLost: boolean;
  previousLostCount?: "1" | "2";
  previousLostDates?: string[];
  previousPoliceReport?: boolean;
}

// Create the schema
const lostInfoSchema = new Schema<IPassport>(
  {
    isOwnPassport: {
      type: Boolean,
      required: true,
    },
    reporterFirstName: {
      type: String,
    },
    reporterMiddleName: {
      type: String,
    },
    reporterLastName: {
      type: String,
    },
    reporterRelationship: {
      type: String,
    },
    policeReport: {
      type: Boolean,
      required: true,
    },
    lostAtSameTime: {
      type: Boolean,
    },
    //@ts-ignore
    cardLostDetails: {
      type: String,
      maxlength: 111,
      validate: {
        validator: function (this: IPassport) {
          return (
            (!this.cardLostDetails &&
              !this.cardLostLocation &&
              !this.cardLostDate) ||
            (this.cardLostDetails && this.cardLostLocation && this.cardLostDate)
          );
        },
        message:
          "If one of cardLostDetails, cardLostLocation, or cardLostDate is provided, all must be provided.",
      },
      _id: false,
    },
    cardLostLocation: {
      type: String,
      maxlength: 111,
    },
    cardLostDate: {
      type: String,
    },
    //@ts-ignore
    bookLostDetails: {
      type: String,
      maxlength: 111,
      validate: {
        validator: function (this: IPassport) {
          return (
            (!this.bookLostDetails &&
              !this.bookLostLocation &&
              !this.bookLostDate) ||
            (this.bookLostDetails && this.bookLostLocation && this.bookLostDate)
          );
        },
        message:
          "If one of bookLostDetails, bookLostLocation, or bookLostDate is provided, all must be provided.",
      },
      _id: false,
    },
    bookLostLocation: {
      type: String,
      maxlength: 111,
    },
    bookLostDate: {
      type: String,
    },
    hadPreviousLost: {
      type: Boolean,
      required: true,
    },
    previousLostCount: {
      type: String,
      enum: ["1", "2"],
    },
    previousLostDates: {
      type: [String],
      _id: false,
    },
    previousPoliceReport: {
      type: Boolean,
    },
  },
  {
    timestamps: true, // Add timestamps if needed
    _id: false,
  }
);

// Middleware for additional validation
lostInfoSchema.pre<IPassport>("validate", function (next) {
  if (this.isOwnPassport === false) {
    if (!this.reporterFirstName) {
      this.invalidate(
        "reporterFirstName",
        "Reporter's first name is required."
      );
    }
    if (!this.reporterLastName) {
      this.invalidate("reporterLastName", "Reporter's last name is required.");
    }
    if (!this.reporterRelationship) {
      this.invalidate(
        "reporterRelationship",
        "Reporter's relationship is required."
      );
    }
  }

  if (this.hadPreviousLost === true) {
    if (!this.previousLostCount) {
      this.invalidate(
        "previousLostCount",
        "Please select how many passports were lost."
      );
    }
    if (
      this.previousPoliceReport === null ||
      this.previousPoliceReport === undefined
    ) {
      this.invalidate(
        "previousPoliceReport",
        "Please indicate if you filed a police report."
      );
    }
  }

  next();
});

export { lostInfoSchema };
