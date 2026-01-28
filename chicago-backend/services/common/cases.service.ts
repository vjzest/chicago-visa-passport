import mongoose from "mongoose";
import { CasesModel } from "../../models/cases.model";
import { ConfigModel } from "../../models/config.model";
import { AccountsModel } from "../../models/accounts.model";
import NmiPaymentService from "../admin/nmi.payment.service";
import { ServiceResponse } from "../../types/service-response.type";
import AuthService from "../user/auth.service";
import MailService from "./mail.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import FormsService from "../admin/forms.service";
import ENV from "../../utils/lib/env.config";
import { getRandomCaseNumber } from "../user/serial.service";
import { ServiceLevelsModel } from "../../models/service-level.model";
import FedExUtil from "../../utils/fedex";
import { ServiceTypesModel } from "../../models/service-type.model";
import {
  AdditionalServicesModel,
  IAddon,
} from "../../models/additional.service.model";
import { getStatusId } from "../../utils/status";
import IAdmin from "../../interfaces/admin.interface";
import { CaseEmailsModel } from "../../models/case-emails.model";
import { randomUUID } from "crypto";
import { flattenObject } from "../../utils/object";
import { getFormattedDateAndTime } from "../../utils/date";
import CasesDuplicationService from "../admin/cases-duplication.service";
import { incrementProcessorUsage } from "../../utils/lib/load-balancer";
import ConsularFeeService from "../admin/consular-fee.service";
import { selectCaseManager } from "../../utils/lib/cm-load-balancer";
import { decrypt } from "../../utils/lib/cryptography";
import { ProcessorsModel } from "../../models/processor.model";

export default class CasesService {
  private readonly casesModel = CasesModel;
  private readonly configModel = ConfigModel;
  private readonly accountsModel = AccountsModel;
  private readonly serviceLevelModel = ServiceLevelsModel;
  private readonly serviceTypeModel = ServiceTypesModel;
  private readonly caseEmailsModel = CaseEmailsModel;
  private readonly casesDuplicationService = new CasesDuplicationService();
  private readonly consularFeeService = new ConsularFeeService();
  private readonly additionalServicesModel = AdditionalServicesModel;

  private readonly JWTSECRET = process.env.JWT_SECRET!;
  private readonly JWTPAYMENTSECRET = process.env.JWT_PAYMENT_SECRET!;

  formsService = new FormsService();
  mailService = new MailService();
  authService = new AuthService();
  fedexUtil = new FedExUtil();

