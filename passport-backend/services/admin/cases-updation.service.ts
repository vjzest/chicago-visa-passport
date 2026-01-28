import mongoose, { ObjectId, Types } from "mongoose";
import { CasesModel } from "../../models/cases.model";
import { ConfigModel } from "../../models/config.model";
import { AccountsModel } from "../../models/accounts.model";
import NmiPaymentService from "./nmi.payment.service";
import { ServiceResponse } from "../../types/service-response.type";
import AuthService from "../user/auth.service";
import MailService from "../common/mail.service";
import { AdminsModel } from "../../models/admins.model";
import twilio from "twilio";
import FormsService from "./forms.service";
import { camelCaseToNormalCase } from "../../utils/text.utils";
import ENV from "../../utils/lib/env.config";
import { MessagesModel } from "../../models/messages.model";
import { ServiceLevelsModel } from "../../models/service-level.model";
import { TransactionsModel } from "../../models/transaction.model";
import { IStatus } from "../../typings";
import { getFullNameFromAccountDetails } from "../../utils";
import { deleteFromS3, uploadToS3 } from "../../utils/s3";
import { ShippingsModel } from "../../models/shipping.models";
import { StatusesModel } from "../../models/statuses.model";
import FedExUtil, { ShipmentDetails } from "../../utils/fedex";
import { ServiceTypesModel } from "../../models/service-type.model";
import { getStatusId } from "../../utils/status";
import axios from "axios";
import { FedexPackagesModel } from "../../models/fedex-packages.model";

export default class CasesUpdationService {
  private readonly casesModel = CasesModel;
  private readonly configModel = ConfigModel;
  private readonly accountsModel = AccountsModel;
  private readonly adminsModel = AdminsModel;
  private readonly messagesModel = MessagesModel;
  private readonly serviceLevelModel = ServiceLevelsModel;
  private readonly serviceTypeModel = ServiceTypesModel;
  private readonly shippingLocationsModel = ShippingsModel;
  private readonly transactionModel = TransactionsModel;
  private readonly statusesModel = StatusesModel;
  private readonly accountSid = process.env.ACCOUNTSID; // Your Account SID from www.twilio.com/console
  private readonly authToken = process.env.AUTHTOKEN; // Your Auth Token from www.twilio.com/console
  private readonly twilioNumber = process.env.TWILIONUMBER;

  private readonly client = twilio(this.accountSid, this.authToken);
  formsService = new FormsService();
  mailService = new MailService();
  authService = new AuthService();
  fedexUtil = new FedExUtil();

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

  async updateCaseInfo(
    adminId: string,
    caseId: string,
    data: {
      caseManager?: string;
      disableAutoEmails?: boolean;
      inboundTrackingId?: string;
      outboundTrackingId?: string;
      outbound2TrackingId?: string;
      notes: string;
      status?: string;
      processingLocation?: string;
      serviceLevel?: string;
      additionalShippingOptions?: any;
      subStatus1?: string;
      subStatus2?: string;
      serviceType?: string;
    } & { [key: string]: boolean }
  ): Promise<ServiceResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const currentDate = new Date();

      const case_ = await this.casesModel
        .findById(caseId)
        .populate([
          {
            path: "caseInfo.caseManager",
            model: "admins",
            strictPopulate: false,
          },
          {
            path: "account",
            model: "accounts",
            strictPopulate: false,
          },
        ])
        .session(session);

      if (!case_) {
        await session.abortTransaction();
        await session.endSession();
        return {
          status: 404,
          success: false,
          message: "Case not found",
          data: null,
        };
      }

      const restData = data;

      // find admin
      const admin = await this.adminsModel.findById(adminId).session(session);
      const adminName = admin?.firstName + " " + admin?.lastName;

      const prevCaseManger = await this.adminsModel
        .findById(case_?.caseInfo?.caseManager)
        .session(session);

      const prevServiceLevel = await this.serviceLevelModel
        .findById(case_?.caseInfo?.serviceLevel)
        .session(session);

      // Update caseInfo
      if (case_.caseInfo) {
        // Only update if field exists and is non-null
        if (restData.caseManager && restData.caseManager.trim() !== "") {
          case_.caseInfo.caseManager = new mongoose.Types.ObjectId(
            restData.caseManager
          );
        }
        if (
          restData.processingLocation &&
          restData.processingLocation.trim() !== "" &&
          case_.caseInfo.processingLocation?.toString() !==
            restData.processingLocation
        ) {
          //@ts-ignore
          case_.caseInfo.processingLocation = restData.processingLocation;
          const processingLocation = await this.shippingLocationsModel
            .findById(restData.processingLocation)
            .select("locationName");
          //add to notes
          const note = {
            createdAt: currentDate,
            autoNote: `Processing location changed to ${processingLocation?.locationName} by <strong>${adminName}</strong>`,
            manualNote: "",
            host: "system",
          };
          case_.notes.push(note);
        }
        if (restData.hasOwnProperty("disableAutoEmails")) {
          //@ts-ignore
          case_.account.consentToUpdates = !restData?.disableAutoEmails;
        }
        if (restData.serviceLevel && restData.serviceLevel.trim() !== "") {
          case_.caseInfo.serviceLevel = new mongoose.Types.ObjectId(
            restData.serviceLevel
          );
        }
        if (
          restData.status &&
          restData.status !== case_.caseInfo.status?.toString()
        ) {
          const status = await this.statusesModel
            .findById(restData.status)
            .select("title");
          const note = {
            createdAt: currentDate,
            autoNote: `Status changed to ${status?.title} by <strong>${adminName}</strong>`,
            manualNote: "",
            host: "system",
          };
          case_.notes.push(note);
        }
        //@ts-ignore
        case_.caseInfo.status = restData.status;

        //@ts-ignore
        case_.caseInfo.status = restData.status;

        if (
          restData.subStatus1 &&
          restData.subStatus1 !== case_.caseInfo.subStatus1?.toString()
        ) {
          const status = await this.statusesModel
            .findById(restData.subStatus1)
            .select("title");
          const note = {
            createdAt: currentDate,
            autoNote: `Sub Status 1 changed to ${status?.title} by <strong>${adminName}</strong>`,
            manualNote: "",
            host: "system",
          };
          case_.notes.push(note);
        }
        // @ts-ignore
        case_.caseInfo.subStatus1 = restData.subStatus1 || null;

        // @ts-ignore
        case_.caseInfo.subStatus1 = restData.subStatus1 || null;

        if (
          restData.subStatus2 &&
          restData.subStatus2 !== case_.caseInfo.subStatus2?.toString()
        ) {
          const status = await this.statusesModel
            .findById(restData.subStatus2)
            .select("title");
          const note = {
            createdAt: currentDate,
            autoNote: `Sub Status 2 changed to ${status?.title} by <strong>${adminName}</strong>`,
            manualNote: "",
            host: "system",
          };
          case_.notes.push(note);
        }
        //@ts-ignore
        case_.caseInfo.subStatus2 = restData.subStatus2 || null;
        // Add other fields as needed

        //add notes for all changed statuses
        console.log("incoming status :", restData.status);
        console.log("case status :", case_.caseInfo.status?._id.toString());
        console.log("incoming substatus1 :", restData.subStatus1);
        console.log(
          "case subStatus1 :",
          case_.caseInfo.subStatus1?._id.toString()
        );
        console.log("incoming substatus2 :", restData.subStatus2);
        console.log(
          "case subStatus3 :",
          case_.caseInfo.subStatus2?._id.toString()
        );
        //@ts-ignore
        case_.caseInfo.subStatus2 = restData.subStatus2 || null;
        // Add other fields as needed

        //add notes for all changed statuses
        console.log("incoming status :", restData.status);
        console.log("case status :", case_.caseInfo.status?._id.toString());
        console.log("incoming substatus1 :", restData.subStatus1);
        console.log(
          "case subStatus1 :",
          case_.caseInfo.subStatus1?._id.toString()
        );
        console.log("incoming substatus2 :", restData.subStatus2);
        console.log(
          "case subStatus3 :",
          case_.caseInfo.subStatus2?._id.toString()
        );
      }

      let systemNotes = [];
      const transaction = await this.transactionModel.findOne({
        caseId,
        transactionType: "casepayment",
      });

      // =========================================================
      //           while updating the service level
      // =========================================================

      if (
        restData.serviceLevel &&
        prevServiceLevel?._id.toString() !== restData.serviceLevel &&
        !case_.caseInfo.serviceLevelUpdated
      ) {
        const newServiceLevel = await this.serviceLevelModel
          .findById(restData?.serviceLevel)
          .session(session);

        const prevServiceLevelAmount: number =
          Number(transaction?.serviceFee!) +
          Number(transaction?.processingFee!) +
          Number(transaction?.nonRefundableFee!);

        const newServiceLevelAmount =
          Number(newServiceLevel?.inboundFee!) +
          Number(newServiceLevel?.outboundFee!) +
          Number(newServiceLevel?.price!) +
          Number(newServiceLevel?.nonRefundableFee!);
        //PENDING
        let amount;
        if (prevServiceLevelAmount >= newServiceLevelAmount) {
          amount = prevServiceLevelAmount - newServiceLevelAmount;
          // Refund logic
          if (amount > 0) {
            const paymentData = {
              ccnumber: case_?.billingInfo?.cardNumber || "",
              ccexp: case_?.billingInfo?.expirationDate || "",
              cvv: case_?.billingInfo?.cardVerificationCode || "",
              caseId: case_._id.toString(),
              caseNo: case_.caseNo,
              account: case_.account,
              transaction_id: transaction?.transactionId!,
              amount: amount,
              isInternational: true,
              description: `Refund for Service level downgrade (to ${newServiceLevel?.serviceLevel})`,
              services: [],
            };
            const paymentResponse =
              await NmiPaymentService.processServiceLevelRefund(
                paymentData,
                case_.caseInfo.paymentProcessor ?? null
              );
            // Refund email content
            const refundEmailContent = `
                <h2 style="color: #5bc0de;">Refund Confirmation</h2>
                <p>Dear ${getFullNameFromAccountDetails(case_?.account)},</p>
                <p>We have successfully processed a refund of $${amount.toFixed(
                  2
                )} for your service level update.</p>
                <p>If you have any questions, please contact our support team.</p>
              `;
            //@ts-ignore
            const permissionForEmail =
              (case_?.account as any)?.consentToUpdates &&
              !case_.caseInfo.disableAutoEmails;
            if (permissionForEmail || permissionForEmail == undefined) {
              const refundEmailData = {
                from: ENV.FROM_EMAIL,
                to: case_?.contactInformation?.email1!,
                fullName: `${getFullNameFromAccountDetails(case_?.account)}`,
                subject: "Refund Confirmation",
                htmlContent: refundEmailContent,
              };
              await this.mailService.sendEmailText(refundEmailData, caseId);
            }
            systemNotes.push(
              ` A refund of $${amount} has been issued to the applicant. TID: ${paymentResponse?.transaction_id}.`
            );
            case_.caseInfo.invoiceInformation?.push({
              service: `Service level downgrade (to ${newServiceLevel?.serviceLevel})`,
              price: -amount,
            });
            case_.caseInfo.serviceLevelUpdated = true;
          }
        } else {
          // Payment logic
          amount = newServiceLevelAmount - prevServiceLevelAmount;

          const paymentData = {
            ccnumber: case_?.billingInfo?.cardNumber || "",
            ccexp: case_?.billingInfo?.expirationDate || "",
            cvv: case_?.billingInfo?.cardVerificationCode || "",
            caseId: case_._id.toString(),
            caseNo: case_.caseNo,
            account: case_.account,
            amount: amount,
            isInternational: true,
            description: `Payment for Service level upgrade (to ${newServiceLevel?.serviceLevel})`,
            services: [
              {
                service: `Service level upgrade to ${newServiceLevel?.serviceLevel}`,
                price: amount,
              },
            ],
          };

          const paymentResponse =
            await NmiPaymentService.processServiceLevelPayment(
              paymentData,
              case_.caseInfo.paymentProcessor ?? null
            );
          console.log(paymentResponse, "paymentResponse");
          if (!paymentResponse.success) {
            throw new Error("Payment failed for service level");
          }
          case_.caseInfo.serviceLevelUpdated = true;

          // Payment email content
          const paymentEmailContent = `
            <h2 style="color: #5bc0de;">Payment Confirmation for service level upgrade</h2>
            <p>Dear ${getFullNameFromAccountDetails(case_?.account)},</p>
            <p>We have successfully processed a payment of $${amount.toFixed(
              2
            )} for upgrading your service level to '${
            newServiceLevel?.serviceLevel
          }</p>
            <p>If you have any questions, please contact our support team.</p>
          `;
          //@ts-ignore

          const permissionForEmail =
            (case_?.account as any)?.consentToUpdates &&
            !case_.caseInfo.disableAutoEmails;
          if (permissionForEmail || permissionForEmail == undefined) {
            const paymentEmailData = {
              from: ENV.FROM_EMAIL,
              to: case_?.contactInformation?.email1!,
              fullName: ` ${getFullNameFromAccountDetails(case_?.account)}`,
              subject: "Payment Confirmation for service level upgrade",
              htmlContent: paymentEmailContent,
            };

            await this.mailService.sendEmailText(paymentEmailData, caseId);
          }

          systemNotes.push(
            `A payment of $${amount} has been initiated from the applicant. TID: ${paymentResponse.transaction_id}.`
          );
          case_.caseInfo.invoiceInformation?.push({
            service: `Service level upgrade (to ${newServiceLevel?.serviceLevel})`,
            price: amount,
          });
        }

        systemNotes.push(
          `Service Level updated from "${prevServiceLevel?.serviceLevel}" to "${newServiceLevel?.serviceLevel}" by <strong>${adminName}</strong>.`
        );
        const emailContent = `
          <h2 style="color: #5bc0de;">Service Level Upgrade Notification</h2>
          <p>Dear ${getFullNameFromAccountDetails(case_?.account)},</p>
          <p>We would like to inform you that your service level has been upgraded from '${
            prevServiceLevel?.serviceLevel
          }' to '${newServiceLevel?.serviceLevel}'</p>
          <p>Your new service level is "${newServiceLevel?.serviceLevel}".</p>
          <p>If you have any questions or need further assistance, please do not hesitate to reach out to our support team.</p>
        `;
        const emailData = {
          from: ENV.FROM_EMAIL,
          to: case_?.contactInformation?.email1!,
          fullName: ` ${getFullNameFromAccountDetails(case_?.account)}`,
          subject: "Service Level Upgrade Notification",
          htmlContent: emailContent,
        };

        await this.mailService.sendEmailText(emailData, caseId);
      }

      // =========================================================
      //           while updating the caseManager
      // =========================================================

