import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import ENV from "../../utils/lib/env.config";
import {
  ITransaction,
  TransactionsModel,
} from "../../models/transaction.model";
import { selectPaymentProcessor } from "../../utils/lib/load-balancer";
import { decrypt } from "../../utils/lib/cryptography";
import { ServiceLevelsModel } from "../../models/service-level.model";
import { ServiceTypesModel } from "../../models/service-type.model";
import { AdditionalServicesModel } from "../../models/additional.service.model";
import { PromoCodesModel } from "../../models/promo.models";
import { ProcessorsModel } from "../../models/processor.model";
import { maskCCNumber } from "../../utils/text.utils";

dotenv.config();

interface PaymentData {
  ccnumber: string;
  ccexp: string;
  cvv: string;
  caseId: string;
  caseNo: string;
  account: any;
  serviceLevel: string;
  additionalServices: {
    service: string;
    addons: string[];
  }[];
  serviceType: string;
  appliedPromo: string;
  isInternational: boolean;
  onlineProcessingFee?: string;
  formattedAdditionalServices?: any;
  paymentProcessor?: string;
  services: {
    service: string;
    price: number;
  }[];
}
interface shippingPaymentData {
  ccnumber: string;
  ccexp: string;
  cvv: string;
  caseId: string;
  caseNo: string;
  account: any;
  amount: number;
  isInternational: boolean;
  description: string;
  services: {
    service: string;
    price: number;
  }[];
}

interface ParsedResponse {
  success: boolean;
  code: number;
  message: string;
  transaction_id: string;
  amount?: string;
  order_id: string;
}
class NmiPaymentService {
  private readonly transactionsModel = TransactionsModel;
  private readonly processorModel = ProcessorsModel;

