import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/classes/custom-error";

export const errorMiddleware = async (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server encountered an error",
      statusCode: error.statusCode || 500,
    });
  } catch (error: any) {
    console.log(error.message);
  }
};
