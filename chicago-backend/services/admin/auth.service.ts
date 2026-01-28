import { AdminsModel } from "../../models/admins.model";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { ServiceResponse } from "../../types/service-response.type";
import { ConfigModel } from "../../models/config.model";
import { clearRedisAdminCache } from "../../config/redis";

export default class AdminAuthRouterService {
  private readonly model = AdminsModel;
  private readonly jwtSecret = process.env.JWT_SECRET || "secureVisa";

  async login(
    email: string,
    password: string,
    ipAddress: string
  ): ServiceResponse {
    try {
      // Fetching user from database
      const user = await this.model.findOne({ email, status: "Active" });
      if (!user) {
        throw new Error("User not found");
      }

      // Validating the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }
      const config = await ConfigModel.findOne().select("ipLockEnabled");
      if (
        config?.ipLockEnabled &&
        user.ipRestriction &&
        ipAddress !== user.ipAddress
      ) {
        return {
          success: false,
          status: 400,
          message: "Failed to authenticate",
          data: null,
        };
      }
      const latestTokenVersion = randomUUID();
      user.authTokenVersion = latestTokenVersion;
      await user.save();
      await clearRedisAdminCache(user._id?.toString());
      // Generating JWT
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: "admin",
          tokenVersion: latestTokenVersion,
        },
        this.jwtSecret,
        { expiresIn: "72h" }
      );
      return {
        data: {
          token,
          user: {
            id: user._id,
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName,
            image: user?.image,
          },
        },
        message: "Login successful",
        status: 200,
        success: true,
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async getProfile(adminId: string): ServiceResponse {
    try {
      const admin = await this.model.findById(adminId);
      if (!admin) {
        return {
          status: 400,
          success: false,
          message: "Admin not found",
        };
      }
      const { email, firstName, lastName, image } = admin;
      return {
        status: 200,
        success: true,
        message: "admin fetched successfully",
        data: { email, firstName, lastName, image },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
