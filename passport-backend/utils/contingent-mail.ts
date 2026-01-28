import { CasesModel } from "../models/cases.model";
import ContingentCaseService from "../services/common/contingent.service";
import { getStatusId } from "./status";

const contingentCaseService = new ContingentCaseService();

export const findAndSendContingentMails = async () => {
  try {
    const contingentStatus = await getStatusId("contingent");
    const untouchedContingentCases = await CasesModel.find({
      "caseInfo.status": contingentStatus,
      "caseInfo.contingentMailSentTimes": { $size: 0 },
      updatedAt: { $lt: new Date(Date.now() - 15 * 60 * 1000) },
    }).select("_id");
    untouchedContingentCases.forEach(async (contingentCase) => {
      try {
        await contingentCaseService.sendContingentEmail(
          contingentCase?._id?.toString()
        );
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
