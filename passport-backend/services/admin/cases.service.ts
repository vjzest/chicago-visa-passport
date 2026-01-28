import mongoose from "mongoose";
import { CasesModel } from "../../models/cases.model";
import { ServiceResponse } from "../../types/service-response.type";
import AuthService from "../../services/user/auth.service";
import MailService from "../common/mail.service";
import FormsService from "./forms.service";
import FedExUtil from "../../utils/fedex";
import { ProcessorsModel } from "../../models/processor.model";
import nmiPaymentService from "../admin/nmi.payment.service";
import { decrypt } from "../../utils/lib/cryptography";
import { TransactionsModel } from "../../models/transaction.model";
import ENV from "../../utils/lib/env.config";
import { getFullNameFromAccountDetails } from "../../utils";
import {
  AdditionalServicesModel,
  IAddon,
} from "../../models/additional.service.model";
import { ConfigModel } from "../../models/config.model";
import { getStatusId } from "../../utils/status";
import { ServiceLevelsModel } from "../../models/service-level.model";
import { AccountsModel } from "../../models/accounts.model";
import { incrementProcessorUsage } from "../../utils/lib/load-balancer";
import { maskCCNumber } from "../../utils/text.utils";

export default class CasesService {
  private readonly casesModel = CasesModel;
  private readonly paymentService = nmiPaymentService;
  private readonly processorsModel = ProcessorsModel;
  private readonly transactionsModel = TransactionsModel;
  private readonly additionalServicesModel = AdditionalServicesModel;
  private readonly configModel = ConfigModel;
  private readonly serviceLevelModel = ServiceLevelsModel;
  private readonly accountsModel = AccountsModel;

  formsService = new FormsService();
  mailService = new MailService();
  authService = new AuthService();
  fedexUtil = new FedExUtil();

