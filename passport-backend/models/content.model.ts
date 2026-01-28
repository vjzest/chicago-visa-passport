import { Schema, model } from "mongoose";

export interface PassportContent {
    section: string; // e.g., "en" for english content top-level
    data: any; // The entire JSON structure
}

const PassportContentSchema = new Schema<PassportContent>(
    {
        section: { type: String, required: true, unique: true, default: "en" },
        data: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

export const PassportContentModel = model<PassportContent>(
    "PassportContent",
    PassportContentSchema
);
