import { UsedCaseNoModel } from "../../models/serial.model";
import crypto from "crypto";

export async function getRandomCaseNumber(): Promise<string> {
  const maxAttempts = 10; // Prevent infinite loop
  let attempts = 0;

  while (attempts < maxAttempts) {
    // Generate a random 8-digit number
    const randomNum = crypto.randomInt(10000000, 99999999);
    const caseNo = `J${randomNum}`;

    // Check if this number has been used before
    const exists = await UsedCaseNoModel.findOne({ caseNo });

    if (!exists) {
      // Save the used number
      await UsedCaseNoModel.create({ caseNo });
      return caseNo;
    }

    attempts++;
  }

  throw new Error(
    "Unable to generate unique case number after multiple attempts"
  );
}
