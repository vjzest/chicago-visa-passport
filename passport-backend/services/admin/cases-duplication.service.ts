import mongoose from "mongoose";
import { CasesModel } from "../../models/cases.model";
import { ServiceResponse } from "../../types/service-response.type";
import AuthService from "../../services/user/auth.service";
import MailService from "../common/mail.service";
import FormsService from "./forms.service";
import FedExUtil from "../../utils/fedex";

interface DuplicatesWith {
  caseId: mongoose.Types.ObjectId;
  caseNo: string;
  matchReason: string[];
  confidence: number;
}

interface DuplicateInfo {
  isDuplicate: boolean;
  duplicatesWith: DuplicatesWith[];
  adminDecision: {
    status: "PENDING" | "CONFIRMED_DUPLICATE" | "NOT_DUPLICATE";
    decidedBy: mongoose.Types.ObjectId | null;
    decidedAt: Date | null;
    notes: string | null;
  };
  lastUpdatedBy: mongoose.Types.ObjectId | null;
  lastUpdatedAt: Date | null;
}

export default class CasesDuplicationService {
  private readonly casesModel = CasesModel;

  formsService = new FormsService();
  mailService = new MailService();
  authService = new AuthService();
  fedexUtil = new FedExUtil();

  async checkDuplicateCase(caseData: any): ServiceResponse {
    try {
      // Extract relevant fields for comparison
      const {
        applicantInfo: { dateOfBirth, lastName, firstName },
        contactInformation: { phone1, phone2 },
      } = caseData;

      // Validate required fields
      if (!dateOfBirth || !lastName || !phone1) {
        return {
          status: 400,
          success: false,
          message: "Missing required fields for duplicate check",
          data: null,
        };
      }

      // Normalize the phone numbers for comparison
      const normalizedPhone1 = phone1?.replace(/\D/g, "");
      const normalizedPhone2 = phone2?.replace(/\D/g, "");

      // Build the query for potential duplicates
      const duplicateCases: any = await this.casesModel
        .find({
          $or: [
            {
              "applicantInfo.dateOfBirth": dateOfBirth,
              "applicantInfo.lastName": {
                $regex: new RegExp(`^${lastName}$`, "i"),
              },
            },
            {
              $or: [
                {
                  "contactInformation.phone1": {
                    $in: [normalizedPhone1, phone1],
                  },
                },
                {
                  "contactInformation.phone2": {
                    $in: [normalizedPhone2, phone2],
                  },
                },
              ],
            },
          ],
        })
        .select(
          "_id caseNo applicantInfo contactInformation caseInfo.status createdAt"
        )
        .lean();

      // Calculate duplicate information
      const duplicatesWith: DuplicatesWith[] = duplicateCases?.map(
        (dc: any) => {
          const matchReasons: string[] = [];
          let confidenceScore = 0;

          // Check DOB match
          if (dc.applicantInfo?.dateOfBirth === dateOfBirth) {
            matchReasons.push("Date of Birth match");
            confidenceScore += 0.3;
          }

          // Check Last Name match
          if (
            dc?.applicantInfo?.lastName?.toLowerCase() ===
            lastName?.toLowerCase()
          ) {
            matchReasons.push("Last Name match");
            confidenceScore += 0.25;
          }

          // Check First Name match if available
          if (
            firstName &&
            dc?.applicantInfo?.firstName?.toLowerCase() ===
              firstName?.toLowerCase()
          ) {
            matchReasons.push("First Name match");
            confidenceScore += 0.15;
          }

          // Check Phone Numbers match
          const dcPhone1 = dc?.contactInformation?.phone1?.replace(/\D/g, "");
          const dcPhone2 = dc?.contactInformation?.phone2?.replace(/\D/g, "");

          if (
            normalizedPhone1 &&
            (normalizedPhone1 === dcPhone1 || normalizedPhone1 === dcPhone2)
          ) {
            matchReasons.push("Primary Phone match");
            confidenceScore += 0.3;
          } else if (
            normalizedPhone2 &&
            (normalizedPhone2 === dcPhone1 || normalizedPhone2 === dcPhone2)
          ) {
            matchReasons.push("Secondary Phone match");
            confidenceScore += 0.2;
          }

          return {
            caseId: dc?._id,
            caseNo: dc?.caseNo,
            matchReason: matchReasons,
            confidence: Number(confidenceScore?.toFixed(2)),
          };
        }
      );

      // Filter out low confidence matches and sort by confidence
      const significantDuplicates = duplicatesWith
        .filter((d) => d?.confidence > 0.3)
        .sort((a, b) => b?.confidence - a?.confidence);

      const duplicateInfo: DuplicateInfo = {
        isDuplicate: significantDuplicates?.length > 0.3,
        duplicatesWith: significantDuplicates,
        adminDecision: {
          status: "PENDING",
          decidedBy: null,
          decidedAt: null,
          notes: null,
        },
        lastUpdatedBy: null,
        lastUpdatedAt: null,
      };

      return {
        status: 200,
        success: true,
        message: duplicateInfo.isDuplicate
          ? "Potential duplicate cases found"
          : "No significant duplicate cases found",
        data: duplicateInfo,
      };
    } catch (error: any) {
      console.error("Error checking for duplicate cases:", error);
      return {
        status: 500,
        success: false,
        message: error.message || "Error checking for duplicate cases",
        data: null,
      };
    }
  }

