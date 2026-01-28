import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AdminsModel } from "../models/admins.model";
import IAdmin from "../interfaces/admin.interface";
import { AccountsModel } from "../models/accounts.model";
import { redisClient } from "../config/redis";
// interfaces/session.interface.ts
import { updateAccountActivity } from "../utils/update-account-activity";
import { ConfigModel } from "../models/config.model";
import { getIpFromRequest } from "../utils/text.utils";

export interface AuthenticatedAdminRequest extends Request {
  admin: IAdmin;
}
export interface AuthenticatedUserRequest extends Request {
  user?: any;
}

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token not provided" });

    let verifiedToken;
    try {
      verifiedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        tokenVersion: string;
      };
    } catch (jwtError) {
      console.log({ jwtError });
      return res
        .status(401)
        .json({ message: "Session expired. Please login again." });
    }
    if (!verifiedToken)
      return res
        .status(401)
        .json({ message: "Session expired. Please login again." });
    const { id, tokenVersion } = verifiedToken;

    const redisKey = `admin_${id}`;
    let admin = null;

    /*
    try {
      const cachedAdmin = await redisClient.get(redisKey);
      if (cachedAdmin) {
        const parsedAdmin = JSON.parse(cachedAdmin);
        admin = {
          ...parsedAdmin,
          role: {
            ...parsedAdmin.role,
            viewCasesByStatus: new Map<string, boolean>(
              Object.entries((parsedAdmin as any).role.viewCasesByStatus)
            ),
            viewCasesByLocation: new Map<string, boolean>(
              Object.entries((parsedAdmin as any).role.viewCasesByLocation)
            ),
          },
        };
      }
    } catch (redisError) {
      console.log("Redis get error:", redisError);
    }
    */

    if (!admin) {
      admin = await AdminsModel.findById(id).populate("role");

      if (admin) {
        try {
          await redisClient.set(redisKey, JSON.stringify(admin), {
            EX: 3600,
          });
        } catch (redisCacheError) {
          console.log("Redis set error:", redisCacheError);
        }
      }
    }

    if (!admin) return res.status(401).json({ message: "Admin not found" });
    if (!admin.authTokenVersion || admin.authTokenVersion !== tokenVersion) {
      console.log({ dbversion: admin.authTokenVersion, tokenVersion });
      return res
        .status(401)
        .json({ message: "Session expired. Please login again." });
    }

    const config = await ConfigModel.findOne().select("ipLockEnabled");
    if (
      config?.ipLockEnabled &&
      admin.ipRestriction &&
      getIpFromRequest(req) !== admin.ipAddress
    ) {
      return res.status(401).json({ message: "Failed to authenticate" });
    }

    //@ts-ignore
    req.admin = admin as IAdmin;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const userAuthMiddleware = async (
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    let verifiedToken;
    try {
      verifiedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        tokenVersion: string;
      };
    } catch (jwtError) {
      console.log("jwtError", jwtError);
      return res
        .status(401)
        .json({ message: "Session expired. Please login again." });
    }
    if (!verifiedToken)
      return res
        .status(401)
        .json({ message: "Session expired. Please login again." });

    const { id, tokenVersion } = verifiedToken;
    const user = await AccountsModel.findById(id);
    if (!user) return res.status(401).json({ message: "User not found" });
    if (!user.authTokenVersion || user.authTokenVersion !== tokenVersion) {
      return res
        .status(401)
        .json({ message: "Session expired. Please login again." });
    }

    // @ts-ignore
    req.user = user;
    updateAccountActivity(user._id.toString());
    next();
  } catch (error) {
    console.log({ "TOKEN ERROR": error });
    next(error);
  }
};

export const getTokenInfo = (req: Request): { id: string } | false => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return false;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    return decodedToken;
  } catch (error) {
    console.log({ "TOKEN ERROR": error });
    return false;
  }
};
