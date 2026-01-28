import mongoose, { Schema, Types } from "mongoose";
import { IauthOnlyFrontend } from "../typings";
export interface ITransaction {
  account: Types.ObjectId | string;
  caseId: Types.ObjectId | string;
  orderId: string;
  serviceFee?: number;
  processingFee?: number;
  govtFee?: number;
  onlineProcessingFee?: string;
  // embassyFee: number;
  nonRefundableFee?: number;
  amount: number;
  returnedAmount?: number;
  refundOrVoidStatus?: "none" | "void" | "refund";
  discount?: number;
  card: {
    number: string;
    expiryMonth: string;
    expiryYear: string;
  };
  products: {
    name: string;
    price: number;
  }[];
  description: string;
  status?: "pending" | "success" | "failed";
  transactionId: string;
  transactionId2?: string;
  doubleCharge?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  transactionType:
    | "refund"
    | "void"
    | "casepayment"
    | "extracharge"
    | "serviceLevel-refund"
    | "serviceLevel-payment";
  paymentProcessor: Types.ObjectId | string;
  authMethod?: IauthOnlyFrontend;
}

const transactionSchema = new Schema<ITransaction>(
  {
    account: { type: Schema.Types.ObjectId, ref: "accounts", required: false },
    paymentProcessor: {
      type: Schema.Types.ObjectId,
      ref: "processor",
      required: function (): boolean {
        //@ts-ignore
        return this.transactionType !== "refund";
      },
    },
    caseId: { type: Schema.Types.ObjectId, ref: "cases", required: true },
    orderId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    returnedAmount: { type: Number, default: 0 },
    refundOrVoidStatus: {
      type: String,
      enum: ["none", "void", "refund"],
      default: "none",
    },
    description: { type: String, required: false },
    discount: { type: Number, required: false, default: 0 },
    serviceFee: { type: Number, required: false, default: 0 },
    processingFee: { type: Number, required: false, default: 0 },
    card: {
      number: {
        type: String,
        required: function (): boolean {
          return !["void", "refund"].includes(this.transactionType);
        },
      },
      expiryYear: {
        type: String,
        required: function (): boolean {
          return !["void", "refund"].includes(this.transactionType);
        },
      },
      expiryMonth: {
        type: String,
        required: function (): boolean {
          return !["void", "refund"].includes(this.transactionType);
        },
      },
    },
    products: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    onlineProcessingFee: { type: String, required: false, default: "0" },
    nonRefundableFee: { type: Number, required: false, default: 0 },
    transactionType: {
      type: String,
      enum: [
        "refund",
        "casepayment",
        "extracharge",
        "serviceLevel-refund",
        "serviceLevel-payment",
        "void",
      ],
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    transactionId: { type: String, required: true, strict: false },
    transactionId2: { type: String, required: false, strict: false },
    doubleCharge: { type: Boolean, default: true },
    authMethod: {
      type: String,
      enum: ["authorize_nrf_capture_service", "capture_both", "authorize_both"],
      default: "capture_both",
      required: false,
    },
  },
  { timestamps: true, strict: false }
);

export const TransactionsModel = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);