      if (
        restData.caseManager &&
        prevCaseManger?._id.toString() !== data.caseManager
      ) {
        const newCaseManager = await this.adminsModel
          .findById(data?.caseManager)
          .session(session);
        const prevCaseManagerName =
          prevCaseManger?.firstName + " " + prevCaseManger?.lastName || "N/A";
        const newCaseManagerName =
          newCaseManager?.firstName + " " + newCaseManager?.lastName || "N/A";
        const newCaseManagerEmail = newCaseManager?.email || "";

        systemNotes.push(
          ` Case manager changed from "${prevCaseManagerName}" to "${newCaseManagerName}" by <strong>${adminName}</strong>`
        );

        // Construct the email content to caseManager
        const emailContent = `
          <h2 style="color: #5bc0de;">New Case Assignment Notification</h2>
          <p>Dear ${newCaseManagerName},</p>

          <p>We would like to inform you that a new application has been assigned to you as the case manager.</p>
          <p>Please log in to your account to review the application details and proceed with the necessary actions.</p>
          <p>If you have any questions or need further assistance, please do not hesitate to reach out to our support team.</p>
        `;

        // Send the email to the new case manager
        const emailData = {
          from: ENV.FROM_EMAIL,
          to: newCaseManagerEmail,
          fullName: ` ${newCaseManager?.firstName} ${newCaseManager?.lastName}`,
          subject: "New Case Assignment Notification",
          htmlContent: emailContent,
        };

        await this.mailService.sendEmailText(emailData, caseId);

        // Construct the email content to the user
        const userEmailContent = `
          <h2 style="color: #5bc0de;">Case Manager Updated</h2>
          <p>Dear ${getFullNameFromAccountDetails(case_?.account)}</p>

          <p>We would like to inform you that your case manager has been updated.</p>
          <p>Your new case manager is ${newCaseManagerName}. They will be in touch with you as soon as possible to provide further assistance.</p>
          <p>Please don't hesitate to reach out to your new case manager if you have any questions or need further help.</p>
        `;

        // Send the email to the user
        const userEmailData = {
          from: ENV.FROM_EMAIL,
          to: case_?.contactInformation?.email1!,
          fullName: ` ${getFullNameFromAccountDetails(case_?.account)}`,
          subject: "Case Manager Updated",
          htmlContent: userEmailContent,
        };

        await this.mailService.sendEmailText(userEmailData, caseId);
      }
      // =========================================================
      //           while updating the status
      // =========================================================
      if (case_.caseInfo.status?.toString() !== data.status) {
        const prevAndCurrentStatuses = (await this.statusesModel
          .find({
            _id: { $in: [case_.caseInfo.status, data.status] },
          })
          .session(session)) as IStatus[];
        const prevStatus = prevAndCurrentStatuses.find(
          (status) =>
            status?._id.toString() === case_.caseInfo.status?.toString()
        );
        const currentStatus = prevAndCurrentStatuses.find(
          (status) => status?._id.toString() === data.status
        );
        systemNotes.push(
          `Status changed from "${prevStatus?.title}" to "${currentStatus?.title}".`
        );
        if (currentStatus?.key === "passport-processed") {
          let processingLocation: {
            isActive: boolean;
            isDeleted: boolean;
            locationName: string;
            company: string;
            authorisedPerson: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            instruction?: string | null;
          } | null;
          if (case_.caseInfo.processingLocation) {
            processingLocation = await this.shippingLocationsModel
              .findById(case_.caseInfo.processingLocation)
              .session(session);
          } else {
            throw new Error("Processing location not found");
          }
          if (!processingLocation) {
            throw new Error("Processing location not found");
          }
          const shippingData: ShipmentDetails = {
            shipper: {
              contact: {
                personName: processingLocation.authorisedPerson,
                companyName: processingLocation.company,
                //PENDING replace with dynamic contact number
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
            recipients: [
              {
                contact: {
                  personName: `${(case_ as any)?.account?.firstName} ${
                    (case_ as any)?.account?.lastName
                  }`,
                  companyName: "NONE",
                  phoneNumber: (case_ as any).account?.phone1!,
                },
                address: {
                  streetLines: [
                    (case_ as any)?.shippingInformation?.streetAddress,
                  ],
                  city: (case_ as any)?.shippingInformation?.city,
                  stateOrProvinceCode: (case_ as any)?.shippingInformation
                    ?.state,
                  postalCode: (case_ as any)?.shippingInformation?.zip,
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
                height: 8,
                units: "IN",
              },
            },
          };

          const fedexResponse = await this.fedexUtil.createShipment(
            shippingData
          );
          case_.additionalShippingOptions.outBoundStatus = "sent";
          case_.additionalShippingOptions.outboundTrackingId = {
            id: fedexResponse?.trackingNumber,
            createdAt: new Date(),
          };
          case_.additionalShippingOptions.outboundShippingLabel =
            fedexResponse?.labelUrl;
        }
      }
      // =========================================================
      //           while updating the service type
      // =========================================================
      if (
        restData.serviceType &&
        case_.caseInfo.serviceType?.toString() !== data.serviceType
      ) {
        console.log("selected service type", data.serviceType);
        const prevAndCurrentServiceTypes = await this.serviceTypeModel
          .find({
            _id: { $in: [case_.caseInfo.serviceType, data.serviceType] },
          })
          .session(session);
        const prevServiceType = prevAndCurrentServiceTypes.find(
          (serviceType) =>
            (serviceType?._id as ObjectId).toString() ===
            case_.caseInfo.serviceType?.toString()
        );
        const currentServiceType = prevAndCurrentServiceTypes.find(
          (serviceType) =>
            (serviceType?._id as ObjectId).toString() === data.serviceType
        );
        systemNotes.push(
          `Service type changed from "${prevServiceType?.serviceType}" to "${currentServiceType?.serviceType}" <strong>${adminName}</strong>.`
        );
        case_.caseInfo.serviceType = currentServiceType?._id as Types.ObjectId;
        console.log(
          "current service type: : :",
          currentServiceType?.serviceType
        );
        case_.reviewStage = "application";
        case_.applicationReviewStatus = "pending";
        case_.applicationReviewMessage = "";
        case_.docReviewMessage = "";
        case_.docReviewStatus = "pending";
        case_.documents.forEach((document) => {
          document.urls.forEach(async (url) => {
            await deleteFromS3(url);
          });
        });
        console.log("docs deleted");
        if (case_.passportFormUrl) {
          await deleteFromS3(case_.passportFormUrl);
        }
        console.log("ppt deleted");
        case_.passportFormUrl = "";
        case_.documents = [] as any;

        //send email to client
        const emailContent = `
          <h2 style="color: #5bc0de;">Service Type Updated</h2>
          <p>Dear ${getFullNameFromAccountDetails(case_?.account)},</p>

          <p>We would like to inform you that your service type has been updated from '${
            prevServiceType?.serviceType
          }' to '${currentServiceType?.serviceType}'</p>
          <p>Your new service type is "${currentServiceType?.serviceType}".</p>
          <p>If you have any questions or need further assistance, please do not hesitate to reach out to our support team.</p>
        `;
        const emailData = {
          from: ENV.FROM_EMAIL,
          to: case_?.contactInformation?.email1!,
          fullName: ` ${getFullNameFromAccountDetails(case_?.account)}`,
          subject: "Service Type Updated",
          htmlContent: emailContent,
        };

        await this.mailService.sendEmailText(emailData, caseId);
      }
      // =========================================================
      //           while updating shipping options
      // =========================================================
      const config = await this.configModel.findOne().session(session);

      const activeFedexOptions = config?.fedex.filter(
        (item) => item.isActive && !item.isDeleted
      );

      let totalShippingPrice = 0;

      // Update additionalShippingOptions
      case_.caseInfo.additionalShippingOptions =
        case_.caseInfo.additionalShippingOptions || {};
      let shippingOptionsString: string = "";
      activeFedexOptions?.forEach((option) => {
        if (data.hasOwnProperty(option.title) && data[option.title] === true) {
          // Store the option as a boolean value
          if (case_.caseInfo.additionalShippingOptions[option.title] === true) {
            return;
          }
          case_.caseInfo.additionalShippingOptions[option.title] = true;
          totalShippingPrice += option.price;
          shippingOptionsString = shippingOptionsString
            ? (shippingOptionsString += `, ${option.title}`)
            : option.title;
          case_.caseInfo.invoiceInformation?.push({
            service: option.title,
            price: option.price,
          });
        }
      });

      if (totalShippingPrice > 0) {
        const paymentData = {
          ccnumber: case_?.billingInfo?.cardNumber || "",
          ccexp: case_?.billingInfo?.expirationDate || "",
          cvv: case_?.billingInfo?.cardVerificationCode || "",
          caseId: case_._id.toString(),
          caseNo: case_.caseNo,
          account: case_.account,
          amount: totalShippingPrice,
          isInternational: true,
          description: "Payment for shipping options " + shippingOptionsString,
          services: [
            {
              service: "Add shipping options : " + shippingOptionsString,
              price: totalShippingPrice,
            },
          ],
        };

        const paymentResponse = await NmiPaymentService.processShippingPayment(
          paymentData,
          case_.caseInfo.paymentProcessor ?? null
        );
        console.log("payment response : ", paymentResponse);

        if (!paymentResponse.success) {
          throw new Error("Payment failed for shipping option");
        }

        // Send an email to the user regarding the shipping payment
        const shippingEmailContent = `
      <h2 style="color: #5bc0de;">Shipping Payment Confirmation</h2>
      <p>Dear ${getFullNameFromAccountDetails(case_?.account)},</p>

      <p>We have successfully processed the shipping payment for your case.</p>
      <p>Total Shipping Amount: $${totalShippingPrice.toFixed(2)}</p>
      <p>If you have any questions or need further assistance, please do not hesitate to reach out to our support team.</p>
    `;
        //@ts-ignore
        const permissionForEmail =
          (case_?.account as any)?.consentToUpdates &&
          !case_.caseInfo.disableAutoEmails;
        if (permissionForEmail || permissionForEmail == undefined) {
          const shippingEmailData = {
            from: ENV.FROM_EMAIL,
            to: case_?.contactInformation?.email1!,
            fullName: `${getFullNameFromAccountDetails(case_?.account)}`,
            subject: "Shipping Payment Confirmation",
            htmlContent: shippingEmailContent,
          };

          await this.mailService.sendEmailText(shippingEmailData, caseId);
        }

        systemNotes.push(
          `Updated Fedex shipping amount: $${totalShippingPrice.toFixed(
            2
          )} by <strong>${adminName}</strong> `
        );
        //set invoice info for each selected shipping service
      }

      case_.notes.push({
        manualNote:
          data?.notes.trim() && data.notes?.trim() !== "<p><br></p>"
            ? data?.notes?.trim()
            : "",
        autoNote: systemNotes.length ? `${systemNotes.join("\n")}` : "",
        host: adminName,
        createdAt: new Date(),
      });
      await case_.save({ session });

      await session.commitTransaction();
      await session.endSession();

      return {
        status: 200,
        success: true,
        message: "Case updated successfully",
        data: case_,
      };
    } catch (error) {
      await await session.abortTransaction();
      await session.endSession();
      console.error("Error updating case:", error);
      return {
        status: 500,
        success: false,
        message: "An error occurred while updating the case",
      };
    }
  }

  async createCourierNote(
    adminId: string,
    applicationId: string,
    note: string
  ) {
    try {
      // Find the application by ID, selecting only required fields
      const application: any = await this.casesModel
        .findById(applicationId)
        .select("courierNotes account");

      if (!application) {
        return {
          status: 404,
          success: false,
          message: "Application not found",
        };
      }

      // Find the admin's name by ID, selecting only required fields
      const admin = await this.adminsModel
        .findById(adminId)
        .select("firstName lastName");
      const adminName = admin
        ? `${admin.firstName} ${admin.lastName}`
        : "Admin";

      // Initialize courierNotes array if not already present
      if (!application.courierNotes) {
        application.courierNotes = [];
      }

      // Create the new courier note object
      const newCourierNote = {
        note: note,
        host: adminName,
        createdAt: new Date(),
      };

      // Add the new note to the courierNotes array
      application.courierNotes.push(newCourierNote);

      // Save the updated application with the new note
      await application.save();

      return {
        status: 200,
        success: true,
        message: "Courier Note successfully created",
        data: application.courierNotes,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async markCaseAsOpened(caseId: string): ServiceResponse<any> {
    try {
      const updatedCase = await this.casesModel.findByIdAndUpdate(
        caseId,
        {
          $set: {
            isOpened: true,
            lastOpened: new Date(),
          },
        },
        { new: true } // Return the updated document
      );

      if (!updatedCase) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
          data: null,
        };
      }

      return {
        status: 200,
        success: true,
        message: "Case marked as opened",
      };
    } catch (error) {
      console.log({ "case open error": error });
      throw error;
    }
  }

  async patchCase(
    adminId: string,
    caseId: string,
    formKey: string,
    fieldKey: string,
    value: any
  ): ServiceResponse<any> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const isExist = await this.casesModel
        .findById(caseId)
        .select("account notes caseNo contactInformation caseInfo")
        .populate(
          "account",
          "firstName middleName lastName email1 consentToUpdates"
        )
        .lean();

      if (!isExist)
        return { status: 404, success: false, message: "Case not found" };

      const updatedCase = await this.casesModel
        .findByIdAndUpdate(
          caseId,
          { $set: { [`${formKey}.${fieldKey}`]: value } },
          { new: true, runValidators: true }
        )
        .session(session)
        .select("notes");

      const admin = await this.adminsModel
        .findById(adminId)
        .select("firstName lastName")
        .lean();

      const adminName = admin?.firstName + " " + admin?.lastName;

      updatedCase?.notes.push({
        manualNote: "",
        autoNote: `Case field updated ${camelCaseToNormalCase(fieldKey)} to ${
          value instanceof Date ? value.toLocaleDateString() : value
        } by <strong>${adminName}</strong>`,
        host: "system",
        createdAt: new Date(),
      });

      await updatedCase?.save({ session }); // Sending email to user (when any of the applicant's name fields update under the user account)
      //@ts-ignore
      const permissionForEmail =
        (isExist?.account as any)?.consentToUpdates &&
        !isExist.caseInfo.disableAutoEmails;
      if (permissionForEmail || permissionForEmail == undefined) {
        //@ts-ignore
        const { firstName, middleName, lastName } = isExist?.account ?? {};
        const name = [firstName, middleName, lastName]
          .filter(Boolean)
          .join(" ");
        const emailContent = `
       <h2 style="color: orange;">Passport Application Updates</h2>
       <p>Dear ${name},</p>
       <p>We would like to inform you that the <strong>${camelCaseToNormalCase(
         fieldKey
       )}</strong> has been updated by an admin to <strong>${value}</strong>.</p>
       <p>Please review the above information carefully. If you did not request these changes or if there are any discrepancies, kindly contact us immediately.</p>
       <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
     `;

        // Email data object
        const data = {
          from: ENV.FROM_EMAIL,
          to: isExist?.contactInformation?.email1!,
          subject: "Passport Application Update Notice",
          htmlContent: emailContent,
          //@ts-ignore
          fullName: `${isExist?.account?.firstName} ${
            //@ts-ignore
            isExist?.account?.middleName || ""
            //@ts-ignore
          } ${isExist?.account?.lastName}`,
        };
        // Send the email
        await this.mailService.sendEmailText(data, caseId);
      }
      await session.commitTransaction();
      return {
        status: 200,
        success: true,
        message: "Case updated successfully",
        data: updatedCase,
      };
    } catch (error) {
      await await session.abortTransaction();
      console.log(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async cancelCase(
    adminId: string,
    caseId: string,
    reason: string
  ): ServiceResponse {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Find the case by ID
      const currentCase: any = await this.casesModel
        .findById(caseId)
        .populate(["account"])
        .select([
          "account",
          "isCancelled",
          "caseNo",
          "caseInfo",
          "contactInformation",
        ]);
      if (!currentCase) {
        return { status: 404, success: false, message: "Case not found" };
      }

      const admin = await this.adminsModel.findById(adminId);
      const adminName = admin?.firstName + " " + admin?.lastName;

      // Determine the action (cancel or reinstate) and update fields accordingly
      const isCanceled = !currentCase.isCanceled;
      const action = isCanceled ? "canceled" : "reinstated";

      // Update the case with the new status, cancellation reason, and add a note
      const updatedCase = await this.casesModel
        .findOneAndUpdate(
          { _id: caseId },
          {
            $set: { cancellationReason: reason, isCanceled },
            $push: {
              notes: {
                manualNote: "",
                autoNote: `${action} case with caseNo: ${currentCase?.caseNo}`,
                host: adminName,
                createdAt: new Date(),
              },
            },
          },
          { new: true, runValidators: true }
        )
        .session(session);

      if (!updatedCase) {
        return {
          status: 500,
          success: false,
          message: "Failed to update case",
        };
      }

      // Get the case manager's information
      const caseManager = await this.adminsModel.findById(
        currentCase?.caseInfo?.caseManager
      );
      const caseManagerName = caseManager?.username || "N/A";
      const caseManagerEmail = caseManager?.email || "";

      // Construct the email content for the case manager
      const caseManagerEmailContent = `
        <h2>Passport Application ${
          action.charAt(0).toUpperCase() + action.slice(1)
        }</h2>
        <p>Dear ${caseManagerName},</p>
        <p>We would like to inform you that the Passport application with caseNo ${
          currentCase?.caseNo
        } has been ${action}.</p>
        ${
          isCanceled
            ? `<p>Reason for cancellation: ${reason}</p>`
            : `<p>The cancellation has been undone and the application is reinstated.</p>`
        }
        <p>Please review the case details and take the necessary actions.</p>
        <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
      `;

      // Send the email to the case manager
      const caseManagerEmailData = {
        from: ENV.FROM_EMAIL,
        to: caseManagerEmail,
        fullName: `${caseManager?.firstName} ${caseManager?.lastName}`,
        subject: `Passport Application ${
          action.charAt(0).toUpperCase() + action.slice(1)
        }`,
        htmlContent: caseManagerEmailContent,
      };

      await this.mailService.sendEmailText(caseManagerEmailData, caseId);

      // Construct the email content for the user
      const userEmailContent = `
        <h2>Passport Application ${
          action.charAt(0).toUpperCase() + action.slice(1)
        }</h2>
        <p>Dear ${
          currentCase?.account?.firstName + " " + currentCase?.account?.lastName
        },</p>
        <p>We ${
          isCanceled ? "regret" : "greed"
        } to inform you that your Passport application has been ${action}.</p>
        ${
          isCanceled
            ? `<p>Reason for cancellation: ${reason}</p>`
            : `<p>The cancellation has been undone and your application is reinstated.</p>`
        }
        <p>If you have any questions or require further assistance, please don't hesitate to contact our support team.</p>
      `;

      // Send the email to the user
      const userEmailData = {
        from: ENV.FROM_EMAIL,
        to: currentCase?.contactInformation?.email1,
        fullName: `${
          currentCase?.account?.firstName + " " + currentCase?.account?.lastName
        }`,
        subject: `Passport Application ${
          action.charAt(0).toUpperCase() + action.slice(1)
        }`,
        htmlContent: userEmailContent,
      };

      await this.mailService.sendEmailText(userEmailData, caseId);

      await session.commitTransaction();
      // Return a successful response
      return {
        status: 200,
        success: true,
        message: `Case ${action} successfully`,
        data: updatedCase,
      };
    } catch (error) {
      await session.commitTransaction();
      console.log(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async sendMessage({
    message,
    caseId,
    adminId,
    senderType,
  }: {
    message: string;
    caseId: string;
    adminId?: string;
    senderType: "admin" | "user";
  }) {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
      console.log("caseId", caseId);
      const caseDetails = await this.casesModel
        .findOne({ _id: caseId })
        .select("account contactInformation")
        .populate("account");
      if (!caseDetails) {
        return {
          status: 400,
          success: false,
          message: "Case not found",
        };
      }
      let userNumber = (caseDetails.account as any)?.phone1;

      // Sanitize and format the phone number
      if (userNumber) {
        userNumber = userNumber.trim();
        if (!userNumber.startsWith("+1")) {
          userNumber = "+1" + userNumber;
        }
        userNumber = userNumber.replace(/\s+/g, "");
      }

      const msg = await this.client.messages.create({
        body: message,
        from: senderType === "admin" ? this.twilioNumber : userNumber,
        to: senderType === "admin" ? userNumber! : ENV.TWILIONUMBER!,
      });

      console.log("msg object", msg);

      const messageData = await this.messagesModel.create({
        senderType: "admin",
        admin: adminId,
        text: msg.body,
        case: caseId,
        user: caseDetails.account?._id,
      });
      return {
        status: 200,
        success: true,
        message: "Messages send successfully",
        data: messageData,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async receiveMessage({
    receivedMsg,
    fromNumber,
  }: {
    receivedMsg: string;
    fromNumber: string;
  }): ServiceResponse {
    try {
      if (!receivedMsg || !fromNumber) {
        return {
          message: "number and message is required",
          status: 400,
          success: false,
        };
      }

      // Validate the userNumber and ensure it's a string
      if (typeof fromNumber !== "string") {
        return {
          message: "Invalid user number",
          status: 400,
          success: false,
        };
      }

      if (fromNumber.startsWith("+1")) {
        fromNumber = fromNumber.substring(2).replace(/\s+/g, "");
      }

      const account = await this.accountsModel
        .findOne({ phone1: fromNumber })
        .select("_id");
      if (!account) {
        return {
          message: "Account not found",
          status: 404,
          success: false,
        };
      }
      const messageData = await this.messagesModel.create({
        senderType: "user",
        text: receivedMsg,
        user: account._id,
      });
      return {
        status: 200,
        success: true,
        message: "Messages send successfully",
        data: messageData,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async bulkUpdateCaseManager(
    caseIds: string[],
    caseManagerId: string,
    host: string
  ): ServiceResponse {
    try {
      const caseManager = await this.adminsModel.findById(caseManagerId);
      if (!caseManager) {
        return {
          status: 404,
          success: false,
          message: "Case manager not found",
        };
      }
      const affectedCases = await this.casesModel
        .find({ _id: { $in: caseIds } })
        .populate("account")
        .select("account contactInformation caseInfo");

      await this.casesModel.updateMany(
        { _id: { $in: caseIds } },
        {
          $set: { "caseInfo.caseManager": caseManagerId },
          $push: {
            notes: {
              manualNote: "",
              autoNote: `Case re-assigned to '${caseManager.firstName} ${caseManager.lastName}' by bulk update`,
              host,
            },
          },
        }
      );

      affectedCases.forEach(async (affectedCase: any) => {
        if (
          affectedCase?.account?.consentToUpdates &&
          !affectedCase?.caseInfo?.disableAutoEmails
        ) {
          const data = {
            from: ENV.FROM_EMAIL,
            to: affectedCase?.contactInformation?.email1,
            subject: "Passport Application Update Notice",
            htmlContent: `
              <h2 style="color: orange;">Passport Application Updates</h2>
              <p>Dear ${affectedCase?.account?.firstName} ${affectedCase?.account?.lastName},</p>
              <p>We would like to inform you that the case manager has been updated by XX admin to <strong>${caseManager.firstName} ${caseManager.lastName}</strong>.</p>
              <p>Please review the above information carefully. If you did not request these changes or if there are any discrepancies, kindly contact us immediately.</p>
              <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
            `,
            fullName: `${affectedCase?.account?.firstName} ${affectedCase?.account?.lastName}`,
          };
          await this.mailService.sendEmailText(data, affectedCase?._id);
        }
      });
      return {
        status: 200,
        success: true,
        message: "Bulk updated cases successfully",
      };
      // send email to all affected case customer if they have consentToUpdates
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async bulkUpdateStatus(
    caseIds: string[],
    statusId: string,
    host: string
  ): ServiceResponse {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const status = await this.statusesModel.findById(statusId);
      if (!status) {
        return {
          status: 404,
          success: false,
          message: "Status not found",
        };
      }
      if (status.level !== 1) {
        return {
          status: 404,
          success: false,
          message: "Status not primary",
        };
      }
      await this.casesModel
        .updateMany(
          { _id: { $in: caseIds } },
          {
            $set: { "caseInfo.status": statusId },
            $push: {
              notes: {
                manualNote: "",
                autoNote: `Case status updated to '${status.title}' by bulk update`,
                host,
              },
            },
          }
        )
        .session(session);
      await session.commitTransaction();
      return {
        status: 200,
        success: true,
        message: "Bulk updated cases successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async updateNote(
    caseId: string,
    noteId: string,
    newNote: string
  ): ServiceResponse {
    try {
      // Find the case by ID, selecting only the fields necessary for updating the note
      const caseDetails = await this.casesModel
        .findById(caseId)
        .select("notes");

      if (!caseDetails) {
        return {
          status: 404,
          success: false,
          message: "Case not found",
        };
      }

      // Find the specific note within the notes array
      const note = caseDetails.notes.id(noteId);
      if (!note) {
        return {
          status: 404,
          success: false,
          message: "Note not found",
        };
      }

      // Update the note content
      note.manualNote = newNote;
      await caseDetails.save();

      return {
        status: 200,
        success: true,
        message: "Note updated successfully",
        data: { noteId: note._id, manualNote: note.manualNote }, // Return only updated note details
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async deleteNote(caseId: string, noteId: string): ServiceResponse {
    try {
      // Find the case by ID, selecting only the fields necessary for updating the note
      await this.casesModel.updateOne(
        { _id: caseId },
        { $pull: { notes: { _id: noteId } } }
      );

      return {
        status: 200,
        success: true,
        message: "Note deleted successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async updateCourierNote(
    caseId: string,
    noteId: string,
    newNote: string
  ): ServiceResponse {
    try {
      // Find the case by ID, selecting only the fields necessary for updating the note
      const caseDetails = await this.casesModel
        .findById(caseId)
        .select("courierNotes");

      if (!caseDetails) {
        return {
          status: 404,
          success: false,
          message: "Case not found",
        };
      }

      // Find the specific note within the notes array
      const note = caseDetails.courierNotes.id(noteId);
      if (!note) {
        return {
          status: 404,
          success: false,
          message: "Note not found",
        };
      }

      // Update the note content
      note.note = newNote;
      await caseDetails.save();

      return {
        status: 200,
        success: true,
        message: "Note updated successfully",
        data: { noteId: note._id, manualNote: note.note }, // Return only updated note details
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteCourierNote(caseId: string, noteId: string): ServiceResponse {
    try {
      // Find the case by ID, selecting only the fields necessary for updating the note
      await this.casesModel.updateOne(
        { _id: caseId },
        { $pull: { courierNotes: { _id: noteId } } }
      );

      return {
        status: 200,
        success: true,
        message: "Note deleted successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async confirmInboundShipment(
    caseId: string,
    adminId: string
  ): ServiceResponse {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const caseDoc = await this.casesModel
        .findById(caseId)
        .select([
          "account",
          "shippingInformation",
          "additionalShippingOptions",
          "caseInfo",
          "notes",
        ])
        .populate("account");
      if (!caseDoc) {
        return {
          status: 404,
          success: false,
          message: "Application not found",
        };
      }
      const processingLocation = await this.shippingLocationsModel
        .findById(caseDoc?.caseInfo?.processingLocation)
        .session(session);
      if (!processingLocation) {
        throw new Error("Processing location not found");
      }
      const shippingData: ShipmentDetails = {
        shipper: {
          contact: {
            personName: `${(caseDoc?.account as any)?.firstName} ${
              (caseDoc?.account as any)?.lastName
            }`,
            companyName: "NONE",
            phoneNumber: (caseDoc.account as any)?.phone1!,
          },
          address: {
            streetLines: [(caseDoc as any)?.shippingInformation?.streetAddress],
            city: (caseDoc as any)?.shippingInformation?.city,
            stateOrProvinceCode: (caseDoc as any)?.shippingInformation?.state,
            postalCode: (caseDoc as any)?.shippingInformation?.zip,
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
        note: "",
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

      caseDoc.additionalShippingOptions.inboundShippingLabel =
        labelUploadResult.url;
      const admin = await this.adminsModel.findById(adminId);
      const inboundShipmentStatusId = await getStatusId("inbound-shipment");
      caseDoc.caseInfo.status = inboundShipmentStatusId as any;
      caseDoc.notes.push({
        manualNote: "",
        autoNote: `Inbound shipment confirmed and Fedex label generated by ${admin?.firstName} ${admin?.lastName}`,
        host: "system",
        createdAt: new Date(),
      });
      await caseDoc.save();

      const newFedexPackage = new FedexPackagesModel({
        trackingNumber: fedexResponse?.trackingNumber,
        case: caseId,
        expectedDate: new Date(fedexResponse?.deliveryDate),
        labelUrl: labelUploadResult.url,
      });
      await newFedexPackage.save();

      const { firstName, lastName, email1, consentToUpdates } =
        caseDoc.account as any;
      if (consentToUpdates) {
        const emailContent = `
      <h2 style="color: #5bc0de;">Shipping Label Generated</h2>
      <p>Dear ${firstName + " " + lastName},</p>
      <p>The FedEx shipping label to our processing location have been successfully generated on your Client Portal.</p>
      <p>Download and use it to ship the documents we requested through your nearest Fedex Office.</p>
      `;
        await this.mailService.sendEmailText(
          {
            to: email1,
            fullName: `${firstName} ${lastName}`,
            subject: "Shipping Label Generated",
            htmlContent: emailContent,
          },
          caseId
        );
      }
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
}