  async chargeCustomerManually(
    caseId: string,
    transaction: any,
    adminName: string
  ): ServiceResponse {
    try {
      if (!mongoose.Types.ObjectId.isValid(caseId)) {
        return {
          status: 400,
          success: false,
          message: "Invalid case ID format",
          data: null,
        };
      }

      const existingCase = await this.casesModel
        .findById(caseId)
        .select("account caseInfo.invoiceInformation caseNo");

      if (!existingCase) {
        return {
          status: 404,
          success: false,
          message: "Case not found",
          data: null,
        };
      }

      const { amount, processor, cardNumber, expiry, cvc, description } =
        transaction;
      console.log({ transaction });

      const processorDetails = await this.processorsModel.findById(processor);
      console.log(processorDetails);

      if (
        !processorDetails?._id ||
        !processorDetails?.userName ||
        !processorDetails?.password
      ) {
        return {
          status: 404,
          success: false,
          message: "Processor details not found",
          data: null,
        };
      }

      const decryptedPassword = decrypt(processorDetails?.password as string);
      console.log({
        type: "sale",
        caseNo: existingCase?.caseNo,
        amount,
        ccnumber: cardNumber,
        cvv: cvc,
        ccexp: expiry,
        isInternational: false,
        account: String(existingCase.account),
        processorCreds: {
          id: processorDetails._id,
          userName: processorDetails?.userName as string,
          password: decryptedPassword,
        },
      });

      // Format credit card number to ensure it has spaces
      const formattedCardNumber = cardNumber
        .replace(/\s+/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();

      // Format expiry date to ensure it has a slash
      const formattedExpiry = expiry.includes("/")
        ? expiry
        : `${expiry.substring(0, 2)}/${expiry.substring(2)}`;

      const paymentResponse = await this.paymentService.processNMITransaction({
        type: "sale",
        amount,
        caseNo: existingCase?.caseNo,
        ccnumber: formattedCardNumber,
        cvv: cvc,
        ccexp: formattedExpiry,
        isInternational: false,
        account: String(existingCase.account),
        processorCreds: {
          _id: processorDetails._id,
          userName: processorDetails?.userName as string,
          password: decryptedPassword,
        },
      });

      if (!paymentResponse.success) {
        return {
          status: 500,
          success: false,
          message: paymentResponse.message,
          data: null,
        };
      }

      await this.transactionsModel.create({
        account: String(existingCase.account),
        caseId,
        amount,
        orderId: paymentResponse.order_id,
        description,
        card: {
          number: maskCCNumber(cardNumber),
          expiryMonth: formattedExpiry.split("/")[0],
          expiryYear: formattedExpiry.split("/")[1],
        },
        products: [
          {
            name: description,
            price: amount,
          },
        ],
        transactionId: paymentResponse.transaction_id,
        paymentProcessor: processorDetails._id,
        transactionType: "extracharge",
      });

      // Update the invoice information in the case document
      const invoiceItem = {
        service: description,
        price: amount,
      };

      // Push the new invoice item to the invoiceInformation array
      const updatedCase = await this.casesModel.findByIdAndUpdate(
        caseId,
        {
          $push: {
            "caseInfo.invoiceInformation": invoiceItem,
            notes: {
              autoNote: `Client charged manually by <strong>${adminName}</strong> for $${amount}. DESCRIPTION: "${description}". GATEWAY: ${processorDetails?.processorName}. TID: ${paymentResponse?.transaction_id}`,
              host: "system",
            },
          },
        },
        { new: true }
      );

      return {
        status: 200,
        success: true,
        message: "Payment processed and invoice updated successfully",
        data: updatedCase,
      };
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  async trackCaseEmailEvents(trackingId: string): ServiceResponse {
    try {
      if (!trackingId) {
        return {
          success: false,
          status: 400,
          message: "Tracking ID not provided",
        };
      }
      const { events } = await this.mailService.getEmailEvents(trackingId);
      const formattedEvents = events.map((item) => {
        return {
          date: item.date,
          event: item.event,
          description: this.mailService.eventDescriptions[item.event] ?? "",
        };
      });
      return {
        success: true,
        status: 200,
        message: "Email events fetched successfully",
        data: formattedEvents,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendTestimonialRequest(
    caseId: string,
    adminName: string
  ): ServiceResponse {
    try {
      const existingCase = await this.casesModel
        .findById(caseId)
        .select("_id notes caseInfo contactInformation")
        .populate("account");
      if (!existingCase) {
        return {
          success: false,
          message: "Case not found",
          status: 400,
        };
      }
      const userEmailContent = `
          <p>Dear ${getFullNameFromAccountDetails(existingCase?.account)}</p>

          <p>Thank you for choosing Jet Passports for your passport expediting needs. We hope you found our service simple, fast, and convenient. Your feedback is invaluable, and we’d love to hear about your experience.</p>
          <p>Please reply to <strong>support@jetpassports.com</strong> to share your feedback. With your permission, we may feature a portion of your comments as a testimonial on our website to help future clients (your full name will not be disclosed).</p>
          <p>Wishing you and your family a safe and enjoyable journey!</p>
          <p>Thank you again for your trust in our services.</p>
          <br/>
          <p>Best regards,</p>
          <p>Customer Service Team</p>
          <p>Jet Passports</p>
        `;

      // Send the email to the user
      const userEmailData = {
        from: ENV.FROM_EMAIL,
        to: existingCase?.contactInformation?.email1!,
        fullName: ` ${getFullNameFromAccountDetails(existingCase?.account)}`,
        subject: "Thank You For Choosing Jet Passports",
        htmlContent: userEmailContent,
      };
      const response = await this.mailService.sendEmailText(
        userEmailData,
        caseId
      );
      console.log(response);
      if (!response.success) {
        return {
          success: false,
          message: "Error sending email",
          status: 400,
        };
      }
      existingCase?.notes.push({
        autoNote: `Testimonial request sent by <strong>${adminName}</strong>`,
        host: "system",
      });
      existingCase.caseInfo.requestForTestimonial = true;
      await existingCase?.save();
      return {
        success: true,
        message: "Testimonial request sent successfully",
        status: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async chargeForOrder(
    caseId: string,
    data: {
      processor: string;
      serviceLevel: string;
      serviceType: string;
      additionalServices: {
        service: string;
        addons: string[];
      }[];
      billingInfo: {
        cardHolderName: string;
        cardNumber: string;
        expirationDate: string;
        cardVerificationCode: string;
      };
    },
    adminName: string
  ): ServiceResponse {
    try {
      if (!data.serviceType || !data.serviceLevel) {
        return {
          success: false,
          message: "Service type and service level are required",
          status: 400,
        };
      }
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
      const caseDetails = await this.casesModel
        .findOne({ _id: caseId })
        .select("-formInstance")
        .populate("account");
      if (!caseDetails) {
        return {
          success: false,
          message: "Case not found",
          status: 400,
        };
      }
      if (
        caseDetails.submissionDate ||
        caseDetails?.caseInfo?.invoiceInformation?.length > 0
      ) {
        return {
          success: false,
          message: "Case already submitted",
          status: 400,
        };
      }
      const conf = await this.configModel
        .findOne({})
        .select("chargeOnlineProcessingFee onlineProcessingFee");
      const formattedAdditionalServices = await getFormattedAdditionalServices(
        data.additionalServices
      );
      caseDetails.caseInfo.serviceType = new mongoose.Types.ObjectId(
        data.serviceType
      );
      caseDetails.caseInfo.serviceLevel = new mongoose.Types.ObjectId(
        data.serviceLevel
      );
      caseDetails.caseInfo.additionalServices = data.additionalServices as any;
      caseDetails.billingInfo = data.billingInfo;

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
        caseDetails?.caseInfo?.serviceLevel
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
        ccnumber: data?.billingInfo?.cardNumber || "",
        ccexp: data?.billingInfo?.expirationDate || "",
        cvv: data?.billingInfo?.cardVerificationCode || "",
        serviceLevel: data?.serviceLevel,
        caseNo: caseDetails?.caseNo,
        serviceType: data?.serviceType,
        additionalServices: data?.additionalServices,
        account: (caseDetails.account as any)?._id?.toString(),
        appliedPromo: "",
        caseId: caseId,
        onlineProcessingFee: conf?.chargeOnlineProcessingFee
          ? conf?.onlineProcessingFee || "0"
          : "0",
        isInternational: true,
        paymentProcessor: data.processor,
        services: invoiceInformation.filter((el) => el.price > 0),
      };

      const paymentResponse = await nmiPaymentService.processPayment(
        paymentData
      );
      console.log("payment res :", paymentResponse);

      if (!paymentResponse.success) {
        console.log(paymentResponse);
        const notProcessedStatusId = await getStatusId(
          paymentResponse.failedTransaction === "first"
            ? "complete/not-processed"
            : "failed-charge"
        );

        caseDetails.caseInfo.status = (notProcessedStatusId?.toString() ||
          "") as any;
        caseDetails.notes.push(...paymentResponse.notes);
        caseDetails.isAccessible = false;
        caseDetails.notes.push({
          host: "system",
          autoNote: `Manual charging for order submission by <strong>${adminName}</strong> failed`,
        });
        await caseDetails.save();

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
      incrementProcessorUsage(paymentResponse.usedProcessorId);

      caseDetails.notes.push(...paymentResponse.notes);
      caseDetails.notes.push({
        autoNote: `Manual charging for order submission by <strong>${adminName}</strong> was successful`,
        host: "system",
      });
      caseDetails.notes.push({
        autoNote: `The client successfully completed the website signup and immediately received access to their dedicated Client Portal, along with an email containing the credentials for future access. This portal includes all necessary forms and instructions related to the purchased expedited services. A limited passport processing reservation has been held.`,
        host: "system",
      });
      caseDetails.caseInfo.status = (await getStatusId("new")) as any;
      caseDetails.caseInfo.paymentProcessor =
        paymentResponse.usedProcessorId as any;
      caseDetails.caseInfo.invoiceInformation = invoiceInformation as any;

      caseDetails.isAccessible = true;
      caseDetails.submissionDate = new Date();

      await caseDetails.save();

      //activating account in case it is not already
      await this.accountsModel.updateOne(
        { _id: caseDetails.account },
        { $set: { isActive: true } }
      );

      const { firstName, lastName, middleName, email1, userKey } =
        (caseDetails?.account as any) ?? {};
      const userName =
        (firstName ?? "") + (middleName ?? "") + (lastName ?? "");
      try {
        ////////////////////////
        // SENDING EMAIL TO USER

        const mailData = {
          from: ENV.FROM_EMAIL!,
          fullName: userName || "Jet Passports User",
          caseId: caseDetails?._id?.toString(),
          to: email1!,
          password: userKey!,
        };

        // Send verification email only after the first activation
        await this.mailService.sendMail(mailData);
      } catch (error) {
        console.log(error);
      }
      return {
        status: 200,
        success: true,
        message: "Your application was submitted successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changeAccountEmail({
    newEmail,
    oldEmail,
  }: {
    newEmail: string;
    oldEmail: string;
  }) {
    try {
      const existingAccount = await this.accountsModel.findOne({
        email1: newEmail,
      });
      if (existingAccount) {
        return {
          success: false,
          message: "Email already taken",
          status: 400,
        };
      }

      const account = await this.accountsModel.findOne({ email1: oldEmail });
      if (!account) {
        return {
          success: false,
          message: "Account not found",
          status: 400,
        };
      }
      account.email1 = newEmail;
      await account.save();
      try {
        await this.mailService.sendEmailText(
          {
            to: newEmail,
            fullName: account.firstName + " " + account.lastName,
            subject: "Email Changed",
            htmlContent: `
         <p>Dear Customer,</p>

          <p>We would like to inform you that your login email for the Client Portal has been successfully updated.</p>

          <p>Going forward, please use <strong>${newEmail}</strong> to access your account.</p>

          <p>
          If you did not request this change or have any questions, feel free to contact our support team
          via email at <a href="mailto:support@jetpassport.com">support@jetpassport.com</a> or call 202-474-9999.
          </p>

          <p>Sincerely,<br>Jetpassports.com</p>

        `,
          },
          ""
        );
      } catch (error) {
        console.log("Failed to send email to client to inform email change");
      }
      return {
        success: true,
        message: "Email changed successfully",
        status: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendEmailToClient({
    caseId,
    adminName,
    data,
  }: {
    caseId: string;
    adminName: string;
    data: {
      message: string;
      subject: string;
      cc: string[];
    };
  }): ServiceResponse {
    try {
      const caseDetails = await this.casesModel
        .findById(caseId)
        .select("contactInformation.email1");
      if (!caseDetails) {
        return {
          success: false,
          message: "Case not found",
          status: 400,
        };
      }
      const { email1 } = caseDetails.contactInformation!;
      await this.mailService.sendEmailText(
        {
          to: email1!,
          fullName: email1!,
          subject: data.subject,
          htmlContent: data.message,
          cc: data.cc || [],
        },
        caseId
      );
      return {
        success: true,
        message: "Email sent successfully",
        status: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async toggleAutoEmails(caseId: string): ServiceResponse {
    try {
      const caseDetails = await this.casesModel
        .findById(caseId)
        .select("caseInfo");
      if (!caseDetails) {
        return {
          message: "Case not found",
          success: false,
          status: 400,
        };
      }
      caseDetails.caseInfo.disableAutoEmails =
        !caseDetails.caseInfo.disableAutoEmails;
      await caseDetails.save();
      return {
        message: `Auto emails ${
          caseDetails.caseInfo.disableAutoEmails ? "enabled" : "disabled"
        } successfully`,
        success: true,
        status: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
