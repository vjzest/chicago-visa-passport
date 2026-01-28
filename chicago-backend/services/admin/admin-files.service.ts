import AdminFiles from "../../models/admin-files.model";
import { uploadToS3, deleteFromS3 } from "../../utils/s3";
import CustomError from "../../utils/classes/custom-error";
import { ServiceResponse } from "../../types/service-response.type";

export default class AdminFilesService {
  async uploadFile(
    adminId: string,
    title: string,
    file: Express.Multer.File
  ): ServiceResponse {
    try {
      // Upload file to S3
      const uploadResult = await uploadToS3(
        file.buffer,
        file.originalname,
        file.mimetype,
        "admin-files"
      );

      // Create record in database
      const adminFile = await AdminFiles.create({
        title,
        adminId,
        fileUrl: uploadResult.url,
      });

      return {
        status: 201,
        success: true,
        message: "File uploaded successfully",
        data: adminFile,
      };
    } catch (error) {
      throw new CustomError(500, (error as Error).message);
    }
  }

  async updateFile(
    fileId: string,
    title: string,
    file?: Express.Multer.File
  ): ServiceResponse {
    try {
      // Find existing file
      const existingFile = await AdminFiles.findById(fileId);
      if (!existingFile) {
        throw new CustomError(404, "File not found");
      }

      // Update data object
      const updateData: { title: string } = { title };

      // Update record in database
      const updatedFile = await AdminFiles.findByIdAndUpdate(
        fileId,
        updateData,
        { new: true }
      );

      return {
        status: 200,
        success: true,
        message: "File updated successfully",
        data: updatedFile,
      };
    } catch (error) {
      throw new CustomError(500, (error as Error).message);
    }
  }

  async deleteFile(fileId: string): ServiceResponse {
    try {
      // Find existing file
      const existingFile = await AdminFiles.findById(fileId);
      if (!existingFile) {
        throw new CustomError(404, "File not found");
      }

      // Delete from S3
      await deleteFromS3(existingFile.fileUrl);

      // Delete from database
      await AdminFiles.findByIdAndDelete(fileId);

      return {
        status: 200,
        success: true,
        message: "File deleted successfully",
      };
    } catch (error) {
      throw new CustomError(500, (error as Error).message);
    }
  }

  async getFilesByAdminId(adminId: string): ServiceResponse {
    try {
      const files = await AdminFiles.find({ adminId });

      return {
        status: 200,
        success: true,
        message: "Files retrieved successfully",
        data: files,
      };
    } catch (error) {
      throw new CustomError(500, (error as Error).message);
    }
  }
}
