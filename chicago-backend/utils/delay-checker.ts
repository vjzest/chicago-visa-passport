import { CasesModel } from "../models/cases.model";
import { StatusesModel } from "../models/statuses.model";
import { getStatusId } from "./status";
/**
 * Function to check if cases have exceeded their service level speed in weeks
 * and mark them as delayed if they have.
 */
export async function checkDelayPastTimeframe() {
  try {
    const excludedStatuses = [
      "archived",
      "delayed",
      "suspended",
      "voided",
      "deleted",
      "refunded",
      "developer-cases",
      "contingent",
      "complete/not-processed",
      "complete-not-processed",
      "failed-charge",
    ];
    const includedStatuses = await StatusesModel.find({
      key: { $nin: excludedStatuses },
    }).select("_id");
    const includedStatusIds = includedStatuses.map((status) => status._id);
    const casesToCheck = await CasesModel.find({
      "caseInfo.status": { $in: includedStatusIds },
    })
      .select("caseInfo")
      .populate({
        path: "caseInfo.serviceLevel",
        select: "speedInWeeks",
      });
    const currentDate = new Date();
    const delayedStatusId = await getStatusId("delayed");
    casesToCheck.forEach(async (caseItem) => {
      const serviceLevel = caseItem.caseInfo.serviceLevel;
      if (!serviceLevel) {
        return;
      }
      const speedInWeeks = (serviceLevel as any).speedInWeeks;
      const countDownStartDate = caseItem.countDownStartDate!;
      if (!countDownStartDate || !speedInWeeks) {
        return;
      }
      //check if the case was submitted more than the service level speed in weeks ago
      const weeksInMilliseconds = speedInWeeks * 7 * 24 * 60 * 60 * 1000;
      if (countDownStartDate) {
        const delayedDate = new Date(
          new Date(countDownStartDate).getTime() + weeksInMilliseconds
        );
        if (delayedDate < currentDate) {
          // Update the case status to delayed
          await CasesModel.updateOne(
            { _id: caseItem._id },
            { $set: { "caseInfo.status": delayedStatusId } }
          );
          console.log(`Case ${caseItem._id} has been marked as delayed.`);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Function to check if cases have been stalled in 'Waiting for Documents' for more than 7 days
 * and mark them as stalled if they have.
 */
// export async function checkStalledCases() {
//   try {
//     const stalledStatusId = await getStatusId("waiting-for-documents");
//     const includedCases = await CasesModel.find({
//       "caseInfo.status": stalledStatusId,
//     }).select("updatedAt caseInfo");
//     includedCases.forEach(async (caseItem) => {
//       const lastActivityDate = new Date(caseItem.updatedAt!);
//       const currentDate = new Date();
//       const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
//       const stalledDate = new Date(
//         lastActivityDate.getTime() + sevenDaysInMilliseconds
//       );
//       if (stalledDate < currentDate) {
//         await CasesModel.updateOne(
//           { _id: caseItem._id },
//           { $set: { "caseInfo.status": stalledStatusId } }
//         );
//         console.log(`Case ${caseItem._id} has been marked as stalled.`);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }
