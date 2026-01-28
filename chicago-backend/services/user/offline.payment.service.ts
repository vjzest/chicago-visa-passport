import { PaymentLinkModel } from "../../models/payment-links.model";
import { TransactionsModel } from "../../models/transaction.model";
import ENV from "../../utils/lib/env.config";
import axios, { AxiosResponse } from "axios";
import CustomError from "../../utils/classes/custom-error";

interface PaymentPayload {
    token: string;
    billingInfo: {
        cardNumber: string;
        expirationDate: string;
        cvv: string;
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country?: string;
        email: string;
    };
}

export class OfflinePaymentService {

    // Helper to parse NMI response
    private parseResponse(responseBody: string) {
        // Add null/undefined check
        if (!responseBody || typeof responseBody !== 'string') {
            return {
                success: false,
                message: "Invalid or empty response from payment gateway",
                transaction_id: "",
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

        return {
            success: result.response === "1",
            message: result.responsetext || "Unknown error",
            transaction_id: result.transactionid || "",
        };
    }

    async processPayment(payload: PaymentPayload) {
        const { token, billingInfo } = payload;

        if (!token || !billingInfo) {
            throw new CustomError(400, "Token and billing info are required");
        }

        // 1. Verify Payment Link
        const paymentLink = await PaymentLinkModel.findOne({ token });
        if (!paymentLink) {
            throw new CustomError(404, "Invalid payment link");
        }
        if (paymentLink.status !== 'active') {
            throw new CustomError(400, "Payment link is already used or expired");
        }
        if (paymentLink.expiresAt < new Date()) {
            throw new CustomError(400, "Payment link has expired");
        }

        // 2. Prepare NMI Payload
        const nmiPayload = new URLSearchParams({
            type: "sale",
            ccnumber: billingInfo.cardNumber,
            ccexp: billingInfo.expirationDate,
            cvv: billingInfo.cvv,
            amount: paymentLink.amount.toFixed(2),
            security_key: "TVAkSwDN9qFmS6X5C8wq8XqQXz4V4sD8",
            first_name: billingInfo.firstName,
            last_name: billingInfo.lastName,
            address1: billingInfo.address,
            city: billingInfo.city,
            state: billingInfo.state,
            zip: billingInfo.zipCode,
            country: billingInfo.country || 'US',
            email: billingInfo.email
        });

        // 3. Process Payment via NMI
        let nmiResponse: AxiosResponse<string>;
        try {
            nmiResponse = await axios.post(
                ENV.NMI_API_URL || "https://secure.nmi.com/api/transact.php",
                nmiPayload,
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    timeout: 20000
                }
            );
        } catch (error) {
            throw new CustomError(500, "Payment gateway connection failed");
        }

        const result = this.parseResponse(nmiResponse.data);

        if (!result.success) {
            throw new CustomError(400, result.message);
        }

        // 4. Update Payment Link Status
        paymentLink.status = 'used';
        await paymentLink.save();

        // 5. Create Transaction Record
        await TransactionsModel.create({
            transactionId: result.transaction_id,
            amount: paymentLink.amount,
            transactionType: "payment_link",
            status: "success",
            caseId: paymentLink.caseId || null,
            metadata: {
                token: paymentLink.token,
                serviceTypeId: paymentLink.serviceType,
                serviceLevelId: paymentLink.serviceLevel
            },
            description: `Payment Link ${token}`
        });

        return {
            success: true,
            message: "Payment successful",
            transactionId: result.transaction_id
        };
    }
}
