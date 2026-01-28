import { ServiceResponse } from "../../types/service-response.type";
import { CasesModel } from "../../models/cases.model";
import { TransactionsModel } from "../../models/transaction.model";

export default class RefundService {
  private readonly transactionModel = TransactionsModel;
  private readonly caseModel = CasesModel;

  async createTransaction(data: {
    account: string;
    caseId: string;
    orderId: string;
    amount: number;
    transactionId: string;
    transactionType: string;
  }): Promise<ServiceResponse> {
    try {
      const transaction = await this.transactionModel.create({
        ...data,
        status: "success",
      });

      return {
        status: 201,
        success: true,
        message: "Refund transaction created successfully",
        data: transaction,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateCase(
    caseId: string,
    data: {
      adminName: string;
      refundedAmount: number;
      refundNote: string;
    }
  ): Promise<ServiceResponse> {
    try {
      const updatedCase = await this.caseModel
        .findByIdAndUpdate(
          caseId,
          {
            $set: {
              "refund.isRefunded": true,
              "refund.refundedAmount": data.refundedAmount,
              "refund.refundNote": data.refundNote,
            },
            $push: {
              notes: {
                manualNote: "",
                autoNote: `Case refunded with${data.refundedAmount} by ${data.adminName}`,
              },
              "caseInfo.invoiceInformation": {
                service: "Case refund",
                price: -data.refundedAmount,
              },
            },
          },
          { new: true }
        )
        .populate("account");

      if (!updatedCase) {
        return {
          status: 404,
          success: false,
          message: "Case not found",
        };
      }

      return {
        status: 200,
        success: true,
        message: "Case updated successfully with refund information",
        data: updatedCase,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async updateCaseForVoid(
    caseId: string,
    data: {
      voidAmount: number;
      voidNote: string;
    }
  ): Promise<ServiceResponse> {
    try {
      const updatedCase = await this.caseModel
        .findByIdAndUpdate(
          caseId,
          {
            $set: {
              "void.isVoid": true,
              "void.voidAmount": data.voidAmount,
              "void.voidNote": data.voidNote,
            },
          },
          { new: true }
        )
        .populate("account");

      if (!updatedCase) {
        return {
          status: 404,
          success: false,
          message: "Case not found",
        };
      }

      return {
        status: 200,
        success: true,
        message: "Case updated successfully with refund information",
        data: updatedCase,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
