import { LogsModel, ILog, ILogDoc } from "../../models/logs.model";
import { ServiceResponse } from "../../types/service-response.type";
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
    | "serviceTypes"
    | "shippings"
    | "configurations"
    | "promo"
    | "roles"
    | "admins"
    | "consultation"
    | "AdditionalService"
    | "notices"
    | "processor"
    | "faqs"
    | "Country"
    | "Config"
    | "notices";
  moduleId?: string;
};
export default class LogsService {
  private readonly model = LogsModel;

  createLog = async ({
    actorType,
    action,
    module,
    moduleId,
    actorId,
  }: Args) => {
    try {
      const logData: ILog = {
        actorType,
        action,
        module,
      };
      if (actorType === "user") logData.user = actorId;
      else if (actorType === "admin") logData.admin = actorId;
      const newLog = new LogsModel(logData);
      await newLog.save();
      return {
        status: 200,
        success: true,
        message: "Log created successfully",
        data: newLog,
      };
    } catch (error) {
      console.log(error);
    }
  };

  async findAll(): ServiceResponse<ILogDoc[]> {
    try {
      const logs = await this.model
        .find()
        .populate("admin")
        .sort({ createdAt: -1 });
      return {
        status: 200,
        success: true,
        message: "Logs fetched successfully",
        data: logs,
      };
    } catch (error) {
      console.log({ "Error Fetching Logs": error });
      return {
        status: 500,
        success: false,
        message: "Error creating log",
        data: undefined,
      };
    }
  }
}
