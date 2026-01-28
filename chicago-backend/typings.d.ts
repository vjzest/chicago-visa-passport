import { Document } from "mongoose";

export type IDynamicFormField = {
  _id: string;
  id?: string;
  title: string;
  key: string;
  placeholder: string;
  writable?: boolean;
  sortOrder: number;
  type:
    | "text"
    | "number"
    | "textarea"
    | "date"
    | "checkbox"
    | "select"
    | "email"
    | "tel";
  validations?: {
    required?: { value: boolean; message?: string };
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    restrictPastDates?: { value: boolean; message?: string };
    restrictFutureDates?: { value: boolean; message?: string };
    [key: string]: any;
  };
  options?: { title: string; value: string }[];
};

export type IauthOnlyFrontend =
  | "authorize_nrf_capture_service"
  | "capture_both"
  | "authorize_both";

export type IForm = {
  _id?: string;
  id: string;
  name: string;
  sortOrder: number;
  fields: IDynamicFormField[];
  type: "common" | "individual";
  originCountry: string;
  destinationCountry: string;
};

export type IFormsSection = {
  _id: string;
  title: string;
  forms: IForm[];
};

export interface IStatus extends Document {
  _id: string;
  title: string;
  description?: string;
  color?: string;
  sendAutoEmail: boolean;
  disableCase: boolean;
  key: string;
  sortOrder: number;
  autoEmailMessage?: string;
  level: 1 | 2 | 3;
  parent?: mongoose.Types.ObjectId;
  children: mongoose.Types.ObjectId[];
  isStatic: boolean;
}
