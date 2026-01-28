import { NextFunction, Request, Response } from "express";
import { PaymentLinkModel } from "../../models/payment-links.model";
import { ServiceTypesModel } from "../../models/service-type.model";
import { ServiceLevelsModel } from "../../models/service-level.model";
import crypto from "crypto";

class AdminPaymentLinkController {

    // GET /api/v1/admin/payment-link
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Math.max(1, parseInt(req.query.page as string) || 1);
            const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
            const skip = (page - 1) * limit;

            const [data, total] = await Promise.all([
                PaymentLinkModel.find()
                    .populate("serviceType", "serviceType")
                    .populate("serviceLevel", "serviceLevel slug")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                PaymentLinkModel.countDocuments(),
            ]);

            res.status(200).json({
                success: true,
                data,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/v1/admin/payment-link/generate
    async generate(req: Request, res: Response, next: NextFunction) {
        try {
            const { serviceTypeId, serviceLevelId, amount, metadata, serviceType: bodyServiceType, serviceLevel: bodyServiceLevel } = req.body;

            // Allow either camelCase ID name or direct model-field name
            const sTypeId = serviceTypeId || bodyServiceType;
            const sLevelId = serviceLevelId || bodyServiceLevel;

            if (!sTypeId || !sLevelId) {
                return res.status(400).json({ success: false, message: "Missing required fields: serviceType or serviceLevel" });
            }

            // Validate Service Type & Level exist
            const serviceType = await ServiceTypesModel.findById(sTypeId);
            const serviceLevel: any = await ServiceLevelsModel.findById(sLevelId);

            if (!serviceType || !serviceLevel) {
                return res.status(404).json({ success: false, message: "Service Type or Level not found" });
            }

            // If amount is not provided, calculate it from service level price
            let finalAmount = amount;
            if (!finalAmount) {
                // Parse price string (e.g. "$100") to number
                const priceString = serviceLevel.price ? serviceLevel.price.toString().replace(/[^0-9.]/g, '') : "0";
                finalAmount = parseFloat(priceString);
            }

            if (!finalAmount) {
                return res.status(400).json({ success: false, message: "Amount could not be determined. Please provide amount manually." });
            }

            // Generate unique token
            const token = crypto.randomBytes(32).toString("hex");

            // Set expiry (e.g., 15 minutes or 24 hours). Required by schema.
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins default

            const newLink = await PaymentLinkModel.create({
                token,
                serviceType: sTypeId,
                serviceLevel: sLevelId,
                amount: finalAmount,
                expiresAt,
                status: 'active',
                metadata
            });

            // Construct frontend URL (assuming localhost for dev or env var)
            // The frontend uses this token to load the payment page
            const paymentUrl = `${process.env.USER_URL || 'http://localhost:3000'}/payment-link/${token}`;

            res.status(201).json({
                success: true,
                message: "Payment link generated successfully",
                data: {
                    ...newLink.toObject(),
                    paymentUrl
                }
            });

        } catch (error) {
            next(error);
        }
    }
    // GET /api/v1/common/payment-links/:token
    async verify(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;

            const link = await PaymentLinkModel.findOne({ token })
                .populate("serviceType", "serviceType description silentKey")
                .populate({
                    path: "serviceLevel",
                    select: "serviceLevel price time description nonRefundableFee serviceTypes",
                    populate: { path: "serviceTypes", select: "serviceType" }
                });


            if (!link) {
                return res.status(404).json({ success: false, message: "Payment link not found" });
            }

            if (link.expiresAt && new Date() > link.expiresAt) {
                return res.status(400).json({ success: false, message: "Payment link has expired" });
            }

            if (link.status === 'used') {
                return res.status(400).json({ success: false, message: "Payment link already used" });
            }

            res.status(200).json({
                success: true,
                data: link
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminPaymentLinkController();
