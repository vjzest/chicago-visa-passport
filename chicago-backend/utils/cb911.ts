import axios from "axios";
import ENV from "./lib/env.config";
import { removeHtmlTags } from "./text.utils";
import { CasesModel } from "../models/cases.model";
import { TransactionsModel } from "../models/transaction.model";
import { convertToYMD } from "./date";

interface TokenData {
  value: string;
  expiresAt: Date;
}

export class CB911Service {
  private static instance: CB911Service;
  private tokenData: TokenData | null = null;
  private readonly TOKEN_BUFFER_MINUTES = 15; // 15-minute buffer before actual expiration
  private readonly USERNAME = ENV.CB911_USERNAME;
  private readonly PASSWORD = ENV.CB911_PASSWORD;
  private readonly BASE_URL = ENV.CB911_BASE_URL;
  private constructor() { }

  /**
   * Get the singleton instance of CB911Service
   */
  public static getInstance(): CB911Service {
    if (!CB911Service.instance) {
      CB911Service.instance = new CB911Service();
    }
    return CB911Service.instance;
  }

  /**
   * Check if the current token is valid
   */
  private isTokenValid(): boolean {
    if (!this.tokenData) return false;

    const now = new Date();
    return now < this.tokenData.expiresAt;
  }

  /**
   * Get a valid access token, either from cache or by requesting a new one
   */
  public async getAccessToken(): Promise<string> {
    // Return cached token if it's still valid
    if (this.isTokenValid() && this.tokenData) {
      return this.tokenData.value;
    }

    // Request a new token
    const credential = `${this.USERNAME}:${this.PASSWORD}`;
    const encodedCredential = Buffer.from(credential).toString("base64");

    const { data } = await axios(
      `${this.BASE_URL}/auth`,
      {
        headers: {
          Authorization: `Basic ${encodedCredential}`,
        },
      }
    );

    const token = data.data?.accessToken ?? "";

    // Store token with expiration (60 minutes from now, minus buffer)
    if (token) {
      const expiresAt = new Date();
      expiresAt.setMinutes(
        expiresAt.getMinutes() + 60 - this.TOKEN_BUFFER_MINUTES
      );

      this.tokenData = {
        value: token,
        expiresAt
      };
    }

    return token;
  }

  /**
   * Generate request body for CB911 from a case
   */
  public async getCBReqBodyFromCase(caseId: string) {
    const caseDetails = await CasesModel.findOne({
      _id: caseId
    }).select(
      "caseInfo billingInfo applicantInfo contactInformation submissionDate notes caseNo"
    );

    if (!caseDetails) {
      return "No case details found";
    }

    const invoiceInformation = caseDetails.caseInfo.invoiceInformation || [];
    const inboundShippingFee = invoiceInformation?.find(
      (el) => el.service === "Inbound shipping fee"
    )!;
    const outboundShippingFee = invoiceInformation?.find(
      (el) => el.service === "Outbound shipping fee"
    )!;
    const shippingCharge =
      inboundShippingFee?.price! + outboundShippingFee?.price!;
    const totalCharged = invoiceInformation?.reduce(
      (acc, curr) => acc + (curr.price! > 0 ? curr.price! : 0),
      0
    );
    const transactions = await TransactionsModel.find({
      caseId,
      transactionType: {
        $in: [
          "casepayment",
          "extracharge",
          "serviceLevel-payment",
        ]
      }
    });

    const requestBody = {
      acquire_date: convertToYMD(caseDetails.submissionDate!),
      // coupon_discount: 0, //TODO change to proper discount value
      id: caseDetails.caseNo,
      order_contact_email: caseDetails.contactInformation?.email1,
      order_contact_phone: caseDetails.contactInformation?.phone1,
      order_notes: caseDetails.notes?.map((note) => {
        return `[${convertToYMD(note.createdAt)}] ${removeHtmlTags(note.autoNote || note.manualNote || "")}`;
      }),
      shipping_charge: shippingCharge,
      total_amount: totalCharged,
      total_currency: "USD",
      transactions: transactions.map((txn) => {
        return {
          card: {
            exp_month: txn.card.expiryMonth,
            exp_year: txn.card.expiryYear,
            number: txn.card.number,
          },
          mid: "123456", //TODO The merchant account number or merchant identifier (MID)
          products: txn.products,
          settlement_amount: txn.amount,
          settlement_currency: "USD",
        };
      }),
    };

    return requestBody;
  }

  /**
   * Submit a case to CB911
   */
  public async submitCase(caseId: string) {
    try {
      // Get the request body
      const requestBody = await this.getCBReqBodyFromCase(caseId);

      // Check if there was an error generating the request body
      if (typeof requestBody === "string") {
        return { success: false, error: requestBody };
      }

      // Get a valid token
      const token = await this.getAccessToken();

      if (!token) {
        return { success: false, error: "Failed to obtain access token" };
      }

      // Make the request to CB911
      const response = await axios.post(
        `${this.BASE_URL}/clients/123456/orders`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: `Error submitting case to CB911: ${error.message}`,
        details: error.response?.data || null
      };
    }
  }
}