  async create(
    caseData: any,
    _userId: string | false,
    ipAddress: string | undefined
  ): Promise<ServiceResponse> {
    console.log("caseData", caseData);
    console.log("caseInfo", caseData?.caseInfo);
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      let existingUser;
      let newPassword;

      const emailUser = await this.accountsModel
        .findOne({
          email1: caseData?.contactInformation?.email1,
        })
        .session(session);

      if (_userId) {
        existingUser = await this.accountsModel
          .findById(_userId)
          .session(session);

        if (!existingUser) {
          throw new Error("User not found");
        }

        // Check if the email belongs to another user
        if (emailUser && emailUser._id.toString() !== _userId) {
          throw new Error("This email is already used by another account.");
        }
      } else {
        if (emailUser && emailUser.isActive) {
          throw new Error("Primary Email already used.");
        } else if (!emailUser) {
          newPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(newPassword, 10);

          const createdUsers = await this.accountsModel.create(
            [
              {
                firstName: caseData?.applicantInfo?.firstName,
                lastName: caseData?.applicantInfo?.lastName,
                middleName: caseData?.applicantInfo?.middleName,
                dateOfBirth: caseData?.applicantInfo?.dateOfBirth,
                email1: caseData?.contactInformation?.email1,
                email2: caseData?.contactInformation?.email2,
                phone1: caseData?.contactInformation?.phone1,
                phone2: caseData?.contactInformation?.phone2,
                password: hashedPassword,
                userKey: newPassword,
                isActive: false,
              },
            ],
            { session }
          );

          existingUser = createdUsers[0];
        } else {
          existingUser = emailUser;
        }
      }

      //ATTENTION

      const userId = existingUser._id;
      const userName = [
        existingUser?.firstName,
        existingUser?.middleName,
        existingUser?.lastName,
      ]
        .filter(Boolean)
        .join(" ");

      const userMail = existingUser.email1;

      let selectedManager: Omit<IAdmin, "role"> | null = null;

      if (!selectedManager) {
        selectedManager = await selectCaseManager();
      }

      const forms = await this.formsService.findFormsOfASection(
        "passport-application-forms"
      );

      const currentDate = new Date();
      // Create new case
      const caseNo = await getRandomCaseNumber();
      let potentialDuplicate = {
        isDuplicate: false,
        duplicatesWith: [],
        adminDecision: {
          status: "PENDING",
          decidedBy: null,
          decidedAt: null,
          notes: null,
        },
        lastUpdatedBy: null,
        lastUpdatedAt: new Date(),
      };

      try {
        const duplicateCheck =
          await this.casesDuplicationService.checkDuplicateCase(caseData);
        potentialDuplicate = {
          isDuplicate: duplicateCheck?.data?.isDuplicate || false,
          duplicatesWith: duplicateCheck?.data?.duplicatesWith || [],
          adminDecision: potentialDuplicate?.adminDecision, // Maintain the default adminDecision
          lastUpdatedBy: potentialDuplicate?.lastUpdatedBy,
          lastUpdatedAt: potentialDuplicate?.lastUpdatedAt,
        };
      } catch (error) {
        console.error("Error checking for duplicates:", error);
      }
      let decryptedCaseId;
      if (caseData?.contingentCaseId) {
        if (mongoose.Types.ObjectId.isValid(caseData.contingentCaseId)) {
          decryptedCaseId = caseData.contingentCaseId;
        } else {
          decryptedCaseId = decrypt(caseData.contingentCaseId);
        }
      }
      let newCase = caseData.contingentCaseId
        ? await this.casesModel.findOne({
          _id: decryptedCaseId,
        })
        : null;
      if (!newCase) {
        newCase = await this.casesModel.findOne({
          "applicantInfo.firstName": caseData?.applicantInfo?.firstName,
          "applicantInfo.lastName": caseData?.applicantInfo?.lastName,
          "applicantInfo.dateOfBirth": caseData?.applicantInfo?.dateOfBirth,
          "applicantInfo.middleName": caseData?.applicantInfo?.middleName,
          "caseInfo.serviceType": caseData?.caseInfo?.serviceType,
          "caseInfo.fromCountryCode": caseData?.caseInfo?.fromCountryCode,
          "caseInfo.toCountryCode": caseData?.caseInfo?.toCountryCode,
          "contactInformation.email1": caseData?.contactInformation?.email1,
        });
      }
      const serviceType = await this.serviceTypeModel.findById(
        caseData?.caseInfo?.serviceType
      );
      if (!newCase) {
        newCase = (
          await this.casesModel.create(
            [
              {
                ...caseData,
                caseInfo: {
                  ...caseData?.caseInfo,
                  processingLocation: serviceType?.shippingAddress,
                },
                departureDate: caseData.departureDate || "",
                account: userId.toString(),
                ipAddress: ipAddress ?? "",
                // applications: [],
                "caseInfo.caseManager": selectedManager?._id,
                formInstance: forms?.data,
                caseNo,
                potentialDuplicate,
                notes: [
                  {
                    manualNote: "",
                    autoNote: `Case created on ${getFormattedDateAndTime(
                      currentDate,
                      { showYear: true }
                    )} `,
                    host: "system",
                    createdAt: new Date(),
                  },
                ],
              },
            ],
            { session }
          )
        )[0];
      } else {
        if (newCase.caseInfo.invoiceInformation.length > 0) {
          throw new Error("Case already exists!");
        }
        //update newCase with caseData from request
        await this.casesModel.updateOne(
          { _id: newCase?._id },
          {
            $set: {
              ...flattenObject(caseData),
              departureDate: caseData.departureDate || "",
              account: userId?.toString(),
              ipAddress: ipAddress ?? "",
            },
          },
          { session }
        );
        newCase.caseInfo.processingLocation =
          serviceType?.shippingAddress! as any;
        (newCase.caseInfo.additionalServices =
          caseData?.caseInfo.additionalServices),
          (newCase.caseInfo.serviceLevel = caseData.caseInfo.serviceLevel);
        newCase.caseInfo.stateOfResidency =
          caseData?.caseInfo?.stateOfResidency || "";
        await newCase.save({ session });
        console.log("new data updated");
      }

      if (!newCase) throw new Error("Case not created");

      // Payment data to pass to payment service
      const conf = await this.configModel.findOne();

      const getFormattedAdditionalServices = async (inputServices: any) => {
        try {
          const formattedServices = await Promise.all(
            inputServices?.map(async (serviceItem: any) => {
              const service = await this.additionalServicesModel.findById(
                serviceItem.service
              );

              if (!service) {
                return null;
              }

              // Filter addons to only include those in the input
              const filteredAddons = service.addons.filter((addon) =>
                serviceItem.addons.includes(addon._id.toString())
              );

              return {
                ...service.toObject(),
                addons: filteredAddons,
              };
            })
          );
          return formattedServices.filter((service) => service !== null);
        } catch (error) {
          console.error("Error fetching additional services:", error);
          throw error;
        }
      };

      const formattedAdditionalServices = await getFormattedAdditionalServices(
        caseData?.caseInfo?.additionalServices
      );

      //store all services as an array of price breakup
      const invoiceInformation: { service: string; price: number }[] = [];

      formattedAdditionalServices.forEach((service) => {
        if (!service) return;
        invoiceInformation.push({
          service: service.title,
          price: service.price,
        });
        service.addons?.forEach((addon: IAddon) => {
          invoiceInformation.push({
            service: addon.subTitle,
            price: addon.price,
          });
        });
      });
      const serviceLevel = await this.serviceLevelModel.findById(
        caseData?.caseInfo?.serviceLevel
      );
      invoiceInformation.push({
        service: serviceLevel?.serviceLevel!,
        price: Number(serviceLevel?.price!),
      });
      invoiceInformation.push({
        service: "Non refundable fee",
        price: serviceLevel?.nonRefundableFee!,
      });

      if ((serviceLevel?.inboundFee ?? 0) > 0) {
        invoiceInformation.push({
          service: "Inbound shipping fee",
          price: serviceLevel?.inboundFee!,
        });
      }
      if ((serviceLevel?.outboundFee ?? 0) > 0) {
        invoiceInformation.push({
          service: "Outbound shipping fee",
          price: serviceLevel?.outboundFee!,
        });
      }

      // Fetch and add consular fee if applicable
      const citizenOf = caseData?.citizenOf;
      const travelingTo = caseData?.travelingTo;
      if (citizenOf && travelingTo) {
        try {
          const consularFeeResponse = await this.consularFeeService.findByCountryCodes(
            citizenOf,
            travelingTo,
            caseData?.caseInfo?.serviceLevel,
            caseData?.caseInfo?.serviceType
          );
          if (consularFeeResponse.success && consularFeeResponse.data?.fee > 0) {
            invoiceInformation.push({
              service: "Consular Fee",
              price: consularFeeResponse.data.fee,
            });
          }
        } catch (error) {
          console.error("Error fetching consular fee:", error);
          // Continue without consular fee if there's an error
        }
      }

      if (conf?.chargeOnlineProcessingFee) {
        //calculate the online fee percentage on all
        const totalAmount = invoiceInformation.reduce(
          (acc, curr) => acc + curr.price,
          0
        );
        const onlineFeeAmount =
          (totalAmount * Number(conf?.onlineProcessingFee)) / 100;
        invoiceInformation.push({
          service: "Online processing fee",
          price: Number(onlineFeeAmount.toFixed(2)),
        });
      }

      const paymentData = {
        ccnumber: caseData?.billingInfo?.cardNumber || "",
        ccexp: caseData?.billingInfo?.expirationDate || "",
        cvv: caseData?.billingInfo?.cardVerificationCode || "",
        serviceLevel: caseData?.caseInfo?.serviceLevel,
        caseNo: newCase?.caseNo,
        serviceType: caseData?.caseInfo?.serviceType,
        additionalServices: caseData?.caseInfo?.additionalServices,
        formattedAdditionalServices,
        appliedPromo: caseData?.appliedPromo,
        account: userId.toString(),
        caseId: newCase._id.toString(),
        onlineProcessingFee: conf?.chargeOnlineProcessingFee
          ? conf?.onlineProcessingFee || "0"
          : "0",
        isInternational: true,
        services: invoiceInformation.filter((el) => el.price > 0),
      };

      // Offline Link Logic (Bypass NMI if valid link provided)
      let paymentResponse;
      if (caseData.isOfflineLink && caseData.token) {
        // Need to import PaymentLinkModel at top of file, or dynamic import if avoiding circular deps
        const PaymentLinkModel = mongoose.model("PaymentLink");
        const paymentLink: any = await PaymentLinkModel.findOne({ token: caseData.token }).session(session);

        if (!paymentLink) {
          throw new Error("Invalid payment link token");
        }
        if (paymentLink.status !== 'active') {
          throw new Error("Payment link is not active");
        }

        // Mark link as used
        paymentLink.status = 'used';
        paymentLink.caseId = newCase._id; // Link the case to the payment link
        await paymentLink.save({ session });

        // Ensure case is marked as offline link
        newCase.isOfflineLink = true;

        // Mock successful payment response
        paymentResponse = {
          success: true,
          transaction_id: `OFFLINE-${paymentLink.token.substring(0, 8)}`,
          message: "Offline Payment Link Verified",
          usedProcessorId: null, // No processor used
          promoDiscount: 0,
          promoCode: null,
          notes: [{
            autoNote: `Case created via Offline Payment Link (Token: ${caseData.token}). Amount: $${paymentLink.amount}`,
            host: "system",
            createdAt: new Date()
          }]
        };

      } else {
        // Standard NMI Payment
        paymentResponse = await NmiPaymentService.processPayment(paymentData);

        if (!paymentResponse.success) {
          const otherProcessors = await ProcessorsModel.find({
            _id: {
              $ne: paymentResponse.usedProcessorId,
            },
            isActive: true,
          });
          for (const processor of otherProcessors) {
            console.log("retrying with MID : ", processor.processorName);
            paymentResponse = await NmiPaymentService.processPayment({
              ...paymentData,
              paymentProcessor: processor._id,
            });
            if (paymentResponse.success) {
              break;
            }
          }
        }
      }

      if (!paymentResponse.success) {
        console.log(paymentResponse);
        const notProcessedStatusId = await getStatusId(
          paymentResponse.failedTransaction === "first"
            ? "complete/not-processed"
            : "failed-charge"
        );

        newCase.caseInfo.status = (notProcessedStatusId?.toString() ||
          "") as any;
        newCase.notes.push(...paymentResponse.notes);
        newCase.isAccessible = false;
        newCase.notes.push({
          host: "system",
          autoNote: `User Device : <strong>${caseData.deviceInfo.device}</strong>. OS : <strong>${caseData.deviceInfo.os}</strong>. Browser: <strong>${caseData.deviceInfo.browser}</strong>`,
        });
        await newCase.save({ session });

        await session.commitTransaction();
        return {
          status: 400,
          success: false,
          message: paymentResponse.message,
          data: {
            dataRecorded: true,
            paymentResponse,
          },
        };
      }

      // Only increment processor usage if a processor was used
      if (paymentResponse.usedProcessorId) {
        incrementProcessorUsage(paymentResponse.usedProcessorId);
      }

      // if payment used a promo code, include the discount in breakup
      if (paymentResponse.promoCode) {
        invoiceInformation.push({
          service: `Promo Code Discount - ${paymentResponse.promoCode}`,
          price: -Number(paymentResponse.promoDiscount),
        });
      }

      newCase.notes.push(...paymentResponse.notes);
      newCase.notes.push({
        autoNote: `The client successfully completed the website signup and immediately received access to their dedicated Client Portal, along with an email containing the credentials for future access. This portal includes all necessary forms and instructions related to the purchased expedited services. A limited Visa processing reservation has been held. IP address: ${ipAddress}.`,
        host: "system",
      });
      newCase.caseInfo.status = (await getStatusId("new")) as any;
      newCase.caseInfo.paymentProcessor =
        paymentResponse.usedProcessorId as any;
      newCase.caseInfo.invoiceInformation = invoiceInformation as any;
      newCase.caseInfo.fromCountryCode = caseData?.caseInfo?.fromCountryCode;
      newCase.caseInfo.toCountryCode = caseData?.caseInfo?.toCountryCode;

      newCase.isAccessible = true;
      newCase.submissionDate = new Date();

      await newCase.save({ session });

      const paymentToken = jwt.sign(
        {
          id: paymentResponse.transaction_id,
          caseId: newCase?._id,
          caseNo: newCase?.caseNo,
          email: userMail,
        },
        this.JWTPAYMENTSECRET,
        { expiresIn: "30m" }
      );
      const latestTokenVersion = randomUUID();
      existingUser.authTokenVersion = latestTokenVersion;
      const accessToken = jwt.sign(
        {
          id: existingUser._id,
          tokenVersion: latestTokenVersion,
          email: existingUser.email1,
          role: "user",
        },
        this.JWTSECRET,
        { expiresIn: "72h" }
      );

      if (!existingUser.isActive) {
        existingUser.isActive = true;
        await existingUser.save({ session });
      }
      await session.commitTransaction();
      try {
        ////////////////////////
        // SENDING EMAIL TO USER

        const mailData = {
          from: ENV.FROM_EMAIL!,
          fullName: userName || "Chicago Passport & Visa Expedite Services User",
          caseId: newCase?._id?.toString(),
          to: existingUser?.email1!,
          password: existingUser?.userKey!,
        };

        // Send verification email only after the first activation
        await this.mailService.sendMail(mailData);
      } catch (error) {
        console.log(error);
      }
      try {
        // SENDING EMAIL TO CASE MANAGER
        const emailContent = `<h2 style="color: #5bc0de;">Case Assignment Notification</h2>
      <p>Dear ${selectedManager?.firstName} ${selectedManager?.lastName},</p>
      <p>We are pleased to inform you that a new case has been assigned to you for review and management.</p>
      <p><strong>Case Details:</strong></p>
      <ul>
      <li><strong>Case No:</strong> ${newCase?.caseNo}</li>
      <li><strong>Applicant Name:</strong> ${userName}</li>
      <li><strong>Applicant Email:</strong> ${userMail}</li>
      </ul>
      <p>Please review the case details and take the necessary actions as soon as possible. If you have any questions or require additional information, do not hesitate to reach out.</p>
      <p>Thank you for your attention to this matter.</p>
      `;

        const data = {
          from: ENV.FROM_EMAIL,
          to: selectedManager?.email!,
          fullName:
            selectedManager?.firstName + " " + selectedManager?.lastName,
          subject: "Case Assignment Notification",
          htmlContent: emailContent,
        };

        await this.mailService.sendEmailText(data, "");
      } catch (error) {
        console.log(error);
      } finally {
        return {
          status: 201,
          success: true,
          message: "Your application was submitted successfully",
          data: {
            accessToken,
            paymentToken,
            caseId: newCase?.caseNo,
            newCase,
          },
        };
      }
    } catch (error: any) {
      await session.abortTransaction();
      console.error("Error in create function:", error);
      return {
        status: 400,
        success: false,
        message: error.message || "An error occurred during case creation",
      };
    } finally {
      await session.endSession();
    }
  }

  async checkIfEmailUsed(email: string, _userId: string | false) {
    let existingUser;

    existingUser = await this.accountsModel.findOne({
      email1: email,
      isActive: true,
    });

    if (existingUser) {
      if (_userId) {
        if (existingUser._id.toString() !== _userId) {
          return {
            status: 409,
            success: false,
            message: "This email is already used by another account.",
            data: null,
          };
        }
      } else {
        return {
          status: 409,
          success: false,
          message: "This email is already associated with an account.",
          data: null,
        };
      }
    }

    return {
      status: 200,
      success: true,
      message: "Valid Unused Email.",
      data: null,
    };
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
            const serviceLevel = await this.serviceLevelModel
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

  async getAllEmailRecords(caseId: string): ServiceResponse {
    try {
      const emails = await this.caseEmailsModel
        .find({ case: caseId })
        .sort({ createdAt: -1 });

      return {
        status: 200,
        success: true,
        message: "Fetched all email records successfully",
        data: emails,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
