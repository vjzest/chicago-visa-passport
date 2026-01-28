import mongoose from "mongoose";
import { CasesModel } from "../../models/cases.model";
import { ServiceResponse } from "../../types/service-response.type";
import AuthService from "../../services/user/auth.service";
import MailService from "../common/mail.service";
import { IRole, ROLE_FIELD_EXCLUSION } from "../../models/roles.model";
import FormsService from "./forms.service";
import { MessagesModel } from "../../models/messages.model";
import { StatusesModel } from "../../models/statuses.model";
import FedExUtil from "../../utils/fedex";
import { ServiceTypesModel } from "../../models/service-type.model";
import { AdditionalServicesModel } from "../../models/additional.service.model";

export default class CasesQueryService {
  private readonly casesModel = CasesModel;
  private readonly messagesModel = MessagesModel;
  private readonly serviceTypeModel = ServiceTypesModel;
  private readonly additionalServicesModel = AdditionalServicesModel;
  private readonly statusesModel = StatusesModel;

  formsService = new FormsService();
  mailService = new MailService();
  authService = new AuthService();
  fedexUtil = new FedExUtil();

  private getExcludedFields(roleAccess: IRole["viewCaseDetails"]) {
    const arr: string[] = [];
    for (const key of Object.keys(ROLE_FIELD_EXCLUSION)) {
      if (!roleAccess[key as keyof IRole["viewCaseDetails"]]) {
        if (typeof ROLE_FIELD_EXCLUSION[key] === "string") {
          arr.push(ROLE_FIELD_EXCLUSION[key]);
        } else {
          arr.push(...ROLE_FIELD_EXCLUSION[key]);
        }
      }
    }
    return arr;
  }

  private removeNestedProperty(obj: Record<any, any>, path: string[]) {
    if (path.length === 1) {
      delete obj[path[0] as any];
      return;
    }

    const [firstKey, ...remainingPath] = path;
    if (obj[firstKey as any] && typeof obj[firstKey] === "object") {
      this.removeNestedProperty(obj[firstKey], remainingPath);

      // Remove empty objects after deletion
      if (Object.keys(obj[firstKey]).length === 0) {
        delete obj[firstKey];
      }
    }
  }

  private removeProperties(
    doc: mongoose.Document | object,
    keysToRemove: string[]
  ) {
    const result = JSON.parse(JSON.stringify(doc)); // Clone document to avoid modifying the original

    keysToRemove.forEach((key) => {
      const path = key.split(".");
      this.removeNestedProperty(result, path);
    });

    return result;
  }

