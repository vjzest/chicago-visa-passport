// @ts-ignore
import SibApiV3Sdk from "sib-api-v3-sdk";
// import TransactionModel from "../../models/transaction.model";
import axios from "axios";
import ENV from "../../utils/lib/env.config";
import { TransactionsModel } from "../../models/transaction.model";
import console from "console";
import { ContactInfoModel } from "../../models/contact-info-model";
import mongoose from "mongoose";
import { CaseEmailsModel } from "../../models/case-emails.model";

export default class MailService {
  private defaultClient = SibApiV3Sdk.ApiClient.instance;
  private apiKey = this.defaultClient.authentications["api-key"];
  private contactsApi = new SibApiV3Sdk.ContactsApi();
  private readonly transactionModel = TransactionsModel;
  private readonly contactInfoModel = ContactInfoModel;

  constructor() {
    this.apiKey.apiKey = ENV.BREVO_API_KEY;
  }

  /// for generate Html invoice (Design)
  private async generateInvoiceHtml(caseId: any, AccountName: string) {
    const caseData: any = await this.transactionModel
      .findOne({ caseId })
      .populate([
        {
          path: "caseId",
          model: "cases",
          populate: [
            { path: "caseInfo.serviceLevel", model: "servicelevels" },
            { path: "caseInfo.serviceType", model: "servicetypes" },
            { path: "caseInfo.caseManager", model: "admins" },
            { path: "caseInfo.processingLocation", model: "shippings" },
            // {path: "applications", model: "applications"},
          ],
          select: "caseInfo billingInfo caseNo _id account",
        },
      ]);

    const adminContact = await this.contactInfoModel.findOne();

    const { amount } = caseData;
    const { billingInfo, caseInfo, caseNo } = caseData?.caseId;
    const serviceLevel = caseInfo?.serviceLevel;

    const caseListingLink = `${ENV.USER_URL}/dashboard/my-applications`;

    const htmlContent = `
   <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f0f0f0; margin: 0; padding: 20px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e5e5e5; border-radius: 8px;">
        <tr>
            <td style="padding: 20px;">
                <table width="100%">
                    <tr>
                        <td>
                            <img src="${process.env.API_URL || 'https://api.chicagopassportsvisa.com'}/assets/logo.svg" alt="Chicago Passport & Visa Expedite Services" style="height: 40px;" />
                        </td>
                        <td style="text-align: right;">
                            <p style="font-size: 14px; color: #3182ce; font-weight: 500; margin: 0;">ORDER CONFIRMATION</p>
                        </td>
                    </tr>
                </table>

                <table width="100%" style="margin-top: 20px;">
                    <tr>
                        <td>
                            <p style="font-size: 14px; color: #4a5568; margin: 0;">Hello <span style="color: #3182ce;">${AccountName}</span></p>
                        </td>
                        <td style="text-align: right;">
                            <p style="font-size: 14px; color: #4a5568; margin: 0;">Case ID: <span style="color: #3182ce;">${caseNo}</span></p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <p style="font-size: 14px; color: #4a5568; margin: 5px 0;">Service Type: <span style="color: #000;">${
                              caseInfo?.serviceType?.serviceType ||
                              "Service Type"
                            }</span></p>
                            <p style="font-size: 14px; color: #4a5568; margin: 5px 0;">Service Level: <span style="color: #000;">${
                              serviceLevel?.serviceLevel
                            } - ${serviceLevel.time}</span></p>
                        </td>
                    </tr>
                </table>

                <table width="100%" style="margin-top: 20px; background-color: #777777; border-radius: 6px;">
                    <tr>
                        <td style="padding: 10px;">
                            <p style="font-size: 14px; color: white; margin: 0;">Dear ${AccountName} your order has been placed and confirmed the Case ID : ${caseNo}. Please proceed to the next steps below in order to submit the necessary documentation required for a ${
      caseInfo?.serviceType?.serviceType || "Passport"
    }. We have passport specialists standing by to assist you when you're ready to review your documents before shipping them in for processing.</p>
                        </td>
                    </tr>
                </table>

                <table width="90%" style="margin-top: 20px;">
                    <tr>
                        <td>
                            <p style="font-size: 18px; color: #2d3748; font-weight: 600; margin: 0 0 10px 0;">Next Steps:</p>
                            <p style="font-size: 14px; color: #4a5568; margin: 0 0 10px 0;">Please click on the link below to access and complete all the necessary forms and steps</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="${caseListingLink}" style="display: flex; flex-direction:column;align-items:center; width: 100%; background-color: #48bb78; color: white; text-align: center; padding: 12px 0; border-radius: 6px; text-decoration: none; margin: 10px; padding: 10px; font-size: 14px;">  <span>CLICK HERE To Access Required Forms and Instructions</span></a>
                        </td>
                    </tr>
                    
                </table>

                <table width="100%" style="margin-top: 20px;">
                    <tr>
                        <td width="48%" style="background-color: #c9e3f5; border-radius: 6px; padding: 15px; vertical-align: top;">
                            <h3 style="font-size: 16px; color: #3182ce; font-weight: 600; margin: 0 0 10px 0; text-align: center;">NEED HELP ?</h3>
                            <p style="font-size: 14px; color: #4a5568; margin: 0 0 10px 0; text-align: center;">Please connect to the number below to reach your Passport specialist ${
                              caseInfo?.caseManager?.firstName
                            } ${
      caseInfo?.caseManager?.lastName
    } during our normal business hours.</p>
                           
                        </td>
                        <td width="4%"></td>
                        <td width="48%" style="background-color: #c9e3f5; border-radius: 6px; padding: 15px; vertical-align: top;">
                            <h3 style="font-size: 16px; color: #3182ce; font-weight: 600; margin: 0 0 10px 0; text-align: center;">CONTACT INFORMATION</h3>
                            <p style="font-size: 14px; color: #4a5568; margin: 0; text-align: center;">${
                              adminContact?.phone
                            }</p>
                            <p style="font-size: 14px; color: #4a5568; margin: 5px 0; text-align: center;">Mon-Fri (9AM - 6PM EST)</p>
                            <p style="font-size: 14px; color: #4a5568; margin: 0; text-align: center;">Sat-Sun (Closed)</p>
                        </td>
                    </tr>
                </table>

                <table width="100%" style="margin-top: 20px;">
                    <tr>
                        <td>
                            <p style="font-size: 14px; color: #4a5568; margin: 0 0 5px 0;">Charge Summary: Your ${
                              billingInfo?.cardNumber?.slice(0, 1) === "4"
                                ? "Visa"
                                : "Card"
                            } ending in ${billingInfo?.cardNumber?.slice(
      -4
    )} has been charged $${amount}</p>
                            <p style="font-size: 14px; color: #4a5568; margin: 0;">(This charge does not include the Government & Acceptance Agent fees that are or will be paid by you to US Department of State)</p>
                        </td>
                    </tr>
                </table>

                <table width="100%" style="margin-top: 20px;">
                    <tr>
                        <td style="text-align: center;">
                            <a href="${
                              ENV.USER_URL
                            }/dashboard/my-applications/${caseId}/invoice" style="display: inline-block; background-color: #3182ce; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px;">VIEW/PRINT YOUR RECEIPT</a>
                        </td>
                    </tr>
                </table>

                <table width="100%" style="margin-top: 20px;">
                    <tr>
                        <td style="text-align: center;">
                            <p style="font-size: 12px; color: #718096; margin: 0 0 5px 0;">We look forward to serving you</p>
                            <p style="font-size: 12px; color: #718096; margin: 0;">Thank you, Chicago Passport & Visa Expedite Services</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
    return htmlContent;
  }

  private addContact = async (
    email: string,
    listId: number,
    attributes: any
  ) => {
    const url = `https://api.brevo.com/v3/contacts`;
    const headers = {
      "api-key": ENV.BREVO_API_KEY,
      accept: "application/json",
      "content-type": "application/json",
    };
    const data = {
      email: email,
      listIds: [listId],
      attributes: attributes,
    };

    try {
      await axios.post(url, data, { headers });
    } catch (error: any) {
      console.error(
        "Error adding/updating contact:",
        error.response ? error.response.data : error.message
      );
    }
  };

