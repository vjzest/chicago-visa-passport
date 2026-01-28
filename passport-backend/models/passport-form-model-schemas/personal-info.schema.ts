import mongoose from "mongoose";
import { getCurrentDateInDC, parseMDYDate } from "../../utils/date";

export const personalInfoSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 35,
    },
    middleName: {
      type: String,
      maxlength: 35,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 35,
    },
    suffix: {
      type: String,
      maxlength: 35,
    },
    dateOfBirth: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return parseMDYDate(value)! <= getCurrentDateInDC();
        },
        message: "Date of birth must be in the past",
      },
    },
    gender: {
      type: String,
      required: true,
    },
    // changingGenderMarker: {
    //   type: Boolean,
    // },
    cityOfBirth: {
      type: String,
      required: true,
      maxlength: 25,
    },
    countryOfBirth: {
      type: String,
      required: true,
    },
    stateOfBirth: {
      type: String,
      required: function () {
        //@ts-ignore
        return ["USA", "CAN"].includes(this.countryOfBirth);
      },
    },
    socialSecurityNumber: {
      type: String,
      required: true,
      minlength: 9,
      maxlength: 9,
    },
    occupation: {
      type: String,
      required: true,
      maxlength: 30,
    },
    employerOrSchool: {
      type: String,
      maxLength: 30,
    },
    height: {
      feet: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      inches: {
        type: Number,
        required: true,
        min: 0,
        max: 11,
      },
      _id: false,
    },
    eyeColor: {
      type: String,
      required: true,
    },
    hairColor: {
      type: String,
      required: true,
    },
    isComplete: {
      type: Boolean,
      required: true,
    },
    allPreviousNames: {
      type: [
        {
          firstName: String,
          lastName: String,
        },
      ],
      default: [],
    },
  },
  {
    _id: false,
  }
);
