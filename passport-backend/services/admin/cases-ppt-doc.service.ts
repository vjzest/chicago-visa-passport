import mongoose from "mongoose";
import { CasesModel } from "../../models/cases.model";
import AuthService from "../../services/user/auth.service";
import MailService from "../common/mail.service";
import { AdminsModel } from "../../models/admins.model";
import FormsService from "./forms.service";
import ENV from "../../utils/lib/env.config";
import { deleteFromS3, uploadToS3 } from "../../utils/s3";
import FedExUtil from "../../utils/fedex";
import { getStatusId } from "../../utils/status";
import { FormFillProcessesModel } from "../../models/form-fill-process.model";

export default class CasesPPTDocService {
  private readonly casesModel = CasesModel;
  private readonly adminsModel = AdminsModel;
  private readonly formFillProcesssesModel = FormFillProcessesModel;

  formsService = new FormsService();
  mailService = new MailService();
  authService = new AuthService();
  fedexUtil = new FedExUtil();

  async rejectDocuments(
    adminId: string,
    caseId: string,
    verification: { [key: string]: boolean },
    rejectionMessage: string
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Fetch only necessary fields from the case document
      const caseDoc = await this.casesModel
        .findById(caseId)
        .select(
          "documents caseInfo notes docReviewStatus docReviewMessage applicantInfo account contactInformation"
        )
        .populate({
          path: "account",
          select: "firstName lastName email1 consentToUpdates",
        });

      if (!caseDoc) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }

      // Fetch admin information with selected fields
      const admin = await this.adminsModel
        .findById(adminId)
        .select("firstName lastName");
      const adminName = `${admin?.firstName} ${admin?.lastName}`;

      const unverifiedDocs = [];
      const deletions: Promise<void>[] = [];

      for (const doc of caseDoc.documents) {
        const docVerified = Boolean(verification[doc.document as any]);
        doc.isVerified = docVerified;
        if (!docVerified) {
          unverifiedDocs.push(doc.document);
          for (const url of doc.urls) {
            deletions.push(
              deleteFromS3(url).catch((error) => {
                console.error(`Error deleting file ${url}:`, error);
                throw error;
              })
            );
          }
          doc.urls = [];
        }
      }

      // Add note and update document review status
      caseDoc.notes.push({
        manualNote: "",
        autoNote: `Documents Rejected: "${rejectionMessage} by <strong>${adminName}</strong>"`,
        host: "system",
        createdAt: new Date(),
      });
      caseDoc.docReviewStatus = "rejected";
      caseDoc.docReviewMessage = rejectionMessage;

      await Promise.all(deletions); // Perform S3 deletions in parallel
      await caseDoc.save({ session }); // Save updated case

      if (
        (caseDoc.account as any).consentToUpdates &&
        !caseDoc.caseInfo.disableAutoEmails
      ) {
        // Construct email content
        const applicantName = `${caseDoc?.applicantInfo?.firstName} ${caseDoc?.applicantInfo?.lastName}`;
        const name =
          (caseDoc?.account as any)?.firstName +
          " " +
          (caseDoc?.account as any)?.lastName;
        const rejectionReasons = rejectionMessage
          .split(",")
          .map((reason) => `<li>${reason.trim()}</li>`)
          .join("");
        const emailContent = `
          <h2 style="color: #d9534f;">Passport Application Document Review</h2>
          <p>Dear ${name},</p>
          <p>We regret to inform you that some of the documents submitted for <strong>${applicantName}</strong>'s passport application have not met the required criteria.</p>
          <blockquote><ul>${rejectionReasons}</ul></blockquote>
          <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
        `;

        // Prepare and send email
        const data = {
          from: ENV.FROM_EMAIL,
          to: caseDoc.contactInformation?.email1!,
          fullName: name,
          subject: "Passport Documents Rejection Notice",
          htmlContent: emailContent,
        };

        await this.mailService.sendEmailText(data, caseId);
      }
      await session.commitTransaction();
      return {
        status: 200,
        success: true,
        message: "Case updated successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      console.error("Error in rejectDocuments:", error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async approveDocuments(adminId: string, caseId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Fetch only necessary fields from the case document
      const caseDoc: any = await this.casesModel
        .findById(caseId)
        .select(
          "notes docReviewStatus reviewStage docReviewMessage documents applicantInfo account contactInformation caseInfo"
        )
        .populate({
          path: "account",
          select: "email1 firstName lastName consentToUpdates",
        });

      if (!caseDoc) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }

      // Fetch admin information with selected fields
      const admin = await this.adminsModel
        .findById(adminId)
        .select("firstName lastName");
      const adminName = `${admin?.firstName} ${admin?.lastName}`;

      // Add approval note to case notes
      caseDoc.notes.push({
        manualNote: "",
        autoNote: `Required Documents approved by <strong>${adminName}</strong>`,
        host: "system",
        createdAt: new Date(),
      });

      // Update review stage and status
      if (caseDoc.docReviewStatus === "expert") {
        const waitingForDocsId = await getStatusId("waiting-for-docs");
        caseDoc.caseInfo.status = waitingForDocsId;
        caseDoc.reviewStage = "done";
      }
      caseDoc.docReviewStatus = "approved";
      caseDoc.docReviewMessage = "";

      // Mark all documents as verified
      caseDoc.documents.forEach((doc: any) => {
        doc.isVerified = true;
      });

      await caseDoc.save({ session }); // Save updates to case document

      if (
        caseDoc.account.consentToUpdates &&
        !caseDoc.caseInfo.disableAutoEmails
      ) {
        // Prepare and send the email notification
        const applicantName = `${caseDoc.applicantInfo?.firstName} ${caseDoc.applicantInfo?.lastName}`;
        const emailContent = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2 style="color: #5cb85c;">Passport Application Document Approval</h2>
              <p>Dear ${applicantName},</p>
              <p>We are pleased to inform you that your submitted documents for the passport application have been reviewed and approved.</p>
              <p>Your application is now progressing to the next stage of processing. We will keep you updated on any further developments.</p>
              <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
            </div>`;

        const emailData = {
          from: ENV.FROM_EMAIL,
          to: caseDoc?.contactInformation?.email1,
          fullName: applicantName,
          subject: "Passport Application Documents Approved",
          htmlContent: emailContent,
        };

        await this.mailService.sendEmailText(emailData, caseId);
      }
      await session.commitTransaction();
      return {
        status: 200,
        success: true,
        message: "Case updated successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      console.error("Error in approveDocuments:", error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async revertDocuments(adminId: string, caseId: string, status: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const caseDoc: any = await this.casesModel
        .findById(caseId)
        .populate("account")
        .select({
          "applicantInfo.firstName": 1,
          "applicantInfo.lastName": 1,
          docReviewStatus: 1,
          documents: 1,
          notes: 1,
          contactInformation: 1,
          account: 1,
          caseInfo: 1,
        });

      if (!caseDoc) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }

      const admin = await this.adminsModel.findById(adminId);
      const adminName = admin?.firstName + " " + admin?.lastName;

      // caseDoc.notes.push({
      //   manualNote: "",
      //   autoNote: `Documents Status Revert to ${status} from ${caseDoc?.docReviewStatus} and Sent email to ${caseDoc.contactInformation?.email1} on ${currentDate}`,
      //   host: adminName,
      //   createdAt: new Date(),
      // });
      // caseDoc.docReviewStatus = status;
      // caseDoc.docReviewMessage = "";
      // caseDoc.documents.forEach((doc: any) => {
      //   doc.isVerified = false;
      // });
      // await caseDoc.save();
      await this.casesModel
        .updateOne(
          { _id: caseDoc._id },
          {
            $set: {
              docReviewStatus: status,
              docReviewMessage: "",
              "documents.$[].isVerified": false,
            },
            $push: {
              notes: {
                manualNote: "",
                autoNote: `Documents review status reverted to ${status} from ${caseDoc?.docReviewStatus}`,
                host: adminName,
                createdAt: new Date(),
              },
            },
          }
        )
        .session(session);

      const permissionForEmail =
        caseDoc.account?.consentToUpdates &&
        !caseDoc.caseInfo.disableAutoEmails;
      if (permissionForEmail) {
        const name =
          caseDoc.applicantInfo?.firstName +
          " " +
          caseDoc.applicantInfo?.lastName;

        const emailContent = `
              <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h2 style="color: #5cb85c;">Passport Application Document updates</h2>
                <p>Dear ${name},</p>
                <p>We are pleased to inform you that your submitted documents for the passport application have been reverted back to '${status}'</p>
    
                <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
              </div>`;

        const data = {
          from: ENV.FROM_EMAIL,
          // @ts-ignore
          to: caseDoc.contactInformation?.email1,
          fullName: name,
          subject: "Passport Application Documents status Reverted",
          htmlContent: emailContent,
        };

        await this.mailService.sendEmailText(data, caseId);
      }
      await session.commitTransaction();
      return {
        status: 200,
        success: true,
        message: "Application updated successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async sendToExpertReview(adminId: string, caseId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Fetch only required fields from the case document
      const caseDoc: any = await this.casesModel
        .findById(caseId)
        .select(
          "notes docReviewStatus docReviewMessage documents caseInfo account applicantInfo contactInformation"
        )
        .populate({
          path: "account",
          select: "email1 consentToUpdates",
        });

      if (!caseDoc) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }

      // Fetch only the necessary fields from admin
      const admin = await this.adminsModel
        .findById(adminId)
        .select("firstName lastName");
      const adminName = `${admin?.firstName} ${admin?.lastName}`;

      // Update case notes
      caseDoc.notes.push({
        manualNote: "",
        autoNote: `Required Documents for passport moved to expert review <strong>${adminName}</strong>`,
        host: "system",
        createdAt: new Date(),
      });

      // Set review status and update document verification
      caseDoc.docReviewStatus = "expert";
      caseDoc.docReviewMessage = "";
      caseDoc.documents.forEach((doc: any) => {
        doc.isVerified = true;
      });

      // Fetch and assign status ID for expert approval
      const statusId = await getStatusId("expert-approval");
      caseDoc.caseInfo.status = statusId;

      await caseDoc.save({ session });

      // Check user consent before sending an email update
      const permissionForEmail =
        caseDoc?.account?.consentToUpdates &&
        !caseDoc.caseInfo.disableAutoEmails;

      if (permissionForEmail) {
        const applicantName = `${caseDoc?.applicantInfo?.firstName} ${caseDoc?.applicantInfo?.lastName}`;

        const emailContent = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2 style="color: #5cb85c;">Passport Application Document Updates</h2>
              <p>Dear ${applicantName},</p>
              <p>We are pleased to inform you that your submitted documents for the passport application have been reviewed and verified by admin and sent for expert review.</p>
              <p>Your application is now progressing to the next stage of processing. We will keep you updated on any further developments.</p>
              <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
            </div>`;

        const emailData = {
          from: ENV.FROM_EMAIL,
          to: caseDoc?.contactInformation?.email1,
          fullName: applicantName,
          subject: "Your Passport Application Documents Have Been Verified",
          htmlContent: emailContent,
        };

        await this.mailService.sendEmailText(emailData, caseId);
      }
      await session.commitTransaction();
      return {
        status: 200,
        success: true,
        message: "Case updated successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      console.error("Error in sendToExpertReview:", error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async rejectPassportApplication(
    adminId: string,
    caseId: string,
    rejectionMessage: string
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Select only necessary fields from the case document
      const caseDoc: any = await this.casesModel
        .findById(caseId)
        .select(
          "notes applicationReviewStatus applicationReviewMessage account applicantInfo contactInformation caseInfo"
        )
        .populate({
          path: "account",
          select: "email1 firstName lastName consentToUpdates",
        });

      if (!caseDoc) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }

      // Fetch admin details with necessary fields
      const admin = await this.adminsModel
        .findById(adminId)
        .select("firstName lastName");
      const adminName = `${admin?.firstName} ${admin?.lastName}`;

      // Add rejection note
      caseDoc.notes.push({
        manualNote: "",
        autoNote: `Passport Application Form details rejected by <strong>${adminName}</strong>`,
        host: "system",
        createdAt: new Date(),
      });

      // Update the case review status and message
      caseDoc.applicationReviewStatus = "rejected";
      caseDoc.applicationReviewMessage = rejectionMessage;

      await caseDoc.save({ session });
      await this.formFillProcesssesModel.deleteOne(
        { case: caseId },
        { session }
      );

      // Get the applicant name and account information
      const applicantName = `${caseDoc?.applicantInfo?.firstName} ${caseDoc?.applicantInfo?.lastName}`;
      const name =
        caseDoc?.account?.firstName + " " + caseDoc?.account?.lastName;

      if (
        caseDoc.account.consentToUpdates &&
        !caseDoc.caseInfo.disableAutoEmails
      ) {
        // Construct the rejection email content
        const emailContent = `
           <h2 style="color: #d9534f;">Passport Application Document Review</h2>
           <p>Dear ${name},</p>
           <p>We regret to inform you that some of the details submitted for <strong>${applicantName}'s</strong> passport application have not been approved.</p>
           <blockquote>${rejectionMessage}</blockquote>
           <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
         `;

        // Prepare the email data
        const data = {
          from: ENV.FROM_EMAIL,
          to: caseDoc?.contactInformation?.email1!,
          fullName: name,
          subject: "Passport Application Details Rejected",
          htmlContent: emailContent,
        };
        // Send the rejection email
        await this.mailService.sendEmailText(data, caseId);
      }
      await session.commitTransaction();

      return {
        status: 200,
        success: true,
        message: "Passport application updated successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      console.error("Error in rejectPassportApplication:", error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async uploadPassportApplication(
    adminId: string,
    caseId: string,
    data: {
      form: Express.Multer.File;
      formType: "DS11" | "DS82" | "DS11_DS64";
    }
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { url } = await uploadToS3(
        data.form.buffer,
        data.form.originalname,
        data.form.mimetype,
        "cases/pptforms"
      );
      // Select only necessary fields from the case document
      const caseDoc: any = await this.casesModel
        .findById(caseId)
        .select(
          "notes applicationReviewStatus passportFormUrl applicationReviewMessage reviewStage caseInfo account applicantInfo contactInformation documents"
        )
        .populate({
          path: "account",
          select: "email1 consentToUpdates",
        })
        .populate({
          path: "applicantInfo",
          select: "firstName lastName",
        });

      if (!caseDoc) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }
      if (caseDoc?.passportFormUrl) {
        await deleteFromS3(caseDoc?.passportFormUrl);
      }
      if (
        caseDoc.account.consentToUpdates &&
        !caseDoc.caseInfo.disableAutoEmails
      ) {
        // Prepare applicant name for email
        const name = `${caseDoc.applicantInfo?.firstName} ${caseDoc.applicantInfo?.lastName}`;

        // Construct the approval email content
        const emailContent = `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #5cb85c;">Passport Application Form Generated</h2>
            <p>Dear ${name},</p>
            <p>We are pleased to inform you that your passport application form has been generated by your passport specialist with the details you submitted.</p>
            <p>You can preview the application form and details from your client portal.</p>
            <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
          </div>`;

        // Prepare the email data
        const data = {
          from: ENV.FROM_EMAIL,
          to: caseDoc?.contactInformation?.email1,
          fullName: name,
          subject: "Passport Application Form Generated",
          htmlContent: emailContent,
        };
        console.log("sending mail");
        // Send the email to the user
        await this.mailService.sendEmailText(data, caseId);
      }

      // Fetch admin details with necessary fields
      const admin = await this.adminsModel
        .findById(adminId)
        .select("firstName lastName");
      const adminName = `${admin?.firstName} ${admin?.lastName}`;

      // Add approval note
      caseDoc.notes.push({
        manualNote: "",
        autoNote: `Passport application manually generated and uploaded by <strong>${adminName}</strong>`,
        host: "system",
        createdAt: new Date(),
      });

      // Update application status and review stage
      caseDoc.applicationReviewStatus = "ongoing";
      caseDoc.applicationReviewMessage = "";
      caseDoc.passportFormUrl = url;

      await caseDoc.save({ session });

      await session.commitTransaction();
      return {
        status: 200,
        success: true,
        message: "Passport application updated successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async approvePassportApplication(adminId: string, caseId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Select only necessary fields from the case document
      const caseDoc: any = await this.casesModel
        .findById(caseId)
        .select(
          "notes applicationReviewStatus applicationReviewMessage reviewStage caseInfo account applicantInfo contactInformation documents"
        )
        .populate({
          path: "account",
          select: "email1 consentToUpdates",
        })
        .populate({
          path: "applicantInfo",
          select: "firstName lastName",
        });

      if (!caseDoc) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }

      // Fetch admin details with necessary fields
      const admin = await this.adminsModel
        .findById(adminId)
        .select("firstName lastName");
      const adminName = `${admin?.firstName} ${admin?.lastName}`;

      // Add approval note
      caseDoc.notes.push({
        manualNote: "",
        autoNote: `Passport application reviewed and approved by <strong>${adminName}</strong>`,
        host: "system",
        createdAt: new Date(),
      });

      // Update application status and review stage
      caseDoc.applicationReviewStatus = "approved";
      caseDoc.applicationReviewMessage = "";
      caseDoc.reviewStage = "documents";
      if (caseDoc.documents.length > 0) {
        caseDoc.docReviewStatus = "ongoing";
      }
      const statusId = await getStatusId("document-review");
      caseDoc.caseInfo.status = statusId;

      await caseDoc.save({ session });

      if (
        caseDoc.account.consentToUpdates &&
        !caseDoc.caseInfo.disableAutoEmails
      ) {
        // Prepare applicant name for email
        const name = `${caseDoc.applicantInfo?.firstName} ${caseDoc.applicantInfo?.lastName}`;

        // Construct the approval email content
        const emailContent = `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #5cb85c;">Passport Application Document Approval</h2>
            <p>Dear ${name},</p>
            <p>We are pleased to inform you that your submitted details for the passport application have been reviewed and approved.</p>
            <p>Your application is now progressing to the next stage of processing. We will keep you updated on any further developments.</p>
            <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
          </div>`;

        // Prepare the email data
        const data = {
          from: ENV.FROM_EMAIL,
          to: caseDoc?.contactInformation?.email1,
          fullName: name,
          subject: "Passport Application Details Approved",
          htmlContent: emailContent,
        };
        console.log("sending mail");
        // Send the email to the user
        await this.mailService.sendEmailText(data, caseId);
      }
      await session.commitTransaction();
      return {
        status: 200,
        success: true,
        message: "Passport application updated successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async revertPassportApplication(
    adminId: string,
    caseId: string,
    status: string
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Select only necessary fields from the case document
      const caseDoc: any = await this.casesModel
        .findById(caseId)
        .select(
          "notes applicationReviewStatus account applicantInfo documents contactInformation caseInfo"
        )
        .populate({
          path: "account",
          select: "email1 consentToUpdates",
        })
        .populate({
          path: "applicantInfo",
          select: "firstName lastName",
        });

      if (!caseDoc) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }

      // Fetch admin details with necessary fields
      const admin = await this.adminsModel
        .findById(adminId)
        .select("firstName lastName");
      const adminName = `${admin?.firstName} ${admin?.lastName}`;

      // Add note regarding the status revert
      caseDoc.notes.push({
        manualNote: "",
        autoNote: `Passport application Status reverted to ${status} from ${caseDoc?.applicationReviewStatus} by <strong>${adminName}</strong>`,
        host: "system",
        createdAt: new Date(),
      });

      // Update the application review status and documents verification
      caseDoc.applicationReviewStatus = status;
      caseDoc.applicationReviewMessage = "";
      caseDoc.documents.forEach((doc: any) => {
        doc.isVerified = false;
      });

      await caseDoc.save({ session });

      // Check if the applicant consented to updates and send email
      if (
        caseDoc?.account?.consentToUpdates &&
        !caseDoc.caseInfo.disableAutoEmails
      ) {
        const name = `${caseDoc.applicantInfo?.firstName} ${caseDoc.applicantInfo?.lastName}`;

        // Construct the email content
        const emailContent = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2 style="color: #5cb85c;">Passport Application Updates</h2>
              <p>Dear ${name},</p>
              <p>We are pleased to inform you that your submitted details for the passport application have been changed to status ${status}.</p>
              <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
            </div>`;

        // Prepare email data
        const data = {
          from: ENV.FROM_EMAIL,
          to: caseDoc?.contactInformation?.email1,
          fullName: name,
          subject: "Passport Application Status Reverted",
          htmlContent: emailContent,
        };

        // Send the email
        await this.mailService.sendEmailText(data, caseId);
      }
      await session.commitTransaction();

      return {
        status: 200,
        success: true,
        message: "Application updated successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
