import { AccountsModel } from "../models/accounts.model";

export const updateAccountActivity = async (accountId: string) => {
  try {
    await AccountsModel.updateOne(
      { _id: accountId },
      {
        $set: {
          lastActivity: new Date(),
        },
      }
    );
  } catch (error) {
    console.log("Failed to update account activity");
  }
};
