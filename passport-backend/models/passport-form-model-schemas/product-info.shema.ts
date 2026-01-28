import mongoose, { Schema } from "mongoose";

export const productInfoSchema = new Schema(
  {
    passportOption: {
      type: String,
      enum: ["card", "book", "both"],
      required: [true, "Please select a passport option"],
    },
    largeBook: {
      type: Boolean,
      default: false,
    },
    processingMethod: {
      type: String,
      // enum: ["routine", "expedited", "agency"],
      enum: ["expedited"],
      required: [true, "Please select a processing method"],
      default: "expedited",
    },
    deliveryMethod: {
      book: {
        type: String,
        // enum: ["standard", "one-two-day"],
        enum: ["one-two-day"],
        required: [
          function (value: String) {
            return (
              //@ts-ignore
              this.passportOption === "book" || this.passportOption === "both"
            );
          },
          "Please select a delivery method for book",
        ],
      },
      _id: false,
    },
    additionalFees: {
      fileSearch: {
        type: Boolean,
        default: false,
      },
      _id: false,
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

productInfoSchema.pre("save", function (next) {
  this as mongoose.InferSchemaType<typeof productInfoSchema>;
  if (
    this.passportOption !== "book" &&
    this.passportOption !== "both" &&
    this.deliveryMethod?.book
  ) {
    this.deliveryMethod.book = null;
  }
  next();
});
