import { Types } from "mongoose";
import { CasesModel } from "../models/cases.model";
import { StatusesModel } from "../models/statuses.model";

export const updateCaseStatus = async (
  caseId: string | Types.ObjectId,
  statusKey: string,
  statusLevel: 1 | 2 | 3
) => {
  const caseDoc = await CasesModel.findById(caseId);
  if (!caseDoc) throw new Error("Case not found");
  const status = await StatusesModel.findOne({ key: statusKey });
  if (!status) throw new Error("Error changing status");
  switch (statusLevel) {
    case 1:
      //@ts-ignore
      caseDoc.caseInfo.status = status._id;
      break;
    case 2:
      //@ts-ignore
      caseDoc.caseInfo.subStatus1 = status._id;
      break;
    case 3:
      //@ts-ignore
      caseDoc.caseInfo.subStatus2 = status._id;
      break;
    default:
      throw new Error("Invalid status level");
  }
  await caseDoc.save();
};

export const getStatusId = async (statusKey: string) => {
  const status = await StatusesModel.findOne({ key: statusKey }).select("_id");
  if (!status) throw new Error("Status not found");
  return status._id;
};
