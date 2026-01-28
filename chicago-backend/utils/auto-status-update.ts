import mongoose from "mongoose";
import { CasesModel } from "../models/cases.model";
import { StatusesModel } from "../models/statuses.model";

// Helper function to get status by key with error handling
const getStatusByKey = async (
  key: string
): Promise<mongoose.Types.ObjectId> => {
  const status = await StatusesModel.findOne({ key });
  if (!status) {
    throw new Error(`Status with key ${key} not found`);
  }
  //@ts-ignore
  return status._id;
};

// 1. Check Waiting for Docs cases for 30 days inactivity
const checkWaitingForDocsInactivity = async (): Promise<void> => {
  try {
    // Get required status IDs
    const waitingForDocsId = await getStatusByKey("waiting-for-docs");
    const onHoldId = await getStatusByKey("on-hold");
    const thirtyDaysTFId = await getStatusByKey("30d-(tf)");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find all relevant cases and update in bulk
    const casesWithInactiveAccounts = await CasesModel.aggregate([
      {
        $match: {
          "caseInfo.status": waitingForDocsId,
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "account",
          foreignField: "_id",
          as: "accountInfo",
        },
      },
      {
        $match: {
          "accountInfo.lastActivity": { $lt: thirtyDaysAgo },
        },
      },
    ]);

    const bulkOps = casesWithInactiveAccounts.map((caseDoc) => ({
      updateOne: {
        filter: { _id: caseDoc._id },
        update: {
          $set: {
            "caseInfo.status": onHoldId,
            "caseInfo.subStatus1": thirtyDaysTFId,
            "caseInfo.statusDate": new Date(),
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      await CasesModel.bulkWrite(bulkOps);
    }
  } catch (error) {
    console.error("Error in checkWaitingForDocsInactivity:", error);
  }
};

// 2. Check On Hold / 30D (TF) cases for 90 days from purchase date
const checkOnHoldExpiration = async (): Promise<void> => {
  try {
    const onHoldId = await getStatusByKey("on-hold");
    const thirtyDaysTFId = await getStatusByKey("30d-(tf)");
    const archivedId = await getStatusByKey("archived");
    const expiredId = await getStatusByKey("expired");

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    await CasesModel.updateMany(
      {
        "caseInfo.status": onHoldId,
        "caseInfo.subStatus1": thirtyDaysTFId,
        "caseInfo.purchaseDate": { $lt: ninetyDaysAgo },
      },
      {
        $set: {
          "caseInfo.status": archivedId,
          "caseInfo.subStatus1": expiredId,
          "caseInfo.statusDate": new Date(),
        },
      }
    );
  } catch (error) {
    console.error("Error in checkOnHoldExpiration:", error);
  }
};

// 3. Check Contingent status cases for 7 days inactivity
const checkContingentFailure = async (): Promise<void> => {
  try {
    const contingentId = await getStatusByKey("contingent");
    const orderFailedId = await getStatusByKey("order-failed");
    const incompleteOrderId = await getStatusByKey("incomplete-order");
    const archivedId = await getStatusByKey("archived");
    const failedContingentId = await getStatusByKey("failed");

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await CasesModel.updateMany(
      {
        "caseInfo.status": contingentId,
        "caseInfo.subStatus1": { $in: [orderFailedId, incompleteOrderId] },
        "caseInfo.statusDate": { $lt: sevenDaysAgo },
      },
      {
        $set: {
          "caseInfo.status": archivedId,
          "caseInfo.subStatus1": failedContingentId,
          "caseInfo.statusDate": new Date(),
        },
      }
    );
  } catch (error) {
    console.error("Error in checkContingentFailure:", error);
  }
};

// 4. Check Waiting For Docs/Re-Activated (TR) cases for 30 days
const checkReactivatedExpiration = async (): Promise<void> => {
  try {
    const waitingForDocsId = await getStatusByKey("waiting-for-docs");
    const reactivatedTRId = await getStatusByKey(
      "re-activated-(time-requirement)"
    );
    const archivedId = await getStatusByKey("archived");
    const expiredId = await getStatusByKey("expired");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await CasesModel.updateMany(
      {
        "caseInfo.status": waitingForDocsId,
        "caseInfo.subStatus1": reactivatedTRId,
        "caseInfo.statusDate": { $lt: thirtyDaysAgo },
      },
      {
        $set: {
          "caseInfo.status": archivedId,
          "caseInfo.subStatus1": expiredId,
          "caseInfo.statusDate": new Date(),
        },
      }
    );
  } catch (error) {
    console.error("Error in checkReactivatedExpiration:", error);
  }
};

// 5. Check Waiting For Docs/Transferred Account (TR) cases for 30 days
const checkTransferredAccountExpiration = async (): Promise<void> => {
  try {
    const waitingForDocsId = await getStatusByKey("waiting-for-docs");
    const transferredAccountTRId = await getStatusByKey(
      "transferred-account-(time-requirement)"
    );
    const archivedId = await getStatusByKey("archived");
    const expiredId = await getStatusByKey("expired");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await CasesModel.updateMany(
      {
        "caseInfo.status": waitingForDocsId,
        "caseInfo.subStatus1": transferredAccountTRId,
        "caseInfo.statusDate": { $lt: thirtyDaysAgo },
      },
      {
        $set: {
          "caseInfo.status": archivedId,
          "caseInfo.subStatus1": expiredId,
          "caseInfo.statusDate": new Date(),
        },
      }
    );
  } catch (error) {
    console.error("Error in checkTransferredAccountExpiration:", error);
  }
};

// 6. Check In Transit/Inbound cases for 3 days
const checkInTransitInbound = async (): Promise<void> => {
  try {
    const transitId = await getStatusByKey("transit");
    const inboundId = await getStatusByKey("inbound");
    const alertId = await getStatusByKey("alert");

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    await CasesModel.updateMany(
      {
        "caseInfo.status": transitId,
        "caseInfo.subStatus1": inboundId,
        "caseInfo.statusDate": { $lt: threeDaysAgo },
      },
      {
        $set: {
          "caseInfo.subStatus1": alertId,
          "caseInfo.statusDate": new Date(),
        },
      }
    );
  } catch (error) {
    console.error("Error in checkInTransitInbound:", error);
  }
};

// 7. Check In Transit/Will Drop Off cases for 3 days
const checkInTransitWillDropOff = async (): Promise<void> => {
  try {
    const transitId = await getStatusByKey("transit");
    const willDropOffId = await getStatusByKey("will-drop-off");
    const alertId = await getStatusByKey("alert");

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    await CasesModel.updateMany(
      {
        "caseInfo.status": transitId,
        "caseInfo.subStatus1": willDropOffId,
        "caseInfo.statusDate": { $lt: threeDaysAgo },
      },
      {
        $set: {
          "caseInfo.subStatus1": alertId,
          "caseInfo.statusDate": new Date(),
        },
      }
    );
  } catch (error) {
    console.error("Error in checkInTransitWillDropOff:", error);
  }
};

// 8. Check Suspended/A.A (TR) cases for 30 days
const checkSuspendedAATR = async (): Promise<void> => {
  try {
    const suspendedId = await getStatusByKey("suspended");
    const aaTRId = await getStatusByKey("a.a-(time-requirement)");
    const pptDeniedId = await getStatusByKey("ppt-denied");
    const ninetyDaysTFDId = await getStatusByKey("90d-(tf)-d");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await CasesModel.updateMany(
      {
        "caseInfo.status": suspendedId,
        "caseInfo.subStatus1": aaTRId,
        "caseInfo.statusDate": { $lt: thirtyDaysAgo },
      },
      {
        $set: {
          "caseInfo.status": pptDeniedId,
          "caseInfo.subStatus1": ninetyDaysTFDId,
          "caseInfo.statusDate": new Date(),
        },
      }
    );
  } catch (error) {
    console.error("Error in checkSuspendedAATR:", error);
  }
};

// 9. Check Suspended/Per Agency S cases for 90 days
const checkSuspendedPerAgency = async (): Promise<void> => {
  try {
    const suspendedId = await getStatusByKey("suspended");
    const perAgencySId = await getStatusByKey("per-agency-s");
    const pptDeniedId = await getStatusByKey("ppt-denied");
    const perAgencyDId = await getStatusByKey("per-agency-d");

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    await CasesModel.updateMany(
      {
        "caseInfo.status": suspendedId,
        "caseInfo.subStatus1": perAgencySId,
        "caseInfo.statusDate": { $lt: ninetyDaysAgo },
      },
      {
        $set: {
          "caseInfo.status": pptDeniedId,
          "caseInfo.subStatus1": perAgencyDId,
          "caseInfo.statusDate": new Date(),
        },
      }
    );
  } catch (error) {
    console.error("Error in checkSuspendedPerAgency:", error);
  }
};

// 10. Check Suspended/Per Courier S cases for 90 days
const checkSuspendedPerCourier = async (): Promise<void> => {
  try {
    const suspendedId = await getStatusByKey("suspended");
    const perCourierSId = await getStatusByKey("per-courier-s");
    const pptDeniedId = await getStatusByKey("ppt-denied");
    const ninetyDaysTFDId = await getStatusByKey("90d-(tf)-d");

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    await CasesModel.updateMany(
      {
        "caseInfo.status": suspendedId,
        "caseInfo.subStatus1": perCourierSId,
        "caseInfo.statusDate": { $lt: ninetyDaysAgo },
      },
      {
        $set: {
          "caseInfo.status": pptDeniedId,
          "caseInfo.subStatus1": ninetyDaysTFDId,
          "caseInfo.statusDate": new Date(),
        },
      }
    );
  } catch (error) {
    console.error("Error in checkSuspendedPerCourier:", error);
  }
};

// Function to run ALL status checks (both first five and remaining)
export const runAllRoutineStatusChecksAndUpdates = async (): Promise<void> => {
  try {
    await Promise.all([
      checkWaitingForDocsInactivity(),
      checkOnHoldExpiration(),
      checkContingentFailure(),
      checkReactivatedExpiration(),
      checkTransferredAccountExpiration(),
      checkInTransitInbound(),
      checkInTransitWillDropOff(),
      checkSuspendedAATR(),
      checkSuspendedPerAgency(),
      checkSuspendedPerCourier(),
    ]);
  } catch (error) {
    console.error("Error while running routine status updates", error);
  }
};
