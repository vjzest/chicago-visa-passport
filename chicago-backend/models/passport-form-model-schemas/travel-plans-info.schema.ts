import { Schema } from "mongoose";
import { getCurrentDateInDC, parseMDYDate } from "../../utils/date";

// Helper function to get tomorrow's date
const getTomorrow = () => {
  const tomorrow = getCurrentDateInDC();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Reset time to 00:00
  return tomorrow;
};

export const travelPlansSchema = new Schema(
  {
    travelDate: {
      type: String,
      validate: {
        validator: function (value: string) {
          if (value) {
            const travelDate = parseMDYDate(value)!;
            const tomorrow = getTomorrow();
            return travelDate >= tomorrow; // Travel date must be tomorrow or later
          }
          return true; // Optional if no travelDate
        },
        message: `Travel date must be greater than or equal to ${getTomorrow().toLocaleDateString()}`,
      },
    },
    returnDate: {
      type: String,
      validate: [
        {
          // Validate return date if travel date exists
          validator: function (value: string) {
            //@ts-ignore
            if (value && this.travelDate) {
              //@ts-ignore
              const travelDate = parseMDYDate(this.travelDate)!;
              const returnDate = parseMDYDate(value)!;
              return returnDate >= travelDate; // Return date must be >= travel date
            }
            return true; // Optional if no returnDate or travelDate
          },
          message: "Invalid travel date: should be before or on return date.",
        },
        {
          // Validate return date must be tomorrow or later
          validator: function (value: string) {
            if (value) {
              const returnDate = parseMDYDate(value)!;
              const tomorrow = getTomorrow();
              return returnDate >= tomorrow; // Return date must be tomorrow or later
            }
            return true; // Optional if no returnDate
          },
          message: `Return date must be greater than or equal to ${getTomorrow().toLocaleDateString()}`,
        },
      ],
    },
    travelDestination: {
      type: String,
      maxlength: [70, "Maximum 70 characters"],
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
