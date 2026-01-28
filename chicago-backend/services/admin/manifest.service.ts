import { PipelineStage } from "mongoose";
import { CasesModel } from "../../models/cases.model";
import { ServiceResponse } from "../../types/service-response.type";
import { getStatusId } from "../../utils/status";

export class AdminManifestService {
  private readonly casesModel = CasesModel;

  async getManifestRecords({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): ServiceResponse {
    try {
      const manifestedStatusId: string = await getStatusId("manifested");
      const pipeline: PipelineStage[] = [
        {
          $match: {
            $or: [
              { "caseInfo.status": manifestedStatusId },
              { "caseInfo.subStatus1": manifestedStatusId },
              { "caseInfo.subStatus2": manifestedStatusId },
            ],
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: (page - 1) * pageSize,
        },
        {
          $limit: pageSize,
        },
        {
          $project: {
            _id: 1,
            "applicantInfo.firstName": 1,
            "applicantInfo.lastName": 1,
            "applicantInfo.middleName": 1,
            "applicantInfo.dateOfBirth": 1,
            "contactInformation.email1": 1,
            departureDate: 1,
            "caseInfo.serviceLevel": 1,
            "caseInfo.serviceType": 1,
            "caseInfo.caseManager": 1,
            manifestRemarks: 1,
            caseNo: 1,
          },
        },
        {
          $lookup: {
            from: "servicetypes",
            localField: "caseInfo.serviceType",
            foreignField: "_id",
            as: "serviceType",
            pipeline: [
              {
                $project: {
                  serviceType: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$serviceType",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "servicelevels",
            localField: "caseInfo.serviceLevel",
            foreignField: "_id",
            as: "serviceLevel",
            pipeline: [
              {
                $project: {
                  serviceLevel: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$serviceLevel",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "admins",
            localField: "caseInfo.caseManager",
            foreignField: "_id",
            as: "caseManager",
            pipeline: [
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$caseManager",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];
      const manifestRecords = await this.casesModel.aggregate(pipeline);
      const totalRecords = await this.casesModel.countDocuments({
        $or: [
          { "caseInfo.status": manifestedStatusId },
          { "caseInfo.subStatus1": manifestedStatusId },
          { "caseInfo.subStatus2": manifestedStatusId },
        ],
      });
      return {
        success: true,
        message: "Manifest records retrieved successfully",
        data: {
          records: manifestRecords,
          total: totalRecords,
        },
        status: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateRemarks(caseId: string, remark: string): ServiceResponse {
    try {
      const caseData = await this.casesModel
        .findOne({ _id: caseId })
        .select("manifestRemarks");

      if (!caseData) {
        return {
          success: false,
          message: "Case not found",
          status: 400,
        };
      }

      caseData.manifestRemarks = remark;
      await caseData.save();

      return {
        success: true,
        message: "Manifest remarks updated successfully",
        status: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async searchCases({
    fullName,
    dateOfBirth,
    email,
  }: {
    fullName?: string;
    dateOfBirth?: string;
    email?: string;
  }): ServiceResponse {
    try {
      const excludedStatusIds = await Promise.all([
        getStatusId("refunded"),
        getStatusId("voided"),
        getStatusId("developer-cases"),
        getStatusId("complete-not-processed"),
      ]);

      const matchConditions: any = {
        submissionDate: { $exists: true, $ne: null },
        "caseInfo.status": { $nin: excludedStatusIds },
      };

      if (fullName) {
        const nameRegex = new RegExp(fullName, "i");
        matchConditions.$or = [
          { "applicantInfo.firstName": nameRegex },
          { "applicantInfo.middleName": nameRegex },
          { "applicantInfo.lastName": nameRegex },
        ];
      }

      if (dateOfBirth) {
        matchConditions["applicantInfo.dateOfBirth"] = dateOfBirth;
      }

      if (email) {
        matchConditions["contactInformation.email1"] = new RegExp(email, "i");
      }

      const pipeline: PipelineStage[] = [
        { $match: matchConditions },
        { $limit: 50 },
        {
          $project: {
            _id: 1,
            caseNo: 1,
            "applicantInfo.firstName": 1,
            "applicantInfo.middleName": 1,
            "applicantInfo.lastName": 1,
            "applicantInfo.dateOfBirth": 1,
            "contactInformation.email1": 1,
            "caseInfo.serviceType": 1,
          },
        },
        {
          $lookup: {
            from: "servicetypes",
            localField: "caseInfo.serviceType",
            foreignField: "_id",
            as: "caseInfo.serviceType",
            pipeline: [
              {
                $project: {
                  serviceType: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$caseInfo.serviceType",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      const cases = await this.casesModel.aggregate(pipeline);

      return {
        success: true,
        data: cases,
        status: 200,
        message: "Cases retrieved successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCaseById(caseId: string): ServiceResponse {
    try {
      const caseData = await this.casesModel
        .findById(caseId)
        .select({
          "applicantInfo.firstName": 1,
          "applicantInfo.lastName": 1,
          "applicantInfo.middleName": 1,
          "applicantInfo.dateOfBirth": 1,
          "caseInfo.serviceType": 1,
          "caseInfo.serviceLevel": 1,
          departureDate: 1,
          shippingInformation: 1,
          contactInformation: 1,
          caseNo: 1,
        })
        .populate({
          path: "caseInfo.serviceType",
          select: "serviceType",
        })
        .populate({
          path: "caseInfo.serviceLevel",
          select: "serviceLevel",
        });

      if (!caseData) {
        return {
          success: false,
          message: "Case not found",
          status: 404,
        };
      }

      return {
        success: true,
        message: "Case details retrieved successfully",
        data: caseData,
        status: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
