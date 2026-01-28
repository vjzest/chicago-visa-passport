import mongoose, {Schema, Document} from "mongoose";

interface IUsedNumber extends Document {
  caseNo: string;
  createdAt: Date;
}

const usedCaseNoSchema = new Schema<IUsedNumber>({
  caseNo: {type: String, required: true, unique: true},
  createdAt: {type: Date, default: Date.now},
});

export const UsedCaseNoModel = mongoose.model<IUsedNumber>(
  "serial",
  usedCaseNoSchema
);