  async findAll({
    userRoleViewAccess,
    statusId,
    caseManagerId,
    page,
    pageSize,
    locationAccess,
  }: {
    userRoleViewAccess: IRole["viewCaseDetails"];
    statusId: string;
    caseManagerId?: string;
    page?: number;
    pageSize?: number;
    locationAccess?: IRole["viewCasesByLocation"];
  }): ServiceResponse<any> {
    try {
      const status = await this.statusesModel.findById(statusId);
      if (!status) throw new Error("Status not found");
      const excludedHeaders = this.getExcludedFields(userRoleViewAccess);
      let query: any = {
        $or: [
          { "caseInfo.status": statusId },
          { "caseInfo.subStatus1": statusId },
          { "caseInfo.subStatus2": statusId },
        ],
      };
      if (caseManagerId) {
        query = {
          ...query,
          "caseInfo.caseManager": caseManagerId,
        };
      }
      if (locationAccess) {
        const allowedLocations: string[] = [];
        locationAccess.forEach((value, key) => {
          if (value) {
            allowedLocations.push(key);
          }
        });
        query = {
          ...query,
          "caseInfo.processingLocation": { $in: [...allowedLocations, null] },
        };
      }

      console.log("excluded fields", excludedHeaders);
      const passportCardService = await this.additionalServicesModel
        .findOne({ title: "Passport Card" })
        .select("_id");
      const caseDocs = await this.casesModel
        .find(query)
        .populate([
          { path: "account", select: "firstName lastName email1 phone1" },
          { path: "caseInfo.status", select: "title" },
          { path: "caseInfo.caseManager", select: "firstName lastName" },
          { path: "caseInfo.serviceType", select: "serviceType" },
          { path: "caseInfo.serviceLevel", select: "serviceLevel" },
          { path: "caseInfo.processingLocation", select: "locationName" },
        ])
        .sort({ createdAt: -1 })
        .skip(page ? (page - 1) * (pageSize || 20) : 0)
        .limit(pageSize || 20)
        .select(
          "caseNo applicantInfo contactInformation caseInfo.status createdAt lastOpened submissionDate account caseInfo.caseManager caseInfo.serviceType caseInfo.serviceLevel caseInfo.additionalServices caseInfo.processingLocation isOfflineLink"
        )
        .lean()
        .then((docs) => {
          return docs.map((doc) => {
            const additionals = doc.caseInfo?.additionalServices;
            if (additionals?.length > 0) {
              for (const addi of additionals) {
                if (
                  addi.service.toString() ===
                  passportCardService?._id?.toString()
                ) {
                  return { ...doc, hasPassportCard: true };
                }
              }
            }
            return { ...doc, hasPassportCard: false };
          });
        });
      const processedCases = [];
      for (const caseItem of caseDocs) {
        const result = this.removeProperties(caseItem, excludedHeaders);
        processedCases.push(result);
      }
      const totalCases = await this.casesModel.countDocuments(query);
      const excludedFields: string[] = [];

      console.log("excluded fields", excludedFields);
      return {
        status: 200,
        success: true,
        message: "Cases fetched successfully",
        data: {
          excludedFields,
          cases: processedCases || [],
          count: caseDocs?.length || 0,
          totalCases,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async groupByAccounts(
    statusId: string,
    caseManagerId?: string,
    page?: number
  ): ServiceResponse<any> {
    try {
      const statusObjectId = new mongoose.Types.ObjectId(statusId);
      let matchStage: any = {
        $or: [
          { "caseInfo.status": statusObjectId },
          { "caseInfo.subStatus1": statusObjectId },
          { "caseInfo.subStatus2": statusObjectId },
        ],
      };

      if (caseManagerId) {
        matchStage = {
          ...matchStage,
          "caseInfo.caseManager": caseManagerId,
        };
      }

      const accounts = await this.casesModel.aggregate([
        {
          $match: matchStage,
        },
        {
          $group: {
            _id: "$account",
            caseCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "accounts",
            localField: "_id",
            foreignField: "_id",
            as: "account",
          },
        },
        {
          $unwind: "$account",
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$account", { caseCount: "$caseCount" }],
            },
          },
        },
        {
          $project: {
            password: 0,
            userkey: 0,
          },
        },
        {
          $skip: page ? (page - 1) * 20 : 0,
        },
        {
          $limit: 20,
        },
      ]);

      const totalAccounts = await this.casesModel
        .aggregate([
          {
            $match: matchStage,
          },
          {
            $group: {
              _id: "$account",
            },
          },
          {
            $count: "total",
          },
        ])
        .then((result) => result[0]?.total || 0);

      return {
        status: 200,
        success: true,
        message: "Accounts grouped successfully",
        data: {
          accounts: accounts || [],
          count: accounts?.length || 0,
          totalAccounts,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findByUserId(userId: string): ServiceResponse<any> {
    try {
      const cases = await this.casesModel
        .find({ account: userId })
        .populate([
          { path: "account", model: "accounts" },
          { path: "caseInfo.caseManager", model: "admins" },
          { path: "caseInfo.processingLocation", model: "shippings" },
          { path: "caseInfo.serviceType", model: "servicetypes" },
          { path: "caseInfo.status", model: "statuses" },
          { path: "caseInfo.subStatus1", model: "statuses" },
          { path: "caseInfo.subStatus2", model: "statuses" },
          { path: "caseInfo.serviceLevel", model: "servicelevels" },
          { path: "caseInfo.caseManager", model: "admins" },
        ])
        .select(["account", "caseInfo", "caseNo", "createdAt"]);

      if (!cases) {
        return {
          status: 404,
          success: false,
          message: "Cases not found",
          data: null,
        };
      }

      return {
        status: 200,
        success: true,
        message: "Cases fetched successfully",
        data: cases,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(
    id: string,
    userRoleViewAccess: IRole["viewCaseDetails"],
    statusAccess?: IRole["viewCasesByStatus"],
    locationAccess?: IRole["viewCasesByLocation"]
  ): ServiceResponse<any> {
    try {
      const query: any = { _id: id };
      if (statusAccess) {
        const allowedStatuses: string[] = [];
        statusAccess.forEach((value, key) => {
          if (value) {
            allowedStatuses.push(key);
          }
        });
        query.$or = [
          { "caseInfo.status": { $in: allowedStatuses } },
          { "caseInfo.subStatus1": { $in: allowedStatuses } },
          { "caseInfo.subStatus2": { $in: allowedStatuses } },
        ];
      }
      if (locationAccess) {
        const allowedLocations: string[] = [];
        locationAccess.forEach((value, key) => {
          if (value) {
            allowedLocations.push(key);
          }
        });
        query["caseInfo.processingLocation"] = {
          $in: [...allowedLocations, null],
        };
      }
      const caseDetail: any = await this.casesModel
        .findOne(query)
        .populate([
          { path: "account", model: "accounts" },
          { path: "caseInfo.caseManager", model: "admins" },
          { path: "caseInfo.processingLocation", model: "shippings" },
          { path: "caseInfo.serviceType", model: "servicetypes" },
          { path: "caseInfo.status", model: "statuses" },
          { path: "caseInfo.subStatus1", model: "statuses" },
          { path: "caseInfo.subStatus2", model: "statuses" },
          { path: "caseInfo.serviceLevel", model: "servicelevels" },
          { path: "caseInfo.caseManager", model: "admins" },
          {
            path: "caseInfo.additionalServices.service",
            model: "additionalservices",
          },
        ])
        .lean();

      if (!caseDetail) {
        return {
          status: 404,
          success: false,
          message: "Case not found",
          data: null,
        };
      }

      const caseStatus = await this.statusesModel.findById(
        caseDetail.caseInfo.status?._id
      );
      if (!caseStatus) {
        return {
          status: 404,
          success: false,
          message: "Case status not found",
          data: null,
        };
      }

      const excludedHeaders = this.getExcludedFields(userRoleViewAccess);
      const processedCase = this.removeProperties(caseDetail, excludedHeaders);

      // Construct account info with separate names if not excluded
      const account = {
        _id: processedCase?.account?._id,
        user: !excludedHeaders.includes("name")
          ? `${processedCase.account?.firstName || ""} ${processedCase.account?.middleName || ""
            } ${processedCase.account?.lastName || ""}`.trim()
          : undefined,
        email: !excludedHeaders.includes("account.email")
          ? processedCase.account?.email
          : undefined,
        phone: !excludedHeaders.includes("account.phone")
          ? processedCase.account?.phone
          : undefined,
      };

      // Construct simplifiedCaseInfo only if fields are not excluded
      const simplifiedCaseInfo = {
        caseManager:
          !excludedHeaders.includes("caseManager") &&
            processedCase.caseInfo?.caseManager
            ? `${processedCase.caseInfo.caseManager.firstName} ${processedCase.caseInfo.caseManager.lastName}`
            : undefined,
        serviceLevel: !excludedHeaders.includes("serviceLevel")
          ? processedCase.caseInfo?.serviceLevel?.serviceLevel
          : undefined,
        serviceTypes: !excludedHeaders.includes("serviceType")
          ? processedCase.caseInfo?.serviceType?.serviceType
          : undefined,
        processingLocation: !excludedHeaders.includes("processingLocation")
          ? processedCase.caseInfo?.processingLocation?.locationName
          : undefined,
      };

      const serviceType = await this.serviceTypeModel.findById(
        caseDetail.caseInfo.serviceType
      );

      const mappedDocuments = serviceType?.requiredDocuments
        .map((doc) => {
          const foundDoc = processedCase?.documents?.find(
            (d: any) => d.document?.toString() === doc._id.toString()
          );
          return foundDoc
            ? {
              ...foundDoc,
              title: doc.title,
            }
            : null;
        })
        .filter(Boolean);

      // Final response, only including existing properties
      const excludedFields: string[] = [];

      const response = {
        status: 200,
        success: true,
        message: "Case fetched successfully",
        data: {
          caseData: {
            case: simplifiedCaseInfo,
            account: account.user,
            documents: mappedDocuments,
            ...(processedCase || {}),
          },
          excludedFields,
        },
      };

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOneByCaseIdAndNo(
    caseId: string,
    caseNo: string
  ): ServiceResponse<any> {
    try {
      const caseDetail: any = await this.casesModel
        .findOne({ _id: new mongoose.Types.ObjectId(caseId) })
        .populate([
          { path: "account", model: "accounts" },
          { path: "caseInfo.caseManager", model: "admins" },
          {
            path: "caseInfo.serviceType",
            model: "servicetypes",
          },
          {
            path: "caseInfo.serviceLevel",
            model: "servicelevels",
            populate: {
              path: "loa",
              model: "loa",
            },
          },
          { path: "caseInfo.caseManager", model: "admins" },
        ])
        .lean();

      if (!caseDetail) {
        return {
          status: 404,
          success: false,
          message: "Case not found",
          data: null,
        };
      }

      // Return the simplified data
      return {
        status: 200,
        success: true,
        message: "Case fetched successfully",
        data: {
          case: caseDetail,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAllNew(): ServiceResponse<any> {
    try {
      const cases = await this.casesModel
        .find({ isOpened: false })
        .find({ isOpened: false })
        .populate([
          { path: "account", model: "accounts" },
          { path: "caseInfo.serviceLevel", model: "servicelevels" },
          { path: "caseInfo.status", model: "statuses" },
          { path: "caseInfo.subStatus1", model: "statuses" },
          { path: "caseInfo.subStatus2", model: "statuses" },
        ])
        .sort({ _id: -1 });

      return {
        status: 200,
        success: true,
        message: "Cases fetched successfully",
        data: cases,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async filterAllCases(filter: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    fullName: string;
    caseId: string;
    phone: string;
    email: string;
    lastFourOfCC: string;
    applicantName: string;
    statuses: string[];
    processingLocations: string[];
    onlyAssigned: boolean;
    adminId: string;
  }): ServiceResponse<any[]> {
    try {
      const {
        startDate,
        endDate,
        startTime,
        endTime,
        email,
        phone,
        caseId,
        lastFourOfCC,
        applicantName,
        statuses,
        processingLocations,
      } = filter;
      console.log("filter : ", filter);
      const statusObjectIdArr = statuses.map((status) => {
        return new mongoose.Types.ObjectId(status);
      });
      const passportCardService = await this.additionalServicesModel
        .findOne({ title: "Passport Card" })
        .select("_id");
      const processingLocationObjectIdArr = [
        ...processingLocations.map((processingLocation) => {
          return new mongoose.Types.ObjectId(processingLocation);
        }),
        null,
      ];

      const hasDateTimeFilters =
        startDate || endDate || filter.startTime || filter.endTime;

      // Only add the date matching stage if at least one date filter exists
      // Properly handle the EST to UTC conversion for date filtering
      const dateFilterStage = hasDateTimeFilters
        ? [
          {
            $match: {
              $expr: {
                $and: [
                  // If startDate exists, convert EST start datetime to UTC for comparison
                  ...(startDate
                    ? [
                      {
                        $gte: [
                          "$createdAt",
                          {
                            // Convert EST midnight to UTC (adds 5 hours)
                            $dateFromString: {
                              dateString: `${startDate}T${startTime || "00:00"
                                }:00.000-05:00`,
                            },
                          },
                        ],
                      },
                    ]
                    : []),

                  // If endDate exists, convert EST end datetime to UTC for comparison
                  ...(endDate
                    ? [
                      {
                        $lte: [
                          "$createdAt",
                          {
                            // Convert EST end of day to UTC (adds 5 hours, so it's the next day in UTC)
                            $dateFromString: {
                              dateString: `${endDate}T${endTime || "23:59"
                                }:59.999-05:00`,
                            },
                          },
                        ],
                      },
                    ]
                    : []),
                ],
              },
            },
          },
        ]
        : [];

      const aggregationPipeline = [
        ...dateFilterStage,
        {
          $match: {
            "caseInfo.caseManager": filter.onlyAssigned
              ? new mongoose.Types.ObjectId(filter.adminId)
              : { $exists: true },
            "caseInfo.status": { $in: statusObjectIdArr },
            "caseInfo.processingLocation": {
              $in: processingLocationObjectIdArr,
            },
          },
        },

        {
          $addFields: {
            caseNo: {
              $toString: "$caseNo",
            },
          },
        },

        {
          $match: {
            $and: [
              caseId
                ? {
                  $expr: {
                    $regexMatch: {
                      input: { $toString: "$caseNo" },
                      regex: caseId,
                      options: "i",
                    },
                  },
                }
                : {},
              applicantName
                ? {
                  $expr: {
                    $regexMatch: {
                      input: {
                        $concat: [
                          { $ifNull: ["$applicantInfo.firstName", ""] },
                          " ",
                          { $ifNull: ["$applicantInfo.middleName", ""] },
                          " ",
                          { $ifNull: ["$applicantInfo.lastName", ""] },
                        ],
                      },
                      regex: new RegExp(applicantName, "i"),
                    },
                  },
                }
                : {},

              phone
                ? {
                  "contactInformation.phone1": {
                    $regex: phone,
                    $options: "i",
                  },
                }
                : {},
              email
                ? {
                  "contactInformation.email1": {
                    $regex: email,
                    $options: "i",
                  },
                }
                : {},
              lastFourOfCC
                ? { "billingInfo.cardNumber": { $regex: lastFourOfCC + "$" } }
                : {},
            ],
          },
        },
        {
          $lookup: {
            from: "statuses",
            localField: "caseInfo.status",
            foreignField: "_id",
            as: "caseInfo.status",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.status",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "statuses",
            localField: "caseInfo.subStatus1",
            foreignField: "_id",
            as: "caseInfo.subStatus1",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.subStatus1",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "statuses",
            localField: "caseInfo.subStatus2",
            foreignField: "_id",
            as: "caseInfo.subStatus2",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.subStatus2",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "shippings",
            localField: "caseInfo.processingLocation",
            foreignField: "_id",
            as: "caseInfo.processingLocation",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.processingLocation",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "servicetypes",
            localField: "caseInfo.serviceType",
            foreignField: "_id",
            as: "caseInfo.serviceType",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.serviceType",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "servicelevels",
            localField: "caseInfo.serviceLevel",
            foreignField: "_id",
            as: "caseInfo.serviceLevel",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.serviceLevel",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "admins",
            localField: "caseInfo.caseManager",
            foreignField: "_id",
            as: "caseInfo.caseManager",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.caseManager",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            hasPassportCard: {
              $in: [
                passportCardService?._id,
                "$caseInfo.additionalServices.service",
              ],
            },
          },
        },
        {
          $project: {
            caseNo: 1,
            "account.email1": 1,
            "account.phone1": 1,
            "account.firstName": 1,
            "account.lastName": 1,
            "caseInfo.status.title": 1,
            "caseInfo.subStatus1.title": 1,
            "caseInfo.subStatus2.title": 1,
            applicantInfo: 1,
            contactInformation: 1,
            createdAt: 1,
            lastOpened: 1,
            submissionDate: 1,
            "caseInfo.processingLocation.locationName": 1,
            "caseInfo.serviceType.serviceType": 1,
            "caseInfo.serviceLevel.serviceLevel": 1,
            "caseInfo.caseManager.firstName": 1,
            "caseInfo.caseManager.lastName": 1,
            hasPassportCard: 1,
            isOfflineLink: 1,
          },
        },

        //project everything except
      ];
      const cases = await this.casesModel
        .aggregate(aggregationPipeline)
        .sort({ createdAt: -1 });

      return {
        status: 200,
        success: true,
        message: "Cases fetched successfully",
        data: cases,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async filter(filter: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    fullName: string;
    caseId: string;
    phone: string;
    email: string;
    lastFourOfCC: string;
    applicantName: string;
    statusId: string;
    page: number;
    pageSize: number;
  }): ServiceResponse<any[]> {
    try {
      const {
        startDate,
        endDate,
        startTime,
        endTime,
        email,
        phone,
        caseId,
        lastFourOfCC,
        applicantName,
        statusId,
      } = filter;
      const statusObjectId = new mongoose.Types.ObjectId(statusId);
      const passportCardService = await this.additionalServicesModel
        .findOne({ title: "Passport Card" })
        .select("_id");
      const hasDateTimeFilters =
        startDate || endDate || filter.startTime || filter.endTime;

      // Only add the date matching stage if at least one date filter exists
      // Properly handle the EST to UTC conversion for date filtering
      const dateFilterStage = hasDateTimeFilters
        ? [
          {
            $match: {
              $expr: {
                $and: [
                  // If startDate exists, convert EST start datetime to UTC for comparison
                  ...(startDate
                    ? [
                      {
                        $gte: [
                          "$createdAt",
                          {
                            // Convert EST midnight to UTC (adds 5 hours)
                            $dateFromString: {
                              dateString: `${startDate}T${startTime || "00:00"
                                }:00.000-05:00`,
                            },
                          },
                        ],
                      },
                    ]
                    : []),

                  // If endDate exists, convert EST end datetime to UTC for comparison
                  ...(endDate
                    ? [
                      {
                        $lte: [
                          "$createdAt",
                          {
                            // Convert EST end of day to UTC (adds 5 hours, so it's the next day in UTC)
                            $dateFromString: {
                              dateString: `${endDate}T${endTime || "23:59"
                                }:59.999-05:00`,
                            },
                          },
                        ],
                      },
                    ]
                    : []),
                ],
              },
            },
          },
        ]
        : [];
      // This dateFilterStage can now be added to your existing aggregation pipeline
      const aggregationPipeline = [
        ...dateFilterStage,
        {
          $match: {
            $or: [
              { "caseInfo.status": statusObjectId },
              { "caseInfo.subStatus1": statusObjectId },
              { "caseInfo.subStatus2": statusObjectId },
            ],
          },
        },

        {
          $addFields: {
            caseNo: {
              $toString: "$caseNo",
            },
          },
        },

        {
          $match: {
            $and: [
              caseId
                ? {
                  $expr: {
                    $regexMatch: {
                      input: { $toString: "$caseNo" },
                      regex: caseId,
                      options: "i",
                    },
                  },
                }
                : {},
              applicantName
                ? {
                  $expr: {
                    $regexMatch: {
                      input: {
                        $concat: [
                          { $ifNull: ["$applicantInfo.firstName", ""] },
                          " ",
                          { $ifNull: ["$applicantInfo.middleName", ""] },
                          " ",
                          { $ifNull: ["$applicantInfo.lastName", ""] },
                        ],
                      },
                      regex: new RegExp(applicantName, "i"),
                    },
                  },
                }
                : {},

              phone
                ? {
                  "contactInformation.phone1": {
                    $regex: phone,
                    $options: "i",
                  },
                }
                : {},
              email
                ? {
                  "contactInformation.email1": {
                    $regex: email,
                    $options: "i",
                  },
                }
                : {},
              lastFourOfCC
                ? { "billingInfo.cardNumber": { $regex: lastFourOfCC + "$" } }
                : {},
            ],
          },
        },
        {
          $lookup: {
            from: "statuses",
            localField: "caseInfo.status",
            foreignField: "_id",
            as: "caseInfo.status",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.status",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "statuses",
            localField: "caseInfo.subStatus1",
            foreignField: "_id",
            as: "caseInfo.subStatus1",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.subStatus1",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "statuses",
            localField: "caseInfo.subStatus2",
            foreignField: "_id",
            as: "caseInfo.subStatus2",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.subStatus2",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "shippings",
            localField: "caseInfo.processingLocation",
            foreignField: "_id",
            as: "caseInfo.processingLocation",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.processingLocation",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "servicetypes",
            localField: "caseInfo.serviceType",
            foreignField: "_id",
            as: "caseInfo.serviceType",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.serviceType",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "servicelevels",
            localField: "caseInfo.serviceLevel",
            foreignField: "_id",
            as: "caseInfo.serviceLevel",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.serviceLevel",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "admins",
            localField: "caseInfo.caseManager",
            foreignField: "_id",
            as: "caseInfo.caseManager",
          },
        },
        {
          $unwind: {
            path: "$caseInfo.caseManager",
            preserveNullAndEmptyArrays: true,
          },
        },
        //add field hasPassportCard boolean if passportCardService._id is included in caseInfo.additionalServices[].service
        {
          $addFields: {
            hasPassportCard: {
              $in: [
                passportCardService?._id,
                "$caseInfo.additionalServices.service",
              ],
            },
          },
        },
        {
          $project: {
            caseNo: 1,
            applicantInfo: 1,
            contactInformation: 1,
            createdAt: 1,
            lastOpened: 1,
            submissionDate: 1,
            "account.email1": 1,
            "account.phone1": 1,
            "account.firstName": 1,
            "account.lastName": 1,
            "caseInfo.status.title": 1,
            "caseInfo.subStatus1.title": 1,
            "caseInfo.subStatus2.title": 1,
            "caseInfo.processingLocation.locationName": 1,
            "caseInfo.serviceType.serviceType": 1,
            "caseInfo.serviceLevel.serviceLevel": 1,
            "caseInfo.caseManager.firstName": 1,
            "caseInfo.caseManager.lastName": 1,
            hasPassportCard: 1,
            isOfflineLink: 1,
          },
        },

        //pagination
        {
          $skip: (filter.page - 1) * filter.pageSize,
        },
        {
          $limit: filter.pageSize,
        },

        //project everything except
      ];
      const cases = await this.casesModel
        .aggregate(aggregationPipeline)
        .sort({ createdAt: -1 });

      return {
        status: 200,
        success: true,
        message: "Cases fetched successfully",
        data: cases,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllMessages(userId: string): ServiceResponse {
    try {
      const messages = await this.messagesModel
        .find({ user: userId })
        .populate("admin")
        .sort({ createdAt: 1 });
      return {
        status: 200,
        success: true,
        message: "Messages fetched successfully",
        data: messages,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
