import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentLink extends Document {
    token: string;
    serviceType: mongoose.Schema.Types.ObjectId;
    serviceLevel: mongoose.Schema.Types.ObjectId;
    amount: number;
    caseId?: mongoose.Schema.Types.ObjectId;
    status: "active" | "used" | "expired";
    expiresAt: Date;
    metadata?: any;
}

const PaymentLinkSchema = new Schema<IPaymentLink>(
    {
        token: { type: String, required: true, unique: true },
        serviceType: { type: Schema.Types.ObjectId, ref: "servicetypes", required: true },
        serviceLevel: { type: Schema.Types.ObjectId, ref: "servicelevels", required: true },
        amount: { type: Number, required: true },
        caseId: { type: Schema.Types.ObjectId, ref: "cases" },
        status: { type: String, enum: ["active", "used", "expired"], default: "active" },
        expiresAt: { type: Date, required: true, index: { expires: 0 } },
        metadata: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

export const PaymentLinkModel = mongoose.model<IPaymentLink>("PaymentLink", PaymentLinkSchema);
