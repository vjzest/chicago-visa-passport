import mongoose, { Schema, Document } from "mongoose";
import { IFormsSection } from "../typings";

const DynamicFormFieldSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  id: { type: String, required: true },
  title: { type: String, required: true },
  key: { type: String, required: true },
  writable: { type: Boolean, default: true },
  placeholder: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "text",
      "number",
      "textarea",
      "date",
      "checkbox",
      "select",
      "email",
      "tel",
    ],
    required: true,
  },
  sortOrder: { type: Number, required: true },
  validations: {
    required: { value: Boolean, message: String },
    restrictPastDates: { value: Boolean, message: String },
    restrictFutureDates: { value: Boolean, message: String },
    minLength: { value: Number, message: String },
    maxLength: { value: Number, message: String },
    pattern: {
      value: { type: String, get: (v: string) => new RegExp(v) },
      message: String,
    },
  },
  options: [{ title: String, value: String }],
});

const FormSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  // sortOrder: {type: Number, required: true},
  fields: [DynamicFormFieldSchema],
});

const FormsSectionSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  id: { type: String, required: true },
  title: { type: String, required: true },
  forms: [FormSchema],
});

export const FormsSectionsModel = mongoose.model<IFormsSection & Document>(
  "formssections",
  FormsSectionSchema
);