  async processPayment(paymentData: PaymentData): Promise<
    ParsedResponse & {
      usedProcessorId: mongoose.Types.ObjectId | string;
      firstTransactionId?: string;
      promoDiscount: number;
      promoCode: string;
      notes: {
        autoNote: string;
        createdAt: Date;
        host: "system";
      }[];
      failedTransaction: "first" | "second" | null;
    }
  > {
    const {
      ccnumber,
      ccexp,
      cvv,
      serviceType,
      appliedPromo,
      serviceLevel,
      caseId,
      isInternational,
      account,
      onlineProcessingFee,
      caseNo,
    } = paymentData;
    const orderId = `${caseId}-${Date.now()}`;
    console.log(paymentData);
    // Validate input data
    if (
      !ccnumber.trim() ||
      !ccexp.trim() ||
      !serviceType.trim() ||
      !cvv.trim() ||
      !serviceLevel.trim() ||
      !caseId.trim() ||
      !account.trim()
    ) {
      throw new Error("Invalid payment data");
    }
    const paymentNotes: {
      autoNote: string;
      createdAt: Date;
      host: "system";
    }[] = [];
    try {
      const serviceLevelResponse: any = await ServiceLevelsModel.findById(
        serviceLevel
      );
      const visaTypeResponse: any = await ServiceTypesModel.findById(
        serviceType
      );
      const additionalServiceResponse = await AdditionalServicesModel.find({
        _id: {
          $in: paymentData.additionalServices?.map(
            (elem) => new mongoose.Types.ObjectId(elem.service)
          ),
        },
      });
      let additionalServicesTotal = 0;
      const authMethod = serviceLevelResponse?.authOnlyFrontend;
      paymentData.additionalServices?.forEach((service, index) => {
        const doc = additionalServiceResponse?.find(
          (elem) => String(elem._id) === service?.service
        );
        if (doc) {
          const addonTotal = service?.addons?.reduce((acc, addon) => {
            const addonDoc = doc?.addons?.find(
              (elem) => String(elem?._id) === addon
            );
            if (addonDoc) {
              return acc + Number(addonDoc?.price || "0");
            }
            return acc;
          }, 0);
          additionalServicesTotal += addonTotal;
        }
        additionalServicesTotal += doc?.price || 0;
      });

      if (!serviceLevelResponse || !visaTypeResponse) {
        throw new Error("Invalid service level or Service type");
      }

      const serviceFee = Number(serviceLevelResponse?.price || "0");
      const nonRefundableFee = Number(
        serviceLevelResponse.nonRefundableFee || "0"
      );
      const shipping =
        Number(serviceLevelResponse?.inboundFee || "0") +
        Number(serviceLevelResponse?.outboundFee || "0");
      // const govtFee = parseInt(visaTypeResponse?.governmentFee || "0");
      // const embassyFee = parseInt(visaTypeResponse?.embassyFee || "0");

      const serviceLevelTotal = serviceFee + shipping + nonRefundableFee;
      // const otherFeesTotal = govtFee + embassyFee;
      // Extract consular fee from services array if present
      const consularFeeItem = paymentData.services?.find((s) => s.service === "Consular Fee");
      const consularFee = consularFeeItem?.price || 0;

      let totalAmount = serviceLevelTotal + additionalServicesTotal + consularFee;

      let discount = 0;
      let promoCode = "";
      if (appliedPromo) {
        console.log("applied promo : ", appliedPromo);
        const promoResponse = await PromoCodesModel.findById(appliedPromo);
        if (!promoResponse) throw new Error("Invalid promo code");
        if (!promoResponse.isActive)
          throw new Error("This promo code is not active");
        if (promoResponse.isDeleted)
          throw new Error("This promo code is no longer available");
        const startDay = new Date(promoResponse.startDate).setHours(0, 0, 0);
        const endDay = new Date(promoResponse.endDate).setHours(23, 59, 59);
        const currentDay = new Date().setHours(0, 0, 0);
        if (currentDay < startDay || currentDay > endDay) {
          throw new Error("This promo code is not valid for the current date");
        }

        if (
          serviceLevelTotal < promoResponse?.min ||
          serviceLevelTotal > promoResponse?.max
        ) {
          throw new Error(
            `This promo code is only valid for service level fees between $${promoResponse?.min} and $${promoResponse?.max}`
          );
        }

        if (promoResponse?.codeType === "flat") {
          discount = Math.min(
            promoResponse.discount,
            serviceLevelTotal + additionalServicesTotal
          );
        } else if (promoResponse.codeType === "off") {
          discount = Math.min(
            ((serviceLevelTotal + additionalServicesTotal) *
              promoResponse.discount) /
            100,
            serviceLevelTotal + additionalServicesTotal
          );
        } else {
          throw new Error("Invalid promo code type");
        }
        promoCode = promoResponse.code;

        totalAmount -= discount;
      }

      totalAmount = Math.max(totalAmount, 0);

      const percentageOfTotal =
        (totalAmount * Number(onlineProcessingFee!) || 0) / 100;
      const superTotalAmt = totalAmount + Number(percentageOfTotal.toFixed(2));
      console.log({
        serviceLevelTotal,
        additionalServicesTotal,
        totalAmount,
        percentageOfTotal,
      });
      const isDoubleCharge = serviceLevelResponse?.doubleCharge === "double";

      let firstTransactionResponse = null;
      let secondTransactionResponse = null;
      let processorCreds = null;
      if (paymentData.paymentProcessor) {
        const matchingProcessor = await ProcessorsModel.findById(
          paymentData.paymentProcessor
        );
        if (!matchingProcessor) throw new Error("Invalid payment processor");
        processorCreds = {
          _id: matchingProcessor?._id,
          userName: matchingProcessor?.userName,
          password: decrypt(matchingProcessor?.password),
          processorName: matchingProcessor?.processorName,
        };
      } else {
        processorCreds = await selectPaymentProcessor();
      }
      if (!processorCreds) {
        throw new Error("No processor found");
      }
      if (isDoubleCharge) {
        switch (authMethod) {
          case "authorize_nrf_capture_service":
            // First: Authorize non-refundable fee
            firstTransactionResponse = await this.processNMITransaction({
              type: "auth",
              amount: Number((nonRefundableFee + percentageOfTotal).toFixed(2)),
              ccnumber,
              ccexp,
              cvv,
              caseNo,
              account,
              isInternational,
              processorCreds,
            });

            if (!firstTransactionResponse?.success) {
              paymentNotes.push({
                autoNote: `<strong style="color: red;">Failed</strong>
                to authorize non-refundable fee ${percentageOfTotal > 0 ? "+ OPF " : ""
                  } of $${Number(
                    (nonRefundableFee + percentageOfTotal).toFixed(2)
                  )} MESSAGE : 
                 "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${firstTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
              return {
                ...firstTransactionResponse,
                promoDiscount: Math.min(totalAmount, discount),
                promoCode,
                notes: paymentNotes,
                failedTransaction: "first",
              };
            }
            paymentNotes.push({
              autoNote: `<strong style="color: green;">Successfully</strong>
              authorized non-refundable fee ${percentageOfTotal > 0 ? "+ OPF " : ""
                } of $${Number(
                  (nonRefundableFee + percentageOfTotal).toFixed(2)
                )} MESSAGE :
               "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                }. TID : ${firstTransactionResponse.transaction_id}
              `,
              createdAt: new Date(),
              host: "system",
            });

            // Second: Capture remaining amount
            const remainingAmount = Number(
              totalAmount -
              nonRefundableFee -
              Number(percentageOfTotal.toFixed(2))
            );
            secondTransactionResponse = await this.processNMITransaction({
              type: "sale",
              amount: remainingAmount,
              ccnumber,
              ccexp,
              cvv,
              caseNo,
              account,
              isInternational,
              processorCreds,
            });
            if (!secondTransactionResponse?.success) {
              paymentNotes.push({
                autoNote: `<strong style="color: red;">Failed</strong>
                to capture remaining amount of $${remainingAmount} MESSAGE :
                 "${secondTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${secondTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
              return {
                ...secondTransactionResponse,
                promoDiscount: Math.min(totalAmount, discount),
                promoCode,
                notes: paymentNotes,
                failedTransaction: "second",
              };
            }
            paymentNotes.push({
              autoNote: `<strong style="color: green;">Successfully</strong>
              captured remaining amount of $${remainingAmount} MESSAGE :
               "${secondTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                }. TID : ${secondTransactionResponse.transaction_id}
              `,
              createdAt: new Date(),
              host: "system",
            });
            break;

          case "capture_both":
            // First: Capture non-refundable fee
            firstTransactionResponse = await this.processNMITransaction({
              type: "sale",
              amount: Number((nonRefundableFee + percentageOfTotal).toFixed(2)),
              ccnumber,
              ccexp,
              cvv,
              account,
              caseNo,
              isInternational,
              processorCreds,
            });

            if (!firstTransactionResponse?.success) {
              paymentNotes.push({
                autoNote: `<strong style="color: red;">Failed</strong>
                to capture non-refundable fee ${percentageOfTotal > 0 ? "+ OPF " : ""
                  } of $${Number(
                    (nonRefundableFee + percentageOfTotal).toFixed(2)
                  )} MESSAGE :
                 "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${firstTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
              return {
                ...firstTransactionResponse,
                promoDiscount: Math.min(totalAmount, discount),
                promoCode,
                notes: paymentNotes,
                failedTransaction: "first",
              };
            }
            paymentNotes.push({
              autoNote: `<strong style="color: green;">Successfully</strong>
              captured non-refundable fee ${percentageOfTotal > 0 ? "+ OPF " : ""
                } of $${Number(
                  (nonRefundableFee + percentageOfTotal).toFixed(2)
                )} MESSAGE :
               "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                }. TID : ${firstTransactionResponse.transaction_id}
              `,
              createdAt: new Date(),
              host: "system",
            });

            // Second: Capture remaining amount
            secondTransactionResponse = await this.processNMITransaction({
              type: "sale",
              amount: Number(
                totalAmount -
                nonRefundableFee -
                Number(percentageOfTotal.toFixed(2))
              ),
              ccnumber,
              ccexp,
              cvv,
              account,
              caseNo,
              isInternational,
              processorCreds,
            });
            if (!secondTransactionResponse?.success) {
              paymentNotes.push({
                autoNote: `<strong style="color: red;">Failed</strong>
                to capture remaining amount of $${Number(
                  totalAmount -
                  nonRefundableFee -
                  Number(percentageOfTotal.toFixed(2))
                )} MESSAGE :
                 "${secondTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${secondTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
              return {
                ...secondTransactionResponse,
                promoDiscount: Math.min(totalAmount, discount),
                promoCode,
                notes: paymentNotes,
                failedTransaction: "second",
              };
            }
            paymentNotes.push({
              autoNote: `<strong style="color: green;">Successfully</strong>
              captured remaining amount of $${Number(
                totalAmount -
                nonRefundableFee -
                Number(percentageOfTotal.toFixed(2))
              )} MESSAGE :
               "${secondTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                }. TID : ${secondTransactionResponse.transaction_id}
              `,
              createdAt: new Date(),
              host: "system",
            });
            break;

          case "authorize_both":
            // First: Authorize non-refundable fee
            firstTransactionResponse = await this.processNMITransaction({
              type: "auth",
              amount: Number((nonRefundableFee + percentageOfTotal).toFixed(2)),
              ccnumber,
              ccexp,
              cvv,
              account,
              caseNo,
              isInternational,
              processorCreds,
            });

            if (!firstTransactionResponse?.success) {
              paymentNotes.push({
                autoNote: `<strong style="color: red;">Failed</strong>
                to authorize non-refundable fee ${percentageOfTotal > 0 ? "+ OPF " : ""
                  } of $${Number(
                    (nonRefundableFee + percentageOfTotal).toFixed(2)
                  )} MESSAGE :
                 "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${firstTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
              return {
                ...firstTransactionResponse,
                promoDiscount: Math.min(totalAmount, discount),
                promoCode,
                notes: paymentNotes,
                failedTransaction: "first",
              };
            }
            paymentNotes.push({
              autoNote: `<strong style="color: green;">Successfully</strong>
              authorized non-refundable fee ${percentageOfTotal > 0 ? "+ OPF " : ""
                } of $${Number(
                  (nonRefundableFee + percentageOfTotal).toFixed(2)
                )} MESSAGE :
               "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                }. TID : ${firstTransactionResponse.transaction_id}
              `,
              createdAt: new Date(),
              host: "system",
            });

            // Second: Authorize remaining amount
            secondTransactionResponse = await this.processNMITransaction({
              type: "auth",
              amount: Number(
                totalAmount -
                nonRefundableFee -
                Number(percentageOfTotal.toFixed(2))
              ),
              ccnumber,
              ccexp,
              cvv,
              account,
              caseNo,
              isInternational,
              processorCreds,
            });
            if (!secondTransactionResponse?.success) {
              paymentNotes.push({
                autoNote: `<strong style="color: red;">Failed</strong>
                to authorize remaining amount of $${Number(
                  totalAmount -
                  nonRefundableFee -
                  Number(percentageOfTotal.toFixed(2))
                )} MESSAGE :
                 "${secondTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${secondTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
              return {
                ...secondTransactionResponse,
                promoDiscount: Math.min(totalAmount, discount),
                promoCode,
                notes: paymentNotes,
                failedTransaction: "second",
              };
            }
            paymentNotes.push({
              autoNote: `<strong style="color: green;">Successfully</strong>
              authorized remaining amount of $${Number(
                totalAmount -
                nonRefundableFee -
                Number(percentageOfTotal.toFixed(2))
              )} MESSAGE :
               "${secondTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                }. TID : ${secondTransactionResponse.transaction_id}
              `,
              createdAt: new Date(),
              host: "system",
            });
            break;

          default:
            // Default double charge behavior (both as sales)
            firstTransactionResponse = await this.processNMITransaction({
              type: "sale",
              amount: Number((nonRefundableFee + percentageOfTotal).toFixed(2)),
              ccnumber,
              ccexp,
              cvv,
              account,
              caseNo,
              isInternational,
              processorCreds,
            });

            if (!firstTransactionResponse?.success) {
              paymentNotes.push({
                autoNote: `<strong style="color: red;">Failed</strong>
                to charge non-refundable fee ${percentageOfTotal > 0 ? "+ OPF " : ""
                  } of $${Number(
                    (nonRefundableFee + percentageOfTotal).toFixed(2)
                  )} MESSAGE :
                 "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${firstTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
              return {
                ...firstTransactionResponse,
                promoDiscount: Math.min(totalAmount, discount),
                promoCode,
                notes: paymentNotes,
                failedTransaction: "first",
              };
            }
            paymentNotes.push({
              autoNote: `<strong style="color: green;">Successfully</strong>
              charged non-refundable fee ${percentageOfTotal > 0 ? "+ OPF " : ""
                } of $${Number(
                  (nonRefundableFee + percentageOfTotal).toFixed(2)
                )} MESSAGE :
               "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                }. TID : ${firstTransactionResponse.transaction_id}
              `,
              createdAt: new Date(),
              host: "system",
            });

            secondTransactionResponse = await this.processNMITransaction({
              type: "sale",
              amount: Number(
                totalAmount -
                nonRefundableFee -
                Number(percentageOfTotal.toFixed(2))
              ),
              ccnumber,
              ccexp,
              cvv,
              account,
              caseNo,
              isInternational,
              processorCreds,
            });
            if (!secondTransactionResponse?.success) {
              paymentNotes.push({
                autoNote: `<strong style="color: red;">Failed</strong>
                to charge remaining amount of $${Number(
                  totalAmount -
                  nonRefundableFee -
                  Number(percentageOfTotal.toFixed(2))
                )} MESSAGE :
                 "${secondTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${secondTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
              return {
                ...secondTransactionResponse,
                promoDiscount: Math.min(totalAmount, discount),
                promoCode,
                notes: paymentNotes,
                failedTransaction: "second",
              };
            }
            paymentNotes.push({
              autoNote: `<strong style="color: green;">Successfully</strong>
              charged remaining amount of $${Number(
                totalAmount -
                nonRefundableFee -
                Number(percentageOfTotal.toFixed(2))
              )} MESSAGE :
               "${secondTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                }. TID : ${secondTransactionResponse.transaction_id}
              `,
              createdAt: new Date(),
              host: "system",
            });
        }
      } else {
        switch (authMethod) {
          //PENDING clarification needed on whether single charge needs this below type
          case "authorize_nrf_capture_service":
            // Authorize non-refundable fee
            firstTransactionResponse = await this.processNMITransaction({
              type: "auth",
              amount: Number((nonRefundableFee + percentageOfTotal).toFixed(2)),
              ccnumber,
              ccexp,
              cvv,
              account,
              isInternational,
              caseNo,
              processorCreds,
            });

            if (!firstTransactionResponse?.success) {
              throw new Error("Non-refundable fee authorization failed");
            }

            // Capture service fee
            const serviceFeeTotal = superTotalAmt - nonRefundableFee;
            secondTransactionResponse = await this.processNMITransaction({
              type: "sale",
              amount: serviceFeeTotal,
              ccnumber,
              ccexp,
              cvv,
              account,
              caseNo,
              isInternational,
              processorCreds,
            });
            break;

          case "capture_both":
            firstTransactionResponse = await this.processNMITransaction({
              type: "sale",
              amount: Number(superTotalAmt?.toFixed(2)),
              ccnumber,
              ccexp,
              cvv,
              account,
              caseNo,
              isInternational,
              processorCreds,
            });
            console.log("first tn res: ", firstTransactionResponse);
            if (!firstTransactionResponse.success) {
              paymentNotes.push({
                autoNote: `<strong style="color: red;">Failed</strong>
                to charge <strong>total</strong> amount fee of $${superTotalAmt} MESSAGE :
                 "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${firstTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
            } else {
              paymentNotes.push({
                autoNote: `<strong style="color: green;">Successfully</strong>
              charged <strong>total</strong> amount fee of $${superTotalAmt} MESSAGE :
               "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${firstTransactionResponse.transaction_id}
              `,
                createdAt: new Date(),
                host: "system",
              });
            }

            break;

          case "authorize_both":
            // Authorize both amounts separately
            firstTransactionResponse = await this.processNMITransaction({
              type: "auth",
              amount: Number(superTotalAmt?.toFixed(2)),
              ccnumber,
              ccexp,
              cvv,
              caseNo,
              account,
              isInternational,
              processorCreds,
            });

            if (!firstTransactionResponse?.success) {
              paymentNotes.push({
                autoNote: `<strong style="color: red;">Failed</strong>
                to authorize <strong>total</strong> amount fee of $${superTotalAmt} MESSAGE :
                 "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${firstTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
            } else {
              paymentNotes.push({
                autoNote: `<strong style="color: green;">Successfully</strong>
                authorized <strong>total</strong> amount fee of $${superTotalAmt} MESSAGE :
                 "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${firstTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
            }
            break;

          default:
            // Single sale transaction for backward compatibility
            firstTransactionResponse = await this.processNMITransaction({
              type: "sale",
              amount: superTotalAmt,
              ccnumber,
              ccexp,
              cvv,
              account,
              caseNo,
              isInternational,
              processorCreds,
            });

            if (!firstTransactionResponse.success) {
              paymentNotes.push({
                autoNote: `<strong style="color: red;">Failed</strong>
                to charge <strong>total</strong> amount fee of $${superTotalAmt} MESSAGE :
                 "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${firstTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
            } else {
              paymentNotes.push({
                autoNote: `<strong style="color: green;">Successfully</strong>
                charged <strong>total</strong> amount fee of $${superTotalAmt} MESSAGE :
                 "${firstTransactionResponse?.message!}". GATEWAY: ${processorCreds.processorName
                  }. TID : ${firstTransactionResponse.transaction_id}
                `,
                createdAt: new Date(),
                host: "system",
              });
            }
        }
        // console.log("PAYMENT RESPONSE", response.data);
      }
      if (
        firstTransactionResponse?.success &&
        (!isDoubleCharge || secondTransactionResponse?.success)
      ) {
        // Save first transaction
        await this.saveTransaction({
          card: {
            number: maskCCNumber(ccnumber),
            expiryMonth: ccexp.slice(0, 2),
            expiryYear: ccexp.slice(2, 4),
          },
          account,
          caseId: caseId,
          orderId,
          discount: isDoubleCharge ? 0 : discount,
          serviceFee: isDoubleCharge ? nonRefundableFee : serviceFee,
          processingFee: isDoubleCharge ? 0 : shipping,
          description: isDoubleCharge ? "Non-Refundable Fee" : "Case Payment",
          transactionType: "casepayment",
          onlineProcessingFee: percentageOfTotal.toFixed(2),
          nonRefundableFee: nonRefundableFee,
          amount: isDoubleCharge
            ? Number((nonRefundableFee + percentageOfTotal).toFixed(2))
            : superTotalAmt,
          doubleCharge: isDoubleCharge,
          paymentProcessor: processorCreds._id,
          transactionId: firstTransactionResponse.transaction_id,
          status: "success",
          authMethod,
          products: paymentData.services.map((el) => ({
            name: el.service,
            price: el.price,
          })),
        });
        //note the used processorName
        paymentNotes.push({
          autoNote: `Gateway Information : <strong>${processorCreds.processorName}</strong> `,
          host: "system",
          createdAt: new Date(),
        });
        // Save second transaction if double charge
        if (isDoubleCharge && secondTransactionResponse) {
          await this.saveTransaction({
            card: {
              number: maskCCNumber(ccnumber),
              expiryMonth: ccexp.slice(0, 2),
              expiryYear: ccexp.slice(2, 4),
            },
            account,
            caseId: caseId,
            orderId,
            discount: discount,
            serviceFee: serviceFee - nonRefundableFee,
            processingFee: shipping,
            description: "Service Fee",
            transactionType: "casepayment",
            onlineProcessingFee: "0",
            nonRefundableFee: 0,
            amount: superTotalAmt - nonRefundableFee,
            doubleCharge: isDoubleCharge,
            paymentProcessor: processorCreds._id,
            transactionId: secondTransactionResponse.transaction_id,
            status: "success",
            authMethod,
            products: paymentData.services.map((el) => ({
              name: el.service,
              price: el.price,
            })),
          });
          return {
            ...secondTransactionResponse,
            firstTransactionId: firstTransactionResponse.transaction_id,
            promoDiscount: Math.min(totalAmount, discount),
            promoCode,
            notes: paymentNotes,
            failedTransaction: !firstTransactionResponse.success
              ? "first"
              : !secondTransactionResponse.success
                ? "second"
                : null,
          };
        } else {
          return {
            ...firstTransactionResponse,
            promoDiscount: Math.min(totalAmount, discount),
            promoCode,
            notes: paymentNotes,
            failedTransaction: !firstTransactionResponse.success
              ? "first"
              : !secondTransactionResponse?.success
                ? "second"
                : null,
          };
        }
      } else {
        if (!firstTransactionResponse?.success) {
          return {
            ...firstTransactionResponse,
            promoDiscount: Math.min(totalAmount, discount),
            promoCode,
            notes: paymentNotes,
            failedTransaction: "first",
          };
        } else {
          return {
            ...secondTransactionResponse!,
            promoDiscount: Math.min(totalAmount, discount),
            promoCode,
            notes: paymentNotes,
            failedTransaction: !firstTransactionResponse.success
              ? "first"
              : !secondTransactionResponse?.success
                ? "second"
                : null,
          }!;
        }
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      throw new Error("Payment processing failed");
    }
  }

  async processNMITransaction({
    type,
    amount,
    ccnumber,
    ccexp,
    cvv,
    account,
    isInternational,
    processorCreds,
    caseNo,
  }: {
    type: "auth" | "sale";
    amount: number;
    ccnumber: string;
    ccexp: string;
    cvv: string;
    account: string;
    isInternational: boolean;
    caseNo: string;
    processorCreds: {
      _id: mongoose.Types.ObjectId | string;
      userName: string;
      password: string;
      processorName: string;
    };
  }): Promise<
    ParsedResponse & {
      usedProcessorId: mongoose.Types.ObjectId | string;
      firstTransactionId?: string;
    }
  > {
    const orderId = `${caseNo}-${Date.now()}`;
    const payload = new URLSearchParams({
      type,
      ccnumber,
      ccexp,
      cvv,
      orderid: orderId,
      amount: amount.toFixed(2),
      account,
      // username: processorCreds.userName,
      // password: processorCreds.password,
      // TEMP-CHANGE - uncomment username & password & comment security_key
      security_key: "TVAkSwDN9qFmS6X5C8wq8XqQXz4V4sD8",
    });

    if (isInternational) {
      payload.append("international", "1");
    }
    console.log("GATEWAY RESPONSE COMENTED: ");
    const response: AxiosResponse<string> = await axios.post(
      ENV.NMI_API_URL!,
      payload,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000,
      }
    );

    // console.log({ response });

    const parsedResponse = this.parseResponse(response.data);
    console.log({ parsedResponse });
    return { ...parsedResponse, usedProcessorId: processorCreds._id };
  }

  async processShippingPayment(
    paymentData: shippingPaymentData,
    processorId: string | mongoose.Types.ObjectId | null
  ): Promise<ParsedResponse> {
    const {
      ccnumber,
      ccexp,
      caseNo,
      cvv,
      caseId,
      isInternational,
      account,
      amount,
    } = paymentData;
    const orderId = `${caseNo}-${Date.now()}`;
    console.log(paymentData);
    // Validate input data
    if (!ccnumber.trim() || !ccexp.trim() || !cvv.trim() || !caseId.trim()) {
      throw new Error("Invalid payment data");
    }

    let totalAmount = amount;
    let processorCreds;
    if (processorId) {
      const rawCreds = await this.processorModel.findById(processorId);
      if (!rawCreds) throw new Error("No payment processor available");
      processorCreds = {
        _id: rawCreds?._id,
        userName: rawCreds?.userName,
        password: decrypt(rawCreds?.password),
      };
    } else {
      processorCreds = await selectPaymentProcessor();
    }
    if (!processorCreds) throw new Error("No payment processor available");
    const payload = new URLSearchParams({
      type: "sale",
      ccnumber,
      ccexp,
      cvv,
      amount: totalAmount.toFixed(2),
      account,
      orderid: orderId,
      // username: processorCreds.userName,
      // password: processorCreds.password,
      // TEMP-CHANGE - uncomment username & password & comment security_key
      security_key: processorCreds.password,
    });

    if (isInternational) {
      payload.append("international", "1");
    }

    const response: AxiosResponse<string> = await axios.post(
      ENV.NMI_API_URL!,
      payload,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000, // Increased timeout to 10 seconds
      }
    );

    const parsedResponse = this.parseResponse(response.data);
    console.log("nmi shipping payment response : ", parsedResponse);
    if (parsedResponse.success) {
      await this.saveTransaction({
        card: {
          number: maskCCNumber(ccnumber),
          expiryMonth: ccexp.slice(0, 2),
          expiryYear: ccexp.slice(2, 4),
        },
        account,
        caseId: caseId,
        orderId,
        transactionType: "extracharge",
        description: paymentData.description,
        amount: totalAmount,
        transactionId: parsedResponse.transaction_id,
        paymentProcessor: processorCreds._id as string,
        status: "success",
        products: paymentData.services.map((el) => ({
          name: el.service,
          price: el.price,
        })),
      });
      return parsedResponse;
    }
    throw new Error(
      "Error processing shipping option payment : " + parsedResponse.message
    );

    return parsedResponse;
  }
  catch(error: any) {
    console.error("Payment processing error:", error);
    throw new Error("Payment processing failed");
  }

  async processServiceLevelRefund(
    paymentData: shippingPaymentData & { transaction_id: string },
    processorId: string | mongoose.Types.ObjectId | null
  ): Promise<ParsedResponse> {
    const {
      ccnumber,
      ccexp,
      cvv,
      caseNo,
      caseId,
      isInternational,
      account,
      amount,
    } = paymentData;
    const orderId = `${caseNo}-${Date.now()}`;

    // Validate input data
    if (!ccnumber.trim() || !ccexp.trim() || !cvv.trim() || !caseId.trim()) {
      throw new Error("Invalid payment data");
    }

    let totalAmount = amount;
    let processorCreds;
    if (processorId) {
      const rawCreds = await this.processorModel.findById(processorId);
      if (!rawCreds) throw new Error("No payment processor available");
      processorCreds = {
        _id: rawCreds?._id,
        userName: rawCreds?.userName,
        password: decrypt(rawCreds?.password),
      };
    } else {
      processorCreds = await selectPaymentProcessor();
    }
    if (!processorCreds) throw new Error("No payment processor available");
    const payload = new URLSearchParams({
      type: "refund",
      ccnumber,
      ccexp,
      cvv,
      orderid: orderId,
      transaction_id: paymentData.transaction_id,
      amount: totalAmount.toFixed(2),
      // username: processorCreds.userName,
      // password: processorCreds.password,
      // TEMP-CHANGE - uncomment username & password & comment security_key
      security_key: processorCreds.password,
    });

    if (isInternational) {
      payload.append("international", "1");
    }

    const response: AxiosResponse<string> = await axios.post(
      ENV.NMI_API_URL!,
      payload,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000, // Increased timeout to 10 seconds
      }
    );

    const parsedResponse = this.parseResponse(response.data);
    console.log("nmi sl refund response : ", parsedResponse);
    if (parsedResponse.success) {
      await this.saveTransaction({
        card: {
          number: maskCCNumber(ccnumber),
          expiryMonth: ccexp.slice(0, 2),
          expiryYear: ccexp.slice(2, 4),
        },
        account,
        caseId: caseId,
        orderId,
        transactionType: "refund",
        paymentProcessor: processorCreds._id as string,
        amount: totalAmount,
        transactionId: parsedResponse.transaction_id,
        status: "success",
        description: paymentData.description,
        products: paymentData.services.map((el) => ({
          name: el.service,
          price: el.price,
        })),
      });
      await this.transactionsModel.updateOne(
        { transactionId: paymentData.transaction_id },
        {
          $set: {
            returnedAmount: Number(totalAmount.toFixed(2)),
          },
        }
      );
      return parsedResponse;
    }
    throw new Error(
      "Error processing service level refund : " + parsedResponse.message
    );
  }

  async processServiceLevelPayment(
    paymentData: shippingPaymentData,
    processorId: string | mongoose.Types.ObjectId | null
  ): Promise<ParsedResponse> {
    const {
      ccnumber,
      ccexp,
      caseNo,
      cvv,
      caseId,
      isInternational,
      account,
      amount,
    } = paymentData;
    const orderId = `${caseNo}-${Date.now()}`;

    // Validate input data
    if (!ccnumber.trim() || !ccexp.trim() || !cvv.trim() || !caseId.trim()) {
      throw new Error("Invalid payment data");
    }
    let totalAmount = amount;
    let processorCreds;
    if (processorId) {
      const rawCreds = await this.processorModel.findById(processorId);
      if (!rawCreds) throw new Error("No payment processor available");
      processorCreds = {
        _id: rawCreds?._id,
        userName: rawCreds?.userName,
        password: decrypt(rawCreds?.password),
      };
    } else {
      processorCreds = await selectPaymentProcessor();
    }
    if (!processorCreds) throw new Error("No payment processor available");

    const payload = new URLSearchParams({
      type: "sale",
      ccnumber,
      ccexp,
      cvv,
      amount: totalAmount.toFixed(2),
      account,
      orderid: orderId,
      // username: processorCreds.userName,
      // password: processorCreds.password,
      // TEMP-CHANGE - uncomment username & password & comment security_key
      security_key: processorCreds.password,
    });

    if (isInternational) {
      payload.append("international", "1");
    }

    const response: AxiosResponse<string> = await axios.post(
      ENV.NMI_API_URL!,
      payload,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000, // Increased timeout to 10 seconds
      }
    );

    const parsedResponse = this.parseResponse(response.data);

    if (parsedResponse.success) {
      await this.saveTransaction({
        account,
        caseId: caseId,
        orderId,
        card: {
          number: maskCCNumber(ccnumber),
          expiryMonth: ccexp.slice(0, 2),
          expiryYear: ccexp.slice(2, 4),
        },
        transactionType: "serviceLevel-payment",
        paymentProcessor: processorCreds._id as string,
        amount: totalAmount,
        transactionId: parsedResponse.transaction_id,
        status: "success",
        description: paymentData.description,
        products: paymentData.services.map((el) => ({
          name: el.service,
          price: el.price,
        })),
      });
      return parsedResponse;
    }
    throw new Error(
      "Error processing service level payment : " + parsedResponse.message
    );
  }

  private parseResponse(responseBody: string): ParsedResponse {
    // Add null/undefined check
    if (!responseBody || typeof responseBody !== 'string') {
      return {
        success: false,
        message: "Invalid or empty response from payment gateway",
        code: 0,
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
    const code = Number(result.response_code) || 0;
    const message = result.responsetext;

    return {
      success,
      message,
      code,
      transaction_id: result.transactionid || "",
      amount: result.amount || "",
      order_id: result.orderid || "",
    };
  }

  private async saveTransaction(transactionData: ITransaction): Promise<void> {
    try {
      const transaction = new TransactionsModel(transactionData);
      await transaction.save();
    } catch (error) {
      console.error("Error saving transaction:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}

export default new NmiPaymentService();