  private async checkContactExists(email: string): Promise<boolean> {
    try {
      await this.contactsApi.getContactInfo(email);
      return true;
    } catch (error: any) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  }

  // this function is for generate html and sending the mail

  private sendEmailPdf = async (smsData: {
    from: string;
    fullName: string;
    caseId: string;
    to: string;
    password?: string;
  }) => {
    try {
      const url = "https://api.brevo.com/v3/smtp/email";
      const headers = {
        "api-key": ENV.BREVO_API_KEY,
        accept: "application/json",
        "content-type": "application/json",
      };

      const invoiceHtml = await this.generateInvoiceHtml(
        smsData?.caseId,
        smsData?.fullName
      );

      const data = {
        sender: {
          name: "Chicago Passport & Visa Expedite Services",
          email: ENV.FROM_EMAIL || smsData?.from,
        },
        to: [
          {
            email: smsData?.to,
            name: smsData?.fullName,
          },
        ],
        subject: "Your Passport application Successfully Submitted",
        htmlContent: `
            <h1>Dear ${
              smsData?.fullName
            }, your Passport application has been successfully submitted.</h1>
         ${
           smsData.password
             ? ` <h3 style="color: green;">Please log in with your credentials:</h3>
            <h4><strong>Email:</strong> ${smsData?.to}</h4>
            <h4><strong>Password:</strong> ${smsData?.password}</h4>
            <p style="font-size: 20px; color:rgb(0, 128, 60); margin: 0 0 10px 0;">If you need to apply for additional applicants (Family, Kids, or friends), simply log in to your client portal and click on the blue button on the right: Add More Applicants. </p>
            <br>
            <br>`
             : ""
         }
            ${invoiceHtml}
        `,
      };

      const response = await axios.post(url, data, { headers });
      await CaseEmailsModel.create([
        {
          case: smsData?.caseId,
          content: data.htmlContent,
          recipientEmail: smsData?.to?.trim(),
          subject: data.subject,
          trackingId: response?.data?.messageId,
        },
      ]);
      return response?.data;
    } catch (error: any) {
      console.error(
        "Error sending email:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  // for sending email in pdf format
  public async sendMail(data: {
    from: string;
    fullName: string;
    caseId: string;
    to: string;
    password?: string;
  }) {
    console.log("email data : ", data);
    try {
      const { from, fullName, caseId, to } = data;
      if (!from.trim() || !fullName.trim() || !caseId.trim() || !to.trim()) {
        return {
          message: "Required fields are missing",
          success: false,
          status: 400,
        };
      }

      try {
        const contactExists = await this.checkContactExists(data?.to);

        if (!contactExists) {
          await this.addContact(data?.to, 3, { FIRSTNAME: data?.fullName });
        } else {
          console.log("Contact already exists, proceeding with sending email");
        }
      } catch (error) {
        console.error("Error checking/adding contact:", error);
      }

      const emailResponse = await this.sendEmailPdf(data);
      return {
        message: "Email sent successfully",
        data: emailResponse,
        success: true,
        status: 200,
      };
    } catch (error) {
      console.error("Error in sendMail:", error);
      return {
        message: "Error sending email",
        data: error,
        success: false,
        status: 500,
      };
    }
  }

  public async getEmailEvents(trackingId: string) {
    const url = `https://api.brevo.com/v3/smtp/statistics/events?messageId=${trackingId}`;
    const headers = {
      "api-key": ENV.BREVO_API_KEY,
      accept: "application/json",
      "content-type": "application/json",
    };

    const response = await axios.get(url, { headers });
    return response.data as {
      events: {
        email: string;
        date: string; // ISO date string
        subject: string;
        messageId: string;
        event:
          | "bounces"
          | "hardBounces"
          | "softBounces"
          | "delivered"
          | "spam"
          | "requests"
          | "opened"
          | "clicks"
          | "invalid"
          | "deferred"
          | "blocked"
          | "unsubscribed"
          | "error"
          | "loadedByProxy";
        tag: string;
        ip: string;
        from: string;
      }[];
    };
  }

  eventDescriptions = {
    bounces: "Email could not be delivered due to an unknown error.",
    hardBounces:
      "Email could not be delivered because the recipient's address is invalid or does not exist.",
    softBounces:
      "Email could not be delivered temporarily due to a full inbox or server issues.",
    delivered: "Email was successfully delivered to the recipient's server.",
    spam: "Email was marked as spam by the recipient.",
    requests: "Email was sent to the recipient.",
    opened: "Email was opened by the recipient.",
    clicks: "Recipient clicked on a link within the email.",
    invalid:
      "Email could not be delivered because the recipient's address is invalid.",
    deferred:
      "Email delivery was delayed due to server issues or recipient's mailbox being full.",
    blocked: "Email was blocked by the recipient's server.",
    unsubscribed: "Recipient unsubscribed from future emails.",
    error: "An error occurred during the email sending process.",
    loadedByProxy:
      "Email was loaded by a proxy server, indicating it was likely viewed by the recipient.",
  };

  public async sendEmailText(
    smsData: {
      cc?: string[];
      to: string;
      fullName: string;
      subject: string;
      htmlContent: string;
    },
    caseId: string | mongoose.Types.ObjectId
  ) {
    try {
      console.log("starting function");
      const url = "https://api.brevo.com/v3/smtp/email";
      const headers = {
        "api-key": ENV.BREVO_API_KEY,
        accept: "application/json",
        "content-type": "application/json",
      };
      const contactInfo = await this.contactInfoModel.findOne().select("phone");

      // Format the HTML content with the new template structure
      const formattedHtmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f0f0f0; margin: 0; padding: 20px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e5e5e5; border-radius: 8px;">
      <tbody>
        <tr>
          <td style="padding: 20px;">
            <table width="100%">
              <tbody>
                <tr>
                  <td>
                    <h2 style="font-size: 24px; font-weight: 300; color: #4a5568; margin: 0;">
                      <img src="/assets/logo.svg" alt="Chicago Passport & Visa Expedite" style="height: 40px;" />
                    </h2>
                  </td>
                </tr>
              </tbody>
            </table>

            <table width="100%" style="margin-top: 20px;">
              <tbody>
                <tr>
                  <td>
                    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                      ${smsData.htmlContent}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <table width="100%" style="margin-top: 20px;">
              <tbody>
                <tr>
                  <td style="background-color: #c9e3f5; border-radius: 6px; padding: 15px; vertical-align: top;">
                    <h3 style="font-size: 16px; color: #3182ce; font-weight: 600; margin: 0 0 10px 0; text-align: center;">
                      CONTACT INFORMATION
                    </h3>
                    <p style="font-size: 14px; color: #4a5568; margin: 0; text-align: center;">
                      ${contactInfo?.phone}
                    </p>
                    <p style="font-size: 14px; color: #4a5568; margin: 5px 0; text-align: center;">
                      Mon-Fri (9AM - 6PM EST)
                    </p>
                    <p style="font-size: 14px; color: #4a5568; margin: 0; text-align: center;">
                      Sat-Sun (Closed)
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>

            <table width="100%" style="margin-top: 20px;">
              <tbody>
                <tr>
                  <td style="text-align: center;">
                    <p style="font-size: 12px; color: #718096; margin: 0;">
                      We look forward to serving you
                    </p>
                    <p style="font-size: 12px; color: #718096; margin: 0;">
                      Thank you, Chicago Passport & Visa Expedite Services
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;

      const data = {
        sender: { name: "Chicago Passport & Visa Expedite Services", email: ENV.FROM_EMAIL },
        to: [{ email: smsData?.to?.trim(), name: smsData?.fullName?.trim() }],
        subject: smsData?.subject,
        htmlContent: formattedHtmlContent,
      };

      if (smsData?.cc && smsData?.cc.length > 0) {
        (data as any).cc = smsData.cc.map((email) => ({
          email: email.trim(),
        }));
      }
      console.log("data set", data);
      const { to } = data;
      if (!to[0].name.trim() || !to[0].email.trim()) {
        throw new Error("Required fields are missing");
      }

      const emailResponse = await axios.post(url, data, { headers });
      console.log("email response: ", emailResponse?.data);
      console.log(`Mail sent to ${smsData.to.trim()} : ${smsData.subject}`);
      if (caseId) {
        await CaseEmailsModel.create([
          {
            case: caseId,
            content: formattedHtmlContent,
            recipientEmail: smsData?.to?.trim(),
            subject: smsData?.subject,
            trackingId: emailResponse?.data?.messageId,
          },
        ]);
      }
      return {
        message: "Email sent successfully",
        data: emailResponse.data,
        success: true,
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Error sending email",
        data: error,
        success: false,
        status: 500,
      };
    }
  }
}
