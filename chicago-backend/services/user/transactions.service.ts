import { ConfigModel } from "../../models/config.model";
import { TransactionsModel } from "../../models/transaction.model";
// import TransactionsModel from "../../models/transaction.model";

import { ServiceResponse } from "../../types/service-response.type";

export default class TransactionService {
  //   private readonly casesModel = CasesModel;
  private readonly transactionModel = TransactionsModel;
  private readonly configModel = ConfigModel;

  async findAll(accountId: string): ServiceResponse<any[]> {
    try {
      // Find all cases for the given account
      const invoice = await this.transactionModel
        .find({ account: accountId, transactionType: { $ne: "extracharge" } })
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
            select: ["-formInstance", "-notes"],
          },
        ]);

      if (!invoice || invoice.length === 0) {
        return {
          status: 400,
          success: false,
          message: "No cases found for this account",
        };
      }

      // Fetch the config document
      const config = await this.configModel.findOne();

      // Process additional shipping options for each case
      const processedCases = await Promise.all(
        invoice?.map(async (caseData: any) => {
          const additionalShippingOptions =
            caseData?.caseId?.caseInfo?.additionalShippingOptions;
          const processedShippingOptions = [];

          if (additionalShippingOptions && config && config?.fedex) {
            for (const [key, value] of Object.entries(
              additionalShippingOptions
            )) {
              if (value === true) {
                const fedexOption = config.fedex.find(
                  (option) => option.title === key
                );
                if (fedexOption) {
                  processedShippingOptions.push({
                    title: fedexOption.title,
                    price: fedexOption.price,
                  });
                }
              }
            }
          }

          return {
            ...caseData.toObject(),
            additionalShippingOptions: processedShippingOptions,
          };
        })
      );

      return {
        status: 200,
        success: true,
        message: "Transactions successfully fetched",
        data: processedCases,
      };
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }

  async findAllPaymentsByCase(caseId: string): ServiceResponse {
    try {
      // Find all transactions for the given case
      const transactions = await this.transactionModel.find({
        caseId,
        transactionType: {
          $in: ["casepayment", "extracharge", "serviceLevel-payment"],
        },
      });

      if (!transactions || transactions.length === 0) {
        return {
          status: 400,
          success: false,
          message: "No transactions found for this case",
        };
      }

      return {
        status: 200,
        success: true,
        message: "Transactions successfully fetched",
        data: transactions,
      };
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }

  async findOne(accountId: string, caseId: string): Promise<any> {
    try {
      // Find all transactions for the given case
      const transactions: any[] = await this.transactionModel
        .find({
          caseId,
          transactionType: { $ne: "extracharge" },
        })
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
            select: ["-formInstance", "-notes"],
          },
        ]);

      if (!transactions || transactions.length === 0) {
        return {
          status: 400,
          success: false,
          message: "No transactions found for this case",
        };
      }

      let latestPayment: any = null;
      let latestRefund: any = null;

      // Separate payment and refund transactions if there are multiple
      if (transactions.length > 1) {
        const paymentTransactions = transactions.filter(
          (transaction) => transaction.transactionType === "casepayment"
        );
        const refundTransactions = transactions.filter(
          (transaction) => transaction.transactionType === "refund"
        );

        paymentTransactions.sort((a: any, b: any) => b.createdAt - a.createdAt);
        refundTransactions.sort((a: any, b: any) => b.createdAt - a.createdAt);

        latestPayment = paymentTransactions[0]; // Most recent payment
        latestRefund = refundTransactions[0]; // Most recent refund (if any)
      } else {
        // If only one transaction, set it accordingly
        latestPayment =
          transactions[0]?.transactionType === "casepayment"
            ? transactions[0]
            : null;
        latestRefund =
          transactions[0]?.transactionType === "refund"
            ? transactions[0]
            : null;
      }

      // Fetch the config document for shipping options
      const config = await this.configModel.findOne();

      // Process additional shipping options (if latestPayment exists)
      const additionalShippingOptions =
        latestPayment?.caseId?.caseInfo?.additionalShippingOptions;
      const processedShippingOptions = [];

      if (additionalShippingOptions && config?.fedex) {
        for (const [key, value] of Object.entries(additionalShippingOptions)) {
          if (value === true) {
            const fedexOption = config.fedex.find(
              (option) => option.title === key
            );
            if (fedexOption) {
              processedShippingOptions.push({
                title: fedexOption.title,
                price: fedexOption.price,
              });
            }
          }
        }
      }

      // Add processed shipping options to the payment transaction
      if (latestPayment) {
        latestPayment.additionalShippingOptions = processedShippingOptions;
      }
      if (latestRefund) {
        latestRefund.additionalShippingOptions = processedShippingOptions;
      }

      // Prepare the response data, only include non-null transactions
      const responseData: any[] = [];

      if (latestPayment) responseData.push(latestPayment?.toObject());
      if (latestRefund) responseData.push(latestRefund?.toObject());

      return {
        status: 200,
        success: true,
        message: "Case and transactions fetched successfully",
        data: responseData,
      };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }
}
