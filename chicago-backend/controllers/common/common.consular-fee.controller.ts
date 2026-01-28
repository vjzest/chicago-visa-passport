import { Response, Request, NextFunction } from "express";
import ConsularFeeService from "../../services/admin/consular-fee.service";
import CustomError from "../../utils/classes/custom-error";

export default class CommonConsularFeeController {
    consularFeeService = new ConsularFeeService();

    /**
     * Get consular fee by country codes, service level ID, and service type ID
     * Query params: fromCountryCode, toCountryCode, serviceLevelId, serviceTypeId
     */
    async findByCountryCodes(req: Request, res: Response, next: NextFunction) {
        try {
            const { fromCountryCode, toCountryCode, serviceLevelId, serviceTypeId } =
                req.query;

            if (!fromCountryCode || !toCountryCode) {
                return res.status(400).json({
                    success: false,
                    message: "fromCountryCode and toCountryCode are required",
                });
            }

            // If serviceLevelId and serviceTypeId are provided, get specific fee
            if (serviceLevelId && serviceTypeId) {
                const response = await this.consularFeeService.findByCountryCodes(
                    fromCountryCode as string,
                    toCountryCode as string,
                    serviceLevelId as string,
                    serviceTypeId as string
                );
                return res.status(response.status).json(response);
            }

            // Otherwise, get all fees for the country pair
            const response = await this.consularFeeService.findAllByCountryCodes(
                fromCountryCode as string,
                toCountryCode as string
            );
            return res.status(response.status).json(response);
        } catch (error) {
            next(new CustomError(500, (error as Error).message));
        }
    }
}
