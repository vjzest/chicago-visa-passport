import { NextFunction, Response } from "express";
import ENV from "../../utils/lib/env.config";
import axios, { AxiosResponse } from "axios";
import MailService from "../../services/common/mail.service";
import { CasesModel } from "../../models/cases.model";
import { TransactionsModel } from "../../models/transaction.model";
import { ProcessorsModel } from "../../models/processor.model";
import { decrypt } from "../../utils/lib/cryptography";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";
import { getStatusId } from "../../utils/status";

interface ParsedResponse {
  success: boolean;
  message: string;
  transaction_id: string;
  amount?: string;
  order_id: string;
}

function parseResponse(responseBody: string): ParsedResponse {
  // Add null/undefined check
  if (!responseBody || typeof responseBody !== 'string') {
    return {
      success: false,
      message: "Invalid or empty response from payment gateway",
      transaction_id: "",
      amount: "",
      order_id: "",
    };
  }

  const result: { [key: string]: string } = {};
  const pairs = responseBody.split("&");
  pairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    if (key && value) {
      result[key] = decodeURIComponent(value);
    }
  });

  const success = result.response === "1";
  const message = result.responsetext || "Unknown error";

  return {
    success,
    message,
    transaction_id: result.transactionid || "",
    amount: result.amount || "",
    order_id: result.orderid || "",
  };
}

export default class NmiPaymentController {
  private readonly mailService: MailService;
  private readonly caseModel = CasesModel;
  private readonly transactionsModel = TransactionsModel;
  private readonly processorsModel = ProcessorsModel;

  constructor() {
    this.mailService = new MailService();
    this.caseModel = CasesModel;
  }