  async fetchDuplicateCases(queryParams: {
    adminDecision?: "PENDING" | "CONFIRMED_DUPLICATE" | "NOT_DUPLICATE";
    confidence?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
  }): ServiceResponse {
    try {
      const {
        adminDecision,
        confidence = 0.3,
        // page = 1,
        // limit = 10,
        sortBy = "createdAt",
      } = queryParams;

      const query: any = {
        "potentialDuplicate.isDuplicate": true,
      };

      if (adminDecision) {
        query["potentialDuplicate.duplicatesWith.adminDecision.status"] =
          adminDecision;
      }

      query["potentialDuplicate.duplicatesWith.confidence"] = {
        $gte: confidence,
      };

      // const skip = (page - 1) * limit;

      const [cases] = await Promise.all([
        this.casesModel
          .find(query)
          .populate({
            path: "account",
            select: "firstName lastName email1",
            strictPopulate: false,
          })
          .populate({
            path: "potentialDuplicate.duplicatesWith.caseId",
            select: "caseNo applicantInfo contactInformation caseInfo.status",
            strictPopulate: false,
          })
          .populate({
            path: "potentialDuplicate.duplicatesWith.adminDecision.decidedBy",
            select: "firstName lastName _id username email",
            strictPopulate: false,
          })
          .populate({
            path: "potentialDuplicate.lastUpdatedBy",
            select: "firstName lastName",
            strictPopulate: false,
          })
          .select("-formInstance -courierNotes -passportFormLogs -notes")
          .sort({ [sortBy]: -1 })
          // .skip(skip)
          // .limit(limit)
          .lean(),
        this.casesModel.countDocuments(query),
      ]);

      return {
        status: 200,
        success: true,
        message: "Duplicate cases retrieved successfully",
        data: {
          cases,
          // pagination: {
          //   total,
          //   // page,
          //   // limit,
          //   pages: Math.ceil(total / limit),
          // },
        },
      };
    } catch (error: any) {
      console.error("Error fetching duplicate cases:", error);
      return {
        status: 500,
        success: false,
        message: error.message || "Error fetching duplicate cases",
        data: null,
      };
    }
  }

