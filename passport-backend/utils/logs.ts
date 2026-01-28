import { LogsModel, ILog } from "../models/logs.model";

type Args = {
  actorType: "user" | "admin" | "server";
  action: string;
  actorId: string;
  module:
    | "cases"
    | "statuses"
    | "formssections"
    | "servicelevels"
    | "countries"
    | "visatypes"
    | "servicetypes"
    | "shippings"
    | "configurations"
    | "promo"
    | "roles"
    | "admins"
    | "consultation"
    | "notices";
  moduleId?: string;
};

export const createLog = async ({
  actorType,
  action,
  module,
  moduleId,
  actorId,
}: Args) => {
  try {
    const newLog: ILog = {
      actorType,
      action,
      module,
    };
    if (actorType === "user") newLog.user = actorId;
    else if (actorType === "admin") newLog.user = actorId;
    await new LogsModel(newLog).save();
  } catch (error) {
    console.log(error);
  }
};