  async refundPayment(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    const { transactionId, refundNote } = req.body;
    try {
      const transaction = await this.transactionsModel.findOne({
        transactionId,
      });

      if (!transaction) {
        return res
          .status(500)
          .json({ success: false, message: "Transaction not found" });
      }
      const caseDetails: any = await this.caseModel
        .findById(transaction.caseId)
        .select(
          "caseInfo caseNo billingInfo account notes refund contactInformation"
        )
        .populate("account");
      if (!caseDetails) {
        return res
          .status(400)
          .json({ success: false, message: "Case not found" });
      }

      const processor = await this.processorsModel.findById(
        transaction?.paymentProcessor
      );
      if (!processor) {
        return res
          .status(500)
          .json({ success: false, message: "Processor not found" });
      }
      const processorCreds = {
        userName: processor?.userName,
        password: decrypt(processor?.password),
      };
      const refundableTotal =
        transaction.transactionType === "casepayment"
          ? transaction.amount -
          (transaction.returnedAmount ?? 0) -
          Number(transaction.onlineProcessingFee)! -
          transaction.nonRefundableFee!
          : transaction.amount;
      const payload = new URLSearchParams({
        type: "refund",
        ccnumber: caseDetails?.billingInfo?.cardNumber || "",
        ccexp: caseDetails?.billingInfo?.expirationDate || "",
        cvv: caseDetails?.billingInfo?.cardVerificationCode || "",
        transaction_id: transaction?.transactionId,
        amount: refundableTotal.toFixed(2),
        username: processorCreds.userName,
        password: processorCreds.password,
      });

      const response: AxiosResponse<string> = await axios.post(
        ENV.NMI_API_URL!,
        payload,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 10000, // Increased timeout to 10 seconds
        }
      );

      const parsedResponse = parseResponse(response?.data);

      console.log("nmi refund res : ", parsedResponse);
      if (parsedResponse.success) {
        await this.transactionsModel.create({
          account: caseDetails.account?._id,
          caseId: transaction.caseId,
          orderId: `${parsedResponse.transaction_id}-${transaction.caseId}`,
          amount: refundableTotal,
          transactionId: parsedResponse.transaction_id,
          transactionType: "refund",
          status: "success",
          paymentProcessor: processor._id,
        });

        if (transaction.transactionType === "casepayment") {
          caseDetails.caseInfo.invoiceInformation?.push({
            service: `REFUND : Case payment`,
            price: -refundableTotal,
          });
          caseDetails?.notes.push({
            autoNote: `Case payment refunded with $${refundableTotal} by ${req.admin.firstName + " " + req.admin.lastName
              }. Note : "${refundNote}". Terms and Conditions accepted at the time of purchase apply. TID: ${parsedResponse?.transaction_id
              }. GATEWAY: ${processor.processorName}`,
            host: "system",
          });
          caseDetails.refund.isRefunded = true;
          caseDetails.refund.refundedAmount = refundableTotal;
          caseDetails.refund.refundNote = refundNote;
          caseDetails.caseInfo.status = await getStatusId("refunded");
        } else {
          caseDetails.caseInfo.invoiceInformation?.push({
            service: `REFUND : ${transaction.description}`,
            price: -refundableTotal,
          });
          caseDetails?.notes.push({
            autoNote: `Addon payment refunded with $${refundableTotal} by ${req.admin.firstName + " " + req.admin.lastName
              }. Terms and Conditions accepted at the time of purchase apply. TID: ${parsedResponse?.transaction_id
              }. GATEWAY: ${processor.processorName}`,
            host: "system",
          });
        }
        transaction.returnedAmount = refundableTotal;
        transaction.refundOrVoidStatus = "refund";
        await transaction.save();
        await caseDetails.save();

        res
          .status(200)
          .json({ success: true, message: parsedResponse.message });
        // Construct the email content for the refund notification
        const refundEmailContent = `
                <h2>Refund Processed</h2>
                <p>Dear ${caseDetails?.account?.firstName +
          " " +
          caseDetails?.account?.lastName
          },</p>
                <p>We are pleased to inform you that a refund of $${refundableTotal} has been successfully processed for your passport application (Case ID: ${caseDetails?.caseNo
          }).</p>
                <p>Transaction ID: ${parsedResponse?.transaction_id}</p>
                <p>If you have any questions or require further assistance, please don't hesitate to contact our support team.</p>
                `;

        // Send the email to the user
        const refundEmailData = {
          from: ENV.FROM_EMAIL,
          to: caseDetails?.contactInformation?.email1,
          fullName: `${caseDetails.account?.firstName + " " + caseDetails.account?.lastName
            }`,
          subject: "Refund Processed",
          htmlContent: refundEmailContent,
        };

        await this.mailService.sendEmailText(refundEmailData, caseDetails?._id);
        return;
      }

      res.status(400).json({ success: false, message: parsedResponse.message });
    } catch (error) {
      console.error("Error initiating payment:", error);
      res
        .status(500)
        .json({ success: false, message: "Payment initiation failed" });
    }
  }
  async voidTransaction(req: AuthenticatedAdminRequest, res: Response) {
    const { transactionId, isWithoutNRF, voidNote } = req.body;
    try {
      const transaction = await this.transactionsModel.findOne({
        transactionId,
      });

      if (!transaction) {
        return res
          .status(500)
          .json({ success: false, message: "Transaction not found" });
      }
      const caseDetails: any = await this.caseModel
        .findById(transaction.caseId)
        .select(
          "caseInfo caseNo billingInfo account notes void contactInformation"
        )
        .populate("account");
      if (!caseDetails) {
        return res
          .status(400)
          .json({ success: false, message: "Case not found" });
      }

      const processor = await this.processorsModel.findById(
        transaction?.paymentProcessor
      );
      if (!processor) {
        return res
          .status(500)
          .json({ success: false, message: "Processor not found" });
      }
      const processorCreds = {
        userName: processor?.userName,
        password: decrypt(processor?.password),
      };

      // Calculate the amount to void
      let voidableAmount =
        transaction.amount -
        Number(transaction.onlineProcessingFee ?? 0) -
        transaction.returnedAmount!;
      // If isWithoutNRF is true, exclude the Non-Refundable Fee (NRF)
      if (isWithoutNRF && transaction.transactionType === "casepayment") {
        voidableAmount -= transaction.nonRefundableFee!;
        // Ensure the voidable amount is not negative
        if (voidableAmount < 0) voidableAmount = 0;
      }

      const payload = new URLSearchParams({
        type: "void",
        transaction_id: transaction.transactionId,
        amount: voidableAmount.toFixed(2),
        username: processorCreds.userName,
        password: processorCreds.password,
      });

      const response: AxiosResponse<string> = await axios.post(
        ENV.NMI_API_URL!,
        payload,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 10000,
        }
      );

      const parsedResponse = parseResponse(response?.data);
      console.log("nmi void res:", parsedResponse);
      if (parsedResponse.success) {
        await this.transactionsModel.create({
          account: transaction.account as any,
          caseId: transaction.caseId,
          orderId: `${parsedResponse.transaction_id}-${transaction.caseId}`,
          amount: voidableAmount,
          transactionId: parsedResponse.transaction_id,
          transactionType: "void",
          paymentProcessor: processor._id,
        });
        if (transaction.transactionType === "casepayment") {
          caseDetails.caseInfo.invoiceInformation?.push({
            service: `VOID : Case payment`,
            price: -voidableAmount,
          });
          caseDetails?.notes.push({
            autoNote: `Case payment voided with $${voidableAmount} ${isWithoutNRF ? "excluding NRF" : ""
              } by ${req.admin.firstName + " " + req.admin.lastName
              }. Note : "${voidNote}". Terms and Conditions accepted at the time of purchase apply. TID: ${parsedResponse?.transaction_id
              }. GATEWAY: ${processor.processorName}`,
            host: "system",
          });
          caseDetails.void.isVoid = true;
          caseDetails.void.voidAmount = voidableAmount;
          caseDetails.void.voidNote = voidNote;
          caseDetails.caseInfo.status = await getStatusId("voided");
        } else {
          caseDetails.caseInfo.invoiceInformation?.push({
            service: `VOID : ${transaction.description}`,
            price: -voidableAmount,
          });
          caseDetails?.notes.push({
            autoNote: `Addon payment voided with $${voidableAmount} by ${req.admin.firstName + " " + req.admin.lastName
              }. Terms and Conditions accepted at the time of purchase apply. TID: ${parsedResponse?.transaction_id
              }. GATEWAY: ${processor.processorName}`,
            host: "system",
          });
        }
        transaction.returnedAmount = voidableAmount;
        transaction.refundOrVoidStatus = "void";

        await transaction.save();
        await caseDetails.save();
        return res.status(200).json({
          success: true,
          message: "Transaction voided successfully",
        });
      }
      res.status(400).json({
        success: false,
        message: parsedResponse.message,
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      res
        .status(500)
        .json({ success: false, message: "Payment initiation failed" });
    }
  }
}