  async fetchDuplicateCaseById(caseId: string): ServiceResponse {
    try {
      if (!mongoose.Types.ObjectId.isValid(caseId)) {
        return {
          status: 400,
          success: false,
          message: "Invalid case ID format",
          data: null,
        };
      }

      let caseDetails: any = await this.casesModel
        .findById(caseId)
        .populate({
          path: "account",
          select: "firstName lastName email1",
          strictPopulate: false,
        })
        .populate({
          path: "potentialDuplicate.duplicatesWith.caseId",
          select: "caseNo applicantInfo contactInformation caseInfo.status",
          strictPopulate: false,
        })
        .populate({
          path: "potentialDuplicate.adminDecision.decidedBy",
          select: "firstName lastName _id username email",
          strictPopulate: false,
        })
        .populate({
          path: "potentialDuplicate.lastUpdatedBy",
          select: "firstName lastName _id username email",
          strictPopulate: false,
        })
        .populate({
          path: "caseInfo.status",
          select: "name",
          strictPopulate: false,
        })
        .populate({
          path: "caseInfo.caseManager",
          select: "firstName lastName email",
          strictPopulate: false,
        })
        .select(
          "-formInstance -additionalShippingOptions -notes -passportFormLogs"
        )
        .lean();

      if (!caseDetails) {
        return {
          status: 404,
          success: false,
          message: "Case not found",
          data: null,
        };
      }

      // If this case is marked as a duplicate, fetch additional details for duplicate cases
      if (caseDetails?.potentialDuplicate?.isDuplicate) {
        const duplicateCaseIds = caseDetails.potentialDuplicate.duplicatesWith
          .map((d: any) => d.caseId)
          .filter(Boolean);

        if (duplicateCaseIds.length > 0) {
          const relatedCases = await this.casesModel
            .find({
              _id: { $in: duplicateCaseIds },
            })
            .select(
              "caseNo applicantInfo contactInformation caseInfo.status createdAt"
            )
            .populate("caseInfo.status", "name")
            .lean();

          // Merge detailed information into duplicatesWith array
          caseDetails.potentialDuplicate.duplicatesWith =
            caseDetails?.potentialDuplicate?.duplicatesWith?.map(
              (duplicate: any) => {
                const relatedCase = relatedCases?.find(
                  (rc) => rc?._id?.toString() === duplicate?.caseId?.toString()
                );
                return {
                  ...duplicate,
                  caseDetails: relatedCase || null,
                };
              }
            );
        }
      }

      return {
        status: 200,
        success: true,
        message: "Case retrieved successfully",
        data: caseDetails,
      };
    } catch (error: any) {
      console.error("Error fetching case by ID:", error);
      return {
        status: 500,
        success: false,
        message: error.message || "Error fetching case details",
        data: null,
      };
    }
  }

  async confirmDuplicate(
    mainCaseId: string,
    relatedCaseIds: string[] = [],
    adminId: string,
    notes?: string
  ): ServiceResponse {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const currentDate = new Date();

      // Update main case
      const mainCase = await this.casesModel
        .findOneAndUpdate(
          { _id: mainCaseId },
          {
            $set: {
              "potentialDuplicate.isDuplicate": true,
              "potentialDuplicate.adminDecision": {
                status: "CONFIRMED_DUPLICATE",
                decidedBy: adminId,
                decidedAt: currentDate,
                notes: notes || "",
              },
              "potentialDuplicate.lastUpdatedBy": adminId,
              "potentialDuplicate.lastUpdatedAt": currentDate,
            },
            $push: {
              notes: {
                manualNote: notes || "",
                autoNote: `Confirmed as duplicate with cases: ${relatedCaseIds?.join(
                  ", "
                )}`,
                host: "admin",
                createdAt: currentDate,
              },
            },
          },
          { session, new: true }
        )
        .select("-formInstance -courierNotes -passportFormLogs -notes");

      if (!mainCase) {
        throw new Error("Main case not found");
      }

      await session.commitTransaction();

      return {
        status: 200,
        success: true,
        message: "Cases confirmed as duplicates",
        data: mainCase,
      };
    } catch (error: any) {
      await await session.abortTransaction();
      return {
        status: 500,
        success: false,
        message: error.message || "Error confirming duplicate cases",
        data: null,
      };
    } finally {
      await session.endSession();
    }
  }

  async markAsNotDuplicate(
    caseId: string,
    adminId: string,
    notes?: string
  ): ServiceResponse {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const currentDate = new Date();

      const updatedCase = await this.casesModel.findOneAndUpdate(
        { _id: caseId },
        {
          $set: {
            "potentialDuplicate.isDuplicate": false,
            "potentialDuplicate.adminDecision": {
              status: "NOT_DUPLICATE",
              decidedBy: adminId,
              decidedAt: currentDate,
              notes: notes || "",
            },
            "potentialDuplicate.lastUpdatedBy": adminId,
            "potentialDuplicate.lastUpdatedAt": currentDate,
          },
          $push: {
            notes: {
              manualNote: notes || "",
              autoNote: "Case marked as not duplicate by admin",
              host: "admin",
              createdAt: currentDate,
            },
          },
        },
        { session, new: true }
      );

      if (!updatedCase) {
        throw new Error("Case not found");
      }

      await session.commitTransaction();

      return {
        status: 200,
        success: true,
        message: "Case marked as not duplicate",
        data: updatedCase,
      };
    } catch (error: any) {
      await await session.abortTransaction();
      return {
        status: 500,
        success: false,
        message: error.message || "Error marking case as not duplicate",
        data: null,
      };
    } finally {
      await session.endSession();
    }
  }
}
