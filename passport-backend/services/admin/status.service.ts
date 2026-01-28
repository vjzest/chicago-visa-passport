import mongoose from "mongoose";
import { StatusesModel } from "../../models/statuses.model";
import { ServiceResponse } from "../../types/service-response.type";
import { IStatus } from "../../typings";

export default class StatusService {
  private readonly model = StatusesModel;
  private readonly generateSafeKey = (str: string, needDigits?: boolean) => {
    let convertedStr = str.toLowerCase().replace(/\s+/g, "-");
    return needDigits
      ? convertedStr + Math.floor(Math.random() * 900) + 100
      : convertedStr;
  };

  async create(data: IStatus, parent?: string): Promise<ServiceResponse> {
    try {
      let key = this.generateSafeKey(data.title);

      while (await this.model.findOne({ key })) {
        key = this.generateSafeKey(data.title, true);
      }
      console.log("data", data);

      const level = parent ? 2 : 1;

      const existingStatus = await this.model.findOne({
        title: data.title,
        parent: parent || null,
      });
      if (existingStatus) {
        return {
          status: 400,
          success: false,
          message: "Status already exists",
        };
      }

      if (level === 1 && data.sortOrder !== undefined) {
        const existingStatus = await this.model.findOne({
          sortOrder: data.sortOrder,
          level: 1,
        });

        if (existingStatus) {
          await this.model.updateOne(
            { _id: existingStatus._id },
            { sortOrder: -1 } // Temporary sortOrder
          );

          data.sortOrder = data.sortOrder;

          await this.model.updateOne(
            { _id: existingStatus._id },
            { sortOrder: data.sortOrder + 1 } // Increment to avoid conflict
          );
        }
      }

      const status = await this.model.create({
        ...data,
        key,
        parent: parent || null,
        level,
      });

      return {
        status: 201,
        success: true,
        message: "Status created successfully",
        data: status,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll({
    onlyAllowed,
    allowedStatuses,
    showCaseCount,
    onlyAssigned,
    adminId,
  }: {
    onlyAllowed?: boolean;
    onlyAssigned?: boolean;
    showCaseCount?: boolean;
    allowedStatuses?: string[];
    adminId?: string | mongoose.Types.ObjectId;
  }): Promise<ServiceResponse<IStatus[]>> {
    try {
      if (showCaseCount) {
        const allowedStatusObjectIds = [];
        if (onlyAllowed && allowedStatuses) {
          for (const statusId of allowedStatuses) {
            const statusObjectId = new mongoose.Types.ObjectId(statusId);
            allowedStatusObjectIds.push(statusObjectId);
          }
        }
        const statuses = await this.model.aggregate([
          {
            $match: onlyAllowed
              ? { _id: { $in: allowedStatusObjectIds } }
              : { _id: { $exists: true } },
          },
          {
            $lookup: {
              from: "cases",
              let: {
                statusId: { $toString: "$_id" },
                statusLevel: "$level",
              },
              pipeline: [
                {
                  $addFields: {
                    statusStr: { $toString: "$caseInfo.status" },
                    subStatus1Str: {
                      $cond: {
                        if: { $ne: ["$caseInfo.subStatus1", null] },
                        then: { $toString: "$caseInfo.subStatus1" },
                        else: null,
                      },
                    },
                    subStatus2Str: {
                      $cond: {
                        if: { $ne: ["$caseInfo.subStatus2", null] },
                        then: { $toString: "$caseInfo.subStatus2" },
                        else: null,
                      },
                    },
                  },
                },
                {
                  $match: {
                    $expr: {
                      $switch: {
                        branches: [
                          {
                            case: { $eq: ["$$statusLevel", 1] },
                            then: { $eq: ["$statusStr", "$$statusId"] },
                          },
                          {
                            case: { $eq: ["$$statusLevel", 2] },
                            then: { $eq: ["$subStatus1Str", "$$statusId"] },
                          },
                          {
                            case: { $eq: ["$$statusLevel", 3] },
                            then: { $eq: ["$subStatus2Str", "$$statusId"] },
                          },
                        ],
                        default: false,
                      },
                    },
                  },
                },
                {
                  $match: onlyAssigned
                    ? {
                        "caseInfo.caseManager": new mongoose.Types.ObjectId(
                          adminId
                        ),
                      }
                    : {},
                },
              ],
              as: "caseCount",
            },
          },
          {
            $addFields: {
              caseCount: { $size: "$caseCount" },
            },
          },
          {
            $sort: { sortOrder: 1 },
          },
        ]);
        return {
          status: 200,
          success: true,
          message: "Statuses fetched successfully",
          data: statuses,
        };
      } else {
        let statuses;
        if (onlyAllowed) {
          statuses = await this.model
            .find({
              _id: { $in: allowedStatuses },
            })
            .sort({ sortOrder: 1 });
        } else {
          statuses = await this.model.find().sort({ sortOrder: 1 });
        }
        return {
          status: 200,
          success: true,
          message: "Statuses fetched successfully",
          data: statuses,
        };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAllParentStatus(): Promise<ServiceResponse<IStatus[]>> {
    try {
      const statuses = await this.model.find({ level: 1 });
      return {
        status: 200,
        success: true,
        message: "Statuses fetched successfully",
        data: statuses,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<ServiceResponse<IStatus | null>> {
    try {
      const status = await this.model.findById(id);
      if (!status) {
        return {
          status: 404,
          success: false,
          message: "Status not found",
        };
      }
      return {
        status: 200,
        success: true,
        message: "Status fetched successfully",
        data: status,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(
    id: string,
    data: Partial<IStatus>
  ): Promise<ServiceResponse<IStatus | null>> {
    try {
      // Retrieve the existing document to check its level
      const existingStatus = (await this.model.findById(id)) as IStatus | null;
      if (!existingStatus) {
        return {
          status: 404,
          success: false,
          message: "Status not found",
        };
      }

      const { level } = existingStatus;

      const isDupe = await this.model.findOne({
        title: data.title,
        _id: { $ne: existingStatus._id },
        parent: existingStatus.parent || null,
      });

      if (isDupe) {
        return {
          status: 400,
          success: false,
          message: "Status with same title already exists",
        };
      }

      // Only handle sortOrder for level 1 statuses
      if (level === 1 && data.sortOrder !== undefined) {
        // Get all level 1 statuses including the current one
        const allStatuses = (await this.model
          .find({
            level: 1,
          })
          .sort({ sortOrder: 1 })) as IStatus[];

        const requestedOrder = data.sortOrder;

        // Validate the target sort order
        const maxPossibleOrder = allStatuses.length;
        const validatedTargetOrder = Math.max(
          1,
          Math.min(requestedOrder, maxPossibleOrder)
        );

        // Create an array of status IDs in their new desired order
        let reorderedStatusIds = allStatuses.map((status) =>
          status._id.toString()
        );

        // Remove the current status from its position
        reorderedStatusIds = reorderedStatusIds.filter((sId) => sId !== id);

        // Insert the current status at its new position
        reorderedStatusIds.splice(validatedTargetOrder - 1, 0, id);

        // Create bulk update operations to assign sequential sort orders
        const updateOperations = reorderedStatusIds.map((statusId, index) => ({
          updateOne: {
            filter: { _id: statusId },
            update: { $set: { sortOrder: index + 1 } },
          },
        }));

        // Execute all updates in a single bulk operation
        if (updateOperations.length > 0) {
          await this.model.bulkWrite(updateOperations);
        }

        // Set the validated target sortOrder in the data object
        data.sortOrder = validatedTargetOrder;
      }

      const status = (await this.model.findByIdAndUpdate(
        id,
        { ...data },
        { new: true }
      )) as IStatus | null;

      if (!status) {
        return {
          status: 404,
          success: false,
          message: "Status not found",
        };
      }

      return {
        status: 200,
        success: true,
        message: "Status updated successfully",
        data: status,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id: string): Promise<ServiceResponse> {
    try {
      const status = await this.model.findByIdAndDelete(id);
      if (!status) {
        return {
          status: 404,
          success: false,
          message: "Status not found",
        };
      }
      return {
        status: 200,
        success: true,
        message: "Status deleted successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // substatus
  async findSubstatuses(
    parentId: string
  ): Promise<ServiceResponse<{ parent: IStatus; substatuses?: IStatus[] }>> {
    try {
      const parentStatus = await this.model
        .findById(parentId)
        .populate({ path: "parent", select: "title _id" });

      if (!parentStatus) {
        return {
          status: 404,
          success: false,
          message: "Parent status not found",
        };
      }

      const substatuses = await this.model.find({ parent: parentId });

      if (substatuses.length === 0) {
        return {
          status: 200,
          success: true,
          data: {
            parent: parentStatus,
          },
          message: "No substatuses found for the given parent status",
        };
      }

      return {
        status: 200,
        success: true,
        message: "Substatuses fetched successfully",
        data: {
          parent: parentStatus,
          substatuses: substatuses,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
