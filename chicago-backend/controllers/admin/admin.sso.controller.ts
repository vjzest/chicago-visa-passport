import { NextFunction, Request, Response } from "express";
import CustomError from "../../utils/classes/custom-error";
import AdminSSOService from "../../services/admin/sso.service";

export default class AdminSSOController {
    ssoService = new AdminSSOService();

    async verifyCode(req: Request, res: Response, next: NextFunction) {
        try {
            const { code } = req.body;
            if (!code) throw new Error("Code is required");

            const response = await this.ssoService.verifyCode(code);
            return res.status(response.status).json(response);
        } catch (error) {
            next(new CustomError(500, (error as Error).message));
        }
    }

    async getRoles(req: Request, res: Response, next: NextFunction) {
        try {
            // Basic verification of SSO API Key for internal role fetching
            const ssoApiKey = req.headers["x-sso-api-key"];
            if (ssoApiKey !== process.env.SSO_API_KEY) {
                return res.status(401).json({ success: false, message: "Unauthorized SSO API Key" });
            }

            const response = await this.ssoService.getRoles();
            return res.status(response.status).json(response);
        } catch (error) {
            next(new CustomError(500, (error as Error).message));
        }
    }
}
