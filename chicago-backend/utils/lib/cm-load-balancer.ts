import { AdminsModel } from "../../models/admins.model";
import { CaseManagerLoadsModel } from "../../models/case-manager-loads-model";

export async function selectCaseManager() {
  try {
    // 1. Get all active case managers
    const caseManagers = await AdminsModel.find({
      autoAssign: true,
      status: "Active",
    });

    if (caseManagers.length === 0) {
      throw new Error("No active case managers found");
    }

    // 2. Fetch current case loads from database
    const caseLoads = await CaseManagerLoadsModel.find({
      caseManager: { $in: caseManagers.map((cm) => cm._id) },
    });

    // Ensure we have load records for all case managers
    for (const caseManager of caseManagers) {
      const caseManagerId = caseManager._id.toString();
      const existingLoad = caseLoads.find(
        (cl) => cl.caseManager.toString() === caseManagerId
      );

      if (!existingLoad) {
        // Create a new load record if none exists
        const newLoad = new CaseManagerLoadsModel({
          caseManager: caseManager._id,
          caseCount: 0,
        });
        await newLoad.save();
        caseLoads.push(newLoad);
      }
    }

    // 3. Find the case manager with the least assigned cases
    let selectedCaseManager = null;
    let lowestCaseCount = Infinity;

    for (const caseManager of caseManagers) {
      const caseManagerId = caseManager._id.toString();
      const loadRecord = caseLoads.find(
        (cl) => cl.caseManager.toString() === caseManagerId
      );

      const currentCount = loadRecord ? loadRecord.caseCount : 0;

      if (currentCount < lowestCaseCount) {
        lowestCaseCount = currentCount;
        selectedCaseManager = caseManager;
      }
    }

    if (!selectedCaseManager) {
      return null;
    }
    await CaseManagerLoadsModel.updateOne(
      { caseManager: selectedCaseManager._id },
      { $inc: { caseCount: 1 } }
    );

    return selectedCaseManager;
  } catch (error) {
    console.error("Error in selectCaseManager:", error);
    throw error;
  }
}

export async function resetCaseManagerLoads() {
  try {
    await CaseManagerLoadsModel.updateMany(
      {},
      {
        $set: {
          caseCount: 0,
        },
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}
