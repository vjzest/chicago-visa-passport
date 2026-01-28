import mongoose, { Document } from "mongoose";

// Constants to match the original Zod schema
const INCORRECT_FIELDS = [
  "lastName",
  "firstName",
  "middleName",
  "placeOfBirth",
  "dateOfBirth",
  "gender",
];

const NAME_CHANGE_REASONS = ["marriage", "courtOrder"];

// Interface for the document
interface INameChangeInfo extends Document {
  dataCorrectness:
    | "correct"
    | "incorrectCard"
    | "incorrectBook"
    | "incorrectBoth";
  incorrectFields?: string[];
  nameChanged: "noChange" | "changedCard" | "changedBook" | "changedBoth";
  isLimitedPassport?: boolean;
  paidForCard?: boolean;
  nameChangeDetails?: {
    reason?: "marriage" | "courtOrder";
    date?: string;
    place?: string;
    canProvideDocumentation?: boolean;
  };
}

// Mongoose Schema
export const nameChangeInfoSchema = new mongoose.Schema<INameChangeInfo>(
  {
    dataCorrectness: {
      type: String,
      enum: {
        values: ["correct", "incorrectCard", "incorrectBook", "incorrectBoth"],
        message: "Please select if the data was printed correctly",
      },
      required: [true, "Please select if the data was printed correctly"],
    },
    incorrectFields: {
      type: [String],
      validate: {
        validator: function (this: INameChangeInfo, value: string[]) {
          // If dataCorrectness is not 'correct', incorrectFields must be non-empty
          if (
            this.dataCorrectness !== "correct" &&
            (!value || value.length === 0)
          ) {
            return false;
          }
          // Validate that all fields are from the predefined list
          return value
            ? value.every((field) => INCORRECT_FIELDS.includes(field))
            : true;
        },
        message: "Please select the incorrect fields",
      },
    },
    nameChanged: {
      type: String,
      enum: {
        values: ["noChange", "changedCard", "changedBook", "changedBoth"],
        message: "Please select if your name has changed",
      },
      required: [true, "Please select if your name has changed"],
    },
    isLimitedPassport: {
      type: Boolean,
    },
    paidForCard: {
      type: Boolean,
    },
    nameChangeDetails: {
      type: {
        reason: {
          type: String,
          enum: {
            values: NAME_CHANGE_REASONS,
            message: "Please select the reason for name change",
          },
        },
        date: {
          type: String,
          validate: {
            validator: function (this: INameChangeInfo, value: string) {
              return this.nameChanged !== "noChange" ? !!value : true;
            },
            message: "Please provide the date of name change",
          },
        },
        place: {
          type: String,
          validate: {
            validator: function (this: INameChangeInfo, value: string) {
              return this.nameChanged !== "noChange" ? !!value : true;
            },
            message: "Please provide the place of name change",
          },
        },
        canProvideDocumentation: {
          type: Boolean,
          validate: {
            validator: function (this: INameChangeInfo, value: boolean) {
              return this.nameChanged !== "noChange"
                ? value !== undefined
                : true;
            },
            message: "Please indicate if you can provide documentation",
          },
        },
      },
      _id: false,
      validate: {
        validator: function (
          this: INameChangeInfo,
          value: INameChangeInfo["nameChangeDetails"]
        ) {
          // If nameChanged is not 'noChange', nameChangeDetails must be present and have required fields
          if (this.nameChanged !== "noChange") {
            return !!(
              value &&
              value.reason &&
              value.date &&
              value.place !== undefined &&
              value.canProvideDocumentation !== undefined
            );
          }
          return true;
        },
        message: "Name change details are incomplete",
      },
    },
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
    _id: false,
  }
);
