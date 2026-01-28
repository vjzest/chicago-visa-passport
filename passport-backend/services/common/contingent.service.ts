import { ServiceResponse } from "../../types/service-response.type";
import ENV from "../../utils/lib/env.config";
import MailService from "./mail.service";
import { CasesModel } from "../../models/cases.model";
import { encrypt } from "../../utils/lib/cryptography";

export default class ContingentCaseService {
  mailService = new MailService();

  async sendContingentEmail(
    caseId: string,
    adminName?: string
  ): Promise<ServiceResponse> {
    try {
      const contingentCase = await CasesModel.findById(caseId).select(
        "applicantInfo contactInformation caseInfo"
      );
      if (!contingentCase) {
        return {
          success: false,
          message: "Case not found",
          status: 400,
        };
      }
      const fullName =
        contingentCase.applicantInfo?.firstName +
        " " +
        contingentCase.applicantInfo?.lastName;
      const encryptedCaseId = encrypt(caseId);
      if (contingentCase) {
        const emailContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #5cb85c;">Complete Your Passport Application</h2>
          <p>Dear ${fullName},</p>
          <p>We noticed that you have an incomplete Passport application in our system.</p>
          <p>To continue your application, please click on the following link:</p>
          <p><a href="${ENV?.USER_URL}/apply?contingentcaseid=${encryptedCaseId}" style="color: #5cb85c;">Continue Your Application</a></p>
          <p>link: ${ENV?.USER_URL}/apply?contingentcaseid=${encryptedCaseId}</p>
          <p>If you have any questions or require assistance, please don't hesitate to contact our support team.</p>
        </div>`;

        const data = {
          from: ENV.FROM_EMAIL,
          to: contingentCase?.contactInformation?.email1!,
          fullName: fullName,
          subject: "Jet Passports: Complete Your Passport Application",
          htmlContent: emailContent,
        };

        await this.mailService.sendEmailText(data, contingentCase?._id);

        // Update the emailSentTimes array
        await CasesModel.findByIdAndUpdate(caseId, {
          $push: {
            "caseInfo.contingentMailSentTimes": new Date(),
            notes: {
              autoNote: `Contingent email sent to ${
                contingentCase?.contactInformation?.email1
              } ${
                adminName
                  ? `manually by <strong>${adminName}</strong>`
                  : "automatically"
              }`,
              host: "system",
            },
          },
        });

        return {
          status: 200,
          success: true,
          message: "Contingent email sent successfully",
        };
      } else {
        console.log("Contingent case not found when trying to send mail.");
        return {
          status: 404,
          success: false,
          message: "ContingentCase not found",
        };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
