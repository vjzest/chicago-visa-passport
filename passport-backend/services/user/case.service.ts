import { CasesModel } from "../../models/cases.model";
import { ServiceResponse } from "../../types/service-response.type";
import { ServiceTypesModel } from "../../models/service-type.model";
import { MessagesModel } from "../../models/messages.model";
import { uploadToS3 } from "../../utils/s3";
import { ShippingsModel } from "../../models/shipping.models";
import { AdminsModel } from "../../models/admins.model";
import MailService from "../common/mail.service";
import ENV from "../../utils/lib/env.config";
import { deleteFromS3 } from "../../utils/s3";
import FedExUtil, { ShipmentDetails } from "../../utils/fedex";
import mongoose, { PipelineStage } from "mongoose";
import axios from "axios";
import { getStatusId } from "../../utils/status";
import { flattenObject } from "../../utils/object";
import IAdmin from "../../interfaces/admin.interface";
import { getRandomCaseNumber } from "./serial.service";
import { getFormattedDateAndTime } from "../../utils/date";
import { FormsSectionsModel } from "../../models/forms.model";
import { selectCaseManager } from "../../utils/lib/cm-load-balancer";
import { decrypt, encrypt } from "../../utils/lib/cryptography";
import { ServiceLevelsModel } from "../../models/service-level.model";
import { FedexPackagesModel } from "../../models/fedex-packages.model";

export default class CaseService {
  private readonly casesModel = CasesModel;
  private readonly serviceTypeModel = ServiceTypesModel;
  private readonly serviceLevelsModel = ServiceLevelsModel;
  private readonly messagesModel = MessagesModel;
  private readonly shippingModel = ShippingsModel;
  private readonly adminsModel = AdminsModel;
  private readonly fedexUtil = new FedExUtil();

  private readonly getFileFromUrl = async (url: string) => {
    const response = await axios({
      url: url,
      method: "GET",
      responseType: "arraybuffer",
    });

    return {
      buffer: Buffer.from(response.data),
      contentType: response.headers["content-type"],
    };
  };
  mailService = new MailService();

