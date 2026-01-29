import { AdminsModel } from "../../models/admins.model";
import { RolesModel } from "../../models/roles.model";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import axios from "axios";
import { ServiceResponse } from "../../types/service-response.type";

export default class AdminSSOService {
    private readonly adminModel = AdminsModel;
    private readonly rolesModel = RolesModel;
    private readonly jwtSecret = process.env.JWT_SECRET || "secureVisa";
    private readonly ssoApiUrl = process.env.SSO_API_URL || "http://localhost:5000";
    private readonly ssoApiKey = process.env.SSO_API_KEY || "sso-internal-api-key";

    async verifyCode(code: string): Promise<ServiceResponse> {
        try {
            // 1. Exchange code with SSO Server
            const ssoResponse = await axios.post(
                `${this.ssoApiUrl}/api/v1/sso/exchange`,
                { code },
                {
                    headers: {
                        "x-sso-api-key": this.ssoApiKey,
                    },
                }
            );

            if (!ssoResponse.data || ssoResponse.data.status !== "success") {
                throw new Error("Failed to verify SSO code");
            }

            const ssoUser = ssoResponse.data.data;

            if (ssoUser.projectSlug !== "jet-passport" && ssoUser.projectSlug !== "chicago-visa-passport") {
                throw new Error("Project access denied or mismatch");
            }

            // 2. Find or Sync local admin user
            let admin = await this.adminModel.findOne({ email: ssoUser.email });

            if (!admin) {
                // Find role by name or ID from SSO
                // Try "Super Admin" first (as seen in DB), then "Admin"
                let role = await this.rolesModel.findOne({ title: "Super Admin" });
                if (!role) {
                    role = await this.rolesModel.findOne({ title: "Admin" });
                }
                if (!role) throw new Error("Default Admin role not found locally");

                admin = await this.adminModel.create({
                    firstName: ssoUser.firstName,
                    lastName: ssoUser.lastName,
                    email: ssoUser.email,
                    username: ssoUser.username,
                    password: randomUUID(),
                    role: role._id,
                    status: "Active",
                    autoAssign: false,
                });
            }

            // 3. Generate Local JWT
            const latestTokenVersion = randomUUID();
            admin.authTokenVersion = latestTokenVersion;
            await admin.save();

            const token = jwt.sign(
                {
                    id: admin._id,
                    email: admin.email,
                    role: "admin",
                    tokenVersion: latestTokenVersion,
                },
                this.jwtSecret,
                { expiresIn: "72h" }
            );

            return {
                success: true,
                status: 200,
                message: "SSO verification successful",
                data: {
                    token,
                    user: {
                        id: admin._id,
                        email: admin.email,
                        firstName: admin.firstName,
                        lastName: admin.lastName,
                        image: admin.image,
                    },
                },
            };
        } catch (error: any) {
            console.error("SSO Verification Error (Passport):", error.message);
            return {
                success: false,
                status: 401,
                message: error.response?.data?.message || error.message || "SSO verification failed",
            };
        }
    }

    async getRoles(): Promise<ServiceResponse> {
        try {
            const roles = await this.rolesModel.find().select("title _id");
            return {
                success: true,
                status: 200,
                message: "Roles fetched successfully",
                data: roles,
            };
        } catch (error: any) {
            return {
                success: false,
                status: 500,
                message: error.message,
            };
        }
    }
}