  async findContingentCase(caseId: string): ServiceResponse {
    try {
      let decryptedCaseId;
      if (mongoose.Types.ObjectId.isValid(caseId)) {
        decryptedCaseId = caseId;
      } else {
        decryptedCaseId = decrypt(caseId);
      }
      const contingentStatusId = await getStatusId("contingent");
      const caseDetails = await this.casesModel
        .findOne({
          _id: decryptedCaseId,
          "caseInfo.status": contingentStatusId,
        })
        .select("caseInfo applicantInfo contactInformation")
        .lean();
      if (!caseDetails) {
        return {
          success: false,
          message: "Case not found",
          status: 400,
        };
      }
      if (caseDetails?.isAccessible) {
        return {
          success: false,
          message: "Case is already accessible",
          status: 400,
        };
      }
      return {
        success: true,
        message: "Contingent case found",
        status: 200,
        data: { ...caseDetails, _id: encrypt(caseId) },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createOrUpdateContingentCase(
    data: any,
    caseId: string
  ): ServiceResponse {
    try {
      if (!data) {
        return {
          status: 400,
          message: "No data provided",
          success: false,
        };
      }

      const contingentStatusId = await getStatusId("contingent");
      if (caseId) {
        let decryptedCaseId;
        let encryptedCaseId;
        if (mongoose.Types.ObjectId.isValid(caseId)) {
          decryptedCaseId = caseId;
          encryptedCaseId = encrypt(caseId);
        } else {
          decryptedCaseId = decrypt(caseId);
          encryptedCaseId = caseId;
        }
        await this.casesModel.updateOne(
          {
            _id: decryptedCaseId,
            isAccessible: false,
            "caseInfo.status": contingentStatusId,
          },
          {
            $set: flattenObject(data),
          }
        );

        return {
          success: true,
          message: "Updated case successfully",
          status: 200,
          data: {
            caseId: encryptedCaseId,
          },
        };
      } else {
        // Check if case already exists based on applicant info
        const { applicantInfo, contactInformation, caseInfo } = data;
        if (
          applicantInfo?.firstName &&
          applicantInfo?.lastName &&
          contactInformation?.email1
        ) {
          const firstName = applicantInfo.firstName.trim();
          const lastName = applicantInfo.lastName.trim();
          const email = contactInformation.email1.trim();

          // Only proceed with search if we have valid values (at least 2 chars for names)
          if (
            firstName.length >= 2 &&
            lastName.length >= 2 &&
            email.length > 0
          ) {
            const existingCase = await this.casesModel
              .findOne({
                "applicantInfo.firstName": new RegExp(firstName, "i"),
                "applicantInfo.lastName": new RegExp(lastName, "i"),
                "contactInformation.email1": email,
                "caseInfo.serviceType": caseInfo.serviceType,
                "caseInfo.status": contingentStatusId,
              })
              .select("_id");

            if (existingCase) {
              // Update the existing case instead of creating a new one
              await this.casesModel.updateOne(
                { _id: existingCase._id },
                { $set: flattenObject(data) }
              );
              const encryptedCaseId = encrypt(existingCase?._id?.toString());

              return {
                success: true,
                message: "Updated existing case successfully",
                status: 200,
                data: {
                  caseId: encryptedCaseId,
                },
              };
            }
          }
        }

        // Proceed with creating new case if no existing case found
        const caseNo = await getRandomCaseNumber();
        let selectedManager: Omit<IAdmin, "role"> | null = null;
        if (!selectedManager) {
          selectedManager = await selectCaseManager();
        }
        const forms = await FormsSectionsModel.findOne({
          id: "passport-application-forms",
        });
        const createdCase = await this.casesModel.create({
          ...data,
          caseNo,
          caseInfo: {
            ...(data.caseInfo ?? {}),
            status: await getStatusId("contingent"),
            caseManager: selectedManager?._id,
          },
          formInstance: forms?.forms,
          isAccessible: false,
          notes: [
            {
              manualNote: "",
              autoNote: `Case created on ${getFormattedDateAndTime(new Date(), {
                showYear: true,
              })} `,
              host: "system",
              createdAt: new Date(),
            },
          ],
        });
        const encryptedCaseId = encrypt(createdCase?._id?.toString());
        return {
          message: "Contingent case created",
          success: true,
          status: 200,
          data: {
            caseId: encryptedCaseId,
          },
        };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(accountId: string): ServiceResponse<any[]> {
    try {
      // Find all cases for the given account
      const pipeline: PipelineStage[] = [
        {
          $match: {
            account: accountId,
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
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "passportforms",
            localField: "_id",
            foreignField: "caseId",
            as: "passportFormDocs",
          },
        },
        {
          $addFields: {
            hasStartedPassportForm: {
              $gt: [{ $size: "$passportFormDocs" }, 0],
            },
          },
        },
        {
          $project: {
            caseInfo: 1,
            applicantInfo: 1,
            caseNo: 1,
            createdAt: 1,
            reviewStage: 1,
            docReviewStatus: 1,
            applicationReviewStatus: 1,
            hasStartedPassportForm: 1,
            submissionDate: 1,
            isAccessible: 1,
          },
        },
      ];
      const cases = await this.casesModel.aggregate(pipeline);

      if (!cases || cases.length === 0) {
        return {
          status: 400,
          success: false,
          message: "No cases found for this account",
        };
      }

      return {
        status: 200,
        success: true,
        message: "Cases and applications fetched successfully",
        data: cases,
      };
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }

  async findOne(accountId: string, caseId: string): Promise<ServiceResponse> {
    try {
      const caseData = await this.casesModel
        .findOne({ _id: caseId, account: accountId })
        .populate([
          { path: "caseInfo.caseManager", model: "admins" },
          {
            path: "caseInfo.serviceLevel",
            model: "servicelevels",
            populate: {
              path: "loa",
              model: "loa",
            },
          },
          { path: "caseInfo.serviceType", model: "servicetypes" },
          { path: "caseInfo.processingLocation", model: "shippings" },
        ]);

      if (!caseData) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }

      return {
        status: 200,
        success: true,
        message: "Case and applications fetched successfully",
        data: {
          caseData,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updatePassportFormUrl(
    caseId: string,
    pdfUrl: string
  ): Promise<ServiceResponse> {
    try {
      // Basic URL validation
      const urlPattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
          "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
          "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      ); // fragment locator

      if (!urlPattern.test(pdfUrl)) {
        return {
          status: 400,
          success: false,
          message: "Invalid URL format",
        };
      }

      // Find the existing case to check if there is already a passport form URL
      const existingCase = await this.casesModel.findOne({ _id: caseId });
      if (!existingCase) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }

      // Check if there's an existing passport form URL and delete it from S3
      if (existingCase.passportFormUrl) {
        try {
          await deleteFromS3(existingCase.passportFormUrl);
        } catch (deleteError) {
          console.error(
            "Error deleting old passport form from S3:",
            deleteError
          );
          return {
            status: 500,
            success: false,
            message: "Failed to delete the old passport form from S3",
          };
        }
      }

      const caseData = await this.casesModel.findOneAndUpdate(
        { _id: caseId },
        { passportFormUrl: pdfUrl },
        { new: true }
      );

      if (!caseData) {
        return {
          status: 400,
          success: false,
          message: "Failed to update the passport form URL",
        };
      }

      return {
        status: 200,
        success: true,
        message: "Passport form URL updated successfully",
        data: {
          caseData,
        },
      };
    } catch (error) {
      console.error("Error updating passport form URL:", error);
      return {
        status: 500,
        success: false,
        message: "An error occurred while updating the passport form URL",
      };
    }
  }

  async getRequiredDocuments(caseId: string): ServiceResponse {
    try {
      const caseDoc = await this.casesModel
        .findById(caseId)
        .select("caseInfo applicantInfo")
        .lean();

      if (!caseDoc) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }

      const visaTypeId = caseDoc?.caseInfo?.serviceType;
      const serviceType = await this.serviceTypeModel
        .findById(visaTypeId)
        .lean();

      if (!serviceType) {
        return {
          status: 400,
          success: false,
          message: "Service type not found",
        };
      }

      const silentKey = serviceType.silentKey;
      let requiredDocuments = serviceType?.requiredDocuments;

      // Handle child passport based on age
      if (silentKey === "child-passport") {
        const dateOfBirth = caseDoc?.applicantInfo?.dateOfBirth;

        if (dateOfBirth) {
          // Parse MM/DD/YYYY format
          const birthDate = new Date(dateOfBirth);
          const currentDate = new Date();

          // Calculate age in years
          let age = currentDate.getFullYear() - birthDate.getFullYear();
          const monthDiff = currentDate.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          // Use requiredDocuments2 for 16 and above, requiredDocuments for under 16
          if (age >= 16 && serviceType?.requiredDocuments2) {
            requiredDocuments = serviceType.requiredDocuments2;
          }
        }
      }
      // Handle passport renewal and passport name change based on service level speed
      else if (
        silentKey === "passport-renewal" ||
        silentKey === "passport-name-change"
      ) {
        const serviceLevelId = caseDoc?.caseInfo?.serviceLevel;

        if (serviceLevelId) {
          try {
            const serviceLevel = await this.serviceLevelsModel
              .findById(serviceLevelId)
              .select("speedInWeeks")
              .lean();

            if (serviceLevel?.speedInWeeks) {
              // Use requiredDocuments2 for faster services (> 3 weeks), requiredDocuments for slow services (<= 3 weeks)
              if (
                serviceLevel.speedInWeeks > 3 &&
                serviceType?.requiredDocuments2
              ) {
                requiredDocuments = serviceType.requiredDocuments2;
              }
            }
          } catch (serviceLevelError) {
            console.warn("Error fetching service level:", serviceLevelError);
            // Continue with default requiredDocuments if service level fetch fails
          }
        }
      }

      return {
        status: 200,
        success: true,
        message: "Required documents fetched successfully",
        data: requiredDocuments,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllMessages(caseId: string): ServiceResponse {
    try {
      const messages = await this.messagesModel
        .find({ case: caseId })
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

  async submitReviewRequest(
    caseId: string,
    fileGroup: { [key: string]: Express.Multer.File[] }
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const caseDoc = await this.casesModel
        .findById(caseId)
        .select(
          "docReviewStatus documents applicantInfo reviewStage _id caseInfo"
        );
      if (!caseDoc) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }
      if (
        caseDoc.docReviewStatus !== "pending" &&
        caseDoc.docReviewStatus !== "rejected"
      ) {
        return {
          status: 400,
          success: false,
          message: "Case is already ongoing or approved",
        };
      }

      const docObjects: {
        document: string | mongoose.Types.ObjectId;
        urls: string[];
        isVerified: boolean;
      }[] = caseDoc.documents ?? [];

      const serviceType = await this.serviceTypeModel
        .findById(caseDoc?.caseInfo?.serviceType)
        .select("requiredDocuments requiredDocuments2 silentKey");
      if (!serviceType) {
        return {
          status: 400,
          success: false,
          message: "Service type not found",
        };
      }
      const silentKey = serviceType.silentKey;
      let requiredDocuments = serviceType?.requiredDocuments;

      // Handle child passport based on age
      if (silentKey === "child-passport") {
        const dateOfBirth = caseDoc?.applicantInfo?.dateOfBirth;

        if (dateOfBirth) {
          // Parse MM/DD/YYYY format
          const birthDate = new Date(dateOfBirth);
          const currentDate = new Date();

          // Calculate age in years
          let age = currentDate.getFullYear() - birthDate.getFullYear();
          const monthDiff = currentDate.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          // Use requiredDocuments2 for 16 and above, requiredDocuments for under 16
          if (age >= 16 && serviceType?.requiredDocuments2) {
            requiredDocuments = serviceType.requiredDocuments2;
          }
        }
      }
      // Handle passport renewal and passport name change based on service level speed
      else if (
        silentKey === "passport-renewal" ||
        silentKey === "passport-name-change"
      ) {
        const serviceLevelId = caseDoc?.caseInfo?.serviceLevel;

        if (serviceLevelId) {
          try {
            const serviceLevel = await this.serviceLevelsModel
              .findById(serviceLevelId)
              .select("speedInWeeks")
              .lean();

            if (serviceLevel?.speedInWeeks) {
              // Use requiredDocuments2 for faster services (> 3 weeks), requiredDocuments for slow services (<= 3 weeks)
              if (
                serviceLevel.speedInWeeks > 3 &&
                serviceType?.requiredDocuments2
              ) {
                requiredDocuments = serviceType.requiredDocuments2;
              }
            }
          } catch (serviceLevelError) {
            console.warn("Error fetching service level:", serviceLevelError);
            // Continue with default requiredDocuments if service level fetch fails
          }
        }
      }

      const uploadProcesses: Promise<void>[] =
        requiredDocuments.map(async (doc) => {
          if (
            ["ppt-form", "Passport Application"].includes(doc.silentKey!) &&
            !["passport-name-change", "passport-renewal"].includes(
              serviceType.silentKey
            )
          ) {
            return;
          }
          if (fileGroup[doc._id]?.length) {
            // Process documents that have files or are optional
            // Handle documents with files to upload
            const urls: string[] = [];
            const uploadProcessesSub =
              fileGroup[doc._id]?.map(async (file) => {
                const { url } = await uploadToS3(
                  file.buffer,
                  file.originalname,
                  file.mimetype,
                  `user-documents/${caseId}`
                );
                urls.push(url);
              }) ?? [];
            await Promise.all(uploadProcessesSub);

            // Remove existing non-verified entry for this document type
            const existingIndex = docObjects.findIndex(
              (cd) => String(cd.document) === String(doc._id)
            );
            if (existingIndex !== -1) {
              docObjects.splice(existingIndex, 1);
            }

            // Add new document entry
            docObjects.push({
              document: doc._id,
              urls,
              isVerified: false,
            });
          } else {
            // Handle optional documents or documents without files
            const existingDocIndex = docObjects.findIndex(
              (cd) => String(cd.document) === String(doc._id)
            );

            if (existingDocIndex === -1) {
              // Add optional document if not already exists
              docObjects.push({
                document: doc._id,
                urls: [],
                isVerified: false,
              });
            }
          }
        }) ?? [];

      await Promise.all(uploadProcesses);

      caseDoc.documents = docObjects as any;
      if (caseDoc.reviewStage === "documents") {
        caseDoc.docReviewStatus = "ongoing";
        await this.recordAction(
          caseDoc._id,
          `Required documents uploaded and submitted for review`,
          session
        );
      } else {
        await this.recordAction(
          caseDoc._id,
          `Required documents uploaded beforehand`,
          session
        );
      }

      await caseDoc.save({ session });
      await session.commitTransaction();
      return {
        status: 200,
        success: true,
        message:
          caseDoc.reviewStage === "documents"
            ? "Review request submitted successfully"
            : "Documents uploaded successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }
  // user updating their tracking id
  async updatedTrackingId(
    caseId: string,
    tracking: { id: string; note: string; createdAt?: string | Date },
    processingLocation: any
  ) {
    try {
      const caseDoc = await this.casesModel.findById(caseId);
      if (!caseDoc) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }

      if (caseDoc.docReviewStatus !== "approved") {
        return {
          status: 400,
          success: false,
          message: "Case not approved",
        };
      }

      const trackingData = { ...tracking, createdAt: new Date() };

      if (!caseDoc.additionalShippingOptions) {
        caseDoc.additionalShippingOptions = {
          inboundShippingLabel: "",
          outboundShippingLabel: "",
          firstMorningOvernight: false,
          saturdayDelivery: false,
          extraShipping: false,
          inboundTrackingId: trackingData,
          outboundTrackingId: { id: "", createdAt: new Date() },
          outbound2TrackingId: { id: "", createdAt: new Date() },
          outbound3TrackingId: { id: "", createdAt: new Date() },
        };
        if (tracking?.id)
          caseDoc.additionalShippingOptions.inBoundStatus = "sent";
      } else {
        caseDoc.additionalShippingOptions.inboundTrackingId = trackingData;
        if (processingLocation) {
          caseDoc.caseInfo.processingLocation = processingLocation;
        }
        if (tracking?.id)
          caseDoc.additionalShippingOptions.inBoundStatus = "sent";
      }

      const caseManagerId = caseDoc.caseInfo?.caseManager;
      const caseManager = await this.adminsModel.findById(caseManagerId);
      if (!caseManager) {
        return {
          status: 400,
          success: false,
          message: "Case manager not found",
        };
      }
      const name = caseManager?.firstName + " " + caseManager?.lastName;

      let emailContent;
      if (tracking?.id) {
        const currentLocation = await this.shippingModel.findById(
          processingLocation
        );

        caseDoc.notes.push({
          manualNote: "",
          autoNote: `Tracking ID updated: ${tracking?.id}, email sent to ${caseManager?.email}`,
          host: "user",
          createdAt: new Date(),
        });

        emailContent = `
        <h2 style="color: #5bc0de;">Tracking ID Update Notification</h2>
        <p>Dear ${name},</p>
        <p>The applicant updated the tracking information for documents.</p>
        <p><strong>Updated Tracking ID:</strong> ${tracking?.id}</p>
        <p><strong>Processing Location:</strong> ${currentLocation?.locationName}</p>
        <p><strong>Note:</strong> ${tracking?.note}</p>
      `;
      } else {
        caseDoc.notes.push({
          manualNote: "",
          autoNote: `Tracking ID cleared: ${tracking?.id}, email sent to ${caseManager?.email}`,
          host: "user",
          createdAt: new Date(),
        });

        emailContent = `
        <h2 style="color: #5bc0de;">Tracking ID Cleared Notification</h2>
        <p>Dear ${name},</p>
        <p>The applicant cleared the tracking ID for the documents.</p>
      `;
      }

      const data = {
        from: ENV.FROM_EMAIL,
        to: caseManager?.email,
        fullName: name,
        subject: "Tracking ID Update Notification",
        htmlContent: emailContent,
      };

      await this.mailService.sendEmailText(data, caseId);
      await caseDoc.save();

      return {
        status: 200,
        success: true,
        message: "Tracking ID updated successfully",
        data: caseDoc,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async undoCancellationRequest(caseId: string): ServiceResponse {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const caseDoc = await this.casesModel.findById(caseId);
      if (!caseDoc) {
        return {
          status: 404,
          success: false,
          message: "Application not found",
        };
      }

      caseDoc.cancellation = {
        status: "none",
        note: "",
        date: new Date(),
      };

      await caseDoc.save({ session });
      await this.recordAction(caseId, "Undo cancellation request", session);
      await session.commitTransaction();
      return {
        status: 200,
        success: true,
        message: "Cancellation request removed successfully",
        data: caseDoc,
      };
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async makeCancellationRequest(caseId: string, note: string): ServiceResponse {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const caseDoc = await this.casesModel
        .findById(caseId)
        // .select("contactInformation account")
        .populate("account");
      if (!caseDoc) {
        return {
          status: 404,
          success: false,
          message: "Application not found",
        };
      }

      caseDoc.cancellation = {
        status: "requested",
        note,
        date: new Date(),
      };

      await caseDoc.save({ session });
      //@ts-ignore
      const { firstName, lastName, middleName, consentToUpdates } =
        caseDoc.account;
      if (consentToUpdates) {
        const email1 = caseDoc.contactInformation?.email1!;
        const emailContent = `
        <h2 style="color: #5bc0de;">Cancellation Request Submittted</h2>
        <p>Dear ${firstName + " " + lastName},</p>
        <p>Your request to cancel your application has been successfully submitted</p>
        <p>Dont worry if this was a mistake. You can undo the cancellation request from your Client Portal</p>
      `;
        await this.mailService.sendEmailText(
          {
            to: email1,
            fullName: `${firstName} ${lastName}`,
            subject: "Cancellation Request Submittted",
            htmlContent: emailContent,
          },
          caseId
        );
      }
      await this.recordAction(
        caseId,
        "Submitted cancellation request",
        session
      );
      await session.commitTransaction();
      return {
        status: 200,
        success: true,
        message: "Cancellation request submitted successfully",
        data: caseDoc,
      };
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async confirmInboundShipment(caseId: string, note: string): ServiceResponse {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const caseDoc = await this.casesModel
        .findById(caseId)
        // .select([
        //   "account",
        //   "shippingInformation",
        //   "additionalShippingOptions",
        //   "caseInfo",
        // ])
        .populate("account");
      if (!caseDoc) {
        return {
          status: 404,
          success: false,
          message: "Application not found",
        };
      }
      const processingLocation = await this.shippingModel
        .findById(caseDoc?.caseInfo?.processingLocation)
        .session(session);
      if (!processingLocation) {
        throw new Error("Processing location not found");
      }
      const shippingData: ShipmentDetails = {
        shipper: {
          contact: {
            //@ts-ignore
            personName: `${caseDoc?.account?.firstName} ${caseDoc?.account?.lastName}`,
            companyName: "NONE",
            //@ts-ignore
            phoneNumber: caseDoc.contactInformation?.phone1!,
          },
          address: {
            //@ts-ignore
            streetLines: [caseDoc?.shippingInformation?.streetAddress],
            //@ts-ignore
            city: caseDoc?.shippingInformation?.city,
            //@ts-ignore
            stateOrProvinceCode: caseDoc?.shippingInformation?.state,
            //@ts-ignore
            postalCode: caseDoc?.shippingInformation?.zip,
            countryCode: "US",
          },
        },
        recipients: [
          {
            contact: {
              personName: processingLocation.authorisedPerson,
              companyName: processingLocation.company,
              phoneNumber: "2024749999",
            },
            address: {
              streetLines: [processingLocation.address],
              city: processingLocation.city,
              stateOrProvinceCode: processingLocation.state,
              postalCode: processingLocation.zipCode,
              countryCode: "US",
            },
          },
        ],
        packageDetails: {
          weight: {
            units: "LB",
            value: 1,
          },
          dimensions: {
            length: 12.5,
            width: 12.5,
            height: 9.5,
            units: "IN",
          },
        },
      };
      const fedexResponse = await this.fedexUtil.createShipment(shippingData);
      caseDoc.additionalShippingOptions?.inBoundStatus;
      if (!caseDoc.additionalShippingOptions) {
        caseDoc.additionalShippingOptions = {
          inboundShippingLabel: "",
          outboundShippingLabel: "",
          firstMorningOvernight: false,
          saturdayDelivery: false,
          extraShipping: false,
          inboundTrackingId: {
            id: "",
            note: "",
            createdAt: new Date(),
          },
          outboundTrackingId: { id: "", createdAt: new Date() },
          outbound2TrackingId: { id: "", createdAt: new Date() },
          outbound3TrackingId: { id: "", createdAt: new Date() },
        };
      }
      caseDoc.additionalShippingOptions.inBoundStatus = "sent";
      caseDoc.additionalShippingOptions.inboundTrackingId = {
        id: fedexResponse?.trackingNumber,
        note,
        createdAt: new Date(),
      };
      const { buffer: fedexLabelBuffer, contentType: fedexLabelContentType } =
        await this.getFileFromUrl(fedexResponse?.labelUrl);
      console.log("buffer", fedexLabelBuffer.length);
      console.log("contentType", fedexLabelContentType);
      const labelUploadResult = await uploadToS3(
        fedexLabelBuffer,
        "fedex-label-" + caseId,
        fedexLabelContentType,
        "fedex-labels"
      );
      const inboundShipmentStatusId = await getStatusId("inbound-shipment");
      caseDoc.caseInfo.status = inboundShipmentStatusId as any;
      caseDoc.additionalShippingOptions.inboundShippingLabel =
        labelUploadResult.url;

      await caseDoc.save({ session });

      const newFedexPackage = new FedexPackagesModel({
        trackingNumber: fedexResponse?.trackingNumber,
        case: caseId,
        expectedDate: new Date(fedexResponse?.deliveryDate),
        labelUrl: labelUploadResult.url,
      });
      await newFedexPackage.save();

      await this.recordAction(
        caseId,
        "Inbound shipment confirmed and shipping label generated with tracking number : " +
          fedexResponse?.trackingNumber,
        session
      );
      await session.commitTransaction();
      return {
        success: true,
        message: "Inbound shipment confirmed successfully",
        status: 200,
        data: fedexResponse,
      };
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async recordAction(
    caseId: string | mongoose.Types.ObjectId,
    note: string,
    session?: mongoose.ClientSession
  ): ServiceResponse {
    await this.casesModel.updateOne(
      { _id: caseId },
      {
        $push: {
          actionNotes: {
            note: note,
            createdAt: new Date(),
          },
        },
      },
      { session }
    );
    return {
      status: 200,
      success: true,
      message: "Action recorded successfully",
    };
  }

  async makeCallbackRequest(caseId: string, note: string): ServiceResponse {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const caseDoc = await this.casesModel.findById(caseId).select("_id");
      if (!caseDoc) {
        return {
          status: 404,
          success: false,
          message: "Application not found",
        };
      }
      const messagesStatusId = await getStatusId("messages");
      await this.casesModel.updateOne(
        { _id: caseId },
        {
          $push: {
            notes: {
              autoNote: `Client requested for a callback${
                note ? ` with message : "${note}"` : ""
              }.`,
              host: "host",
              createdAt: new Date(),
            },
          },
          $set: {
            "caseInfo.status": messagesStatusId,
          },
        },
        { session }
      );

      await this.recordAction(
        caseId,
        `Submitted callback request ${note ? `with message : "${note}"` : ""}`,
        session
      );
      await session.commitTransaction();
      return {
        status: 200,
        success: true,
        message: "Callback request submitted successfully",
        data: caseDoc,
      };
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
