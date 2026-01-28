import { LoasModel } from "../../models/loa.model";
import { Types } from "mongoose";
import { ServiceResponse } from "../../types/service-response.type";
import { deleteFromS3, uploadToS3 } from "../../utils/s3";

/**
 * Upload file service
 */
export const uploadFile = async (
  file: Express.Multer.File,
  displayName: string
): ServiceResponse => {
  try {
    const uploadResult = await uploadToS3(
      file.buffer,
      file.originalname,
      file.mimetype,
      "loa"
    );
    const loa = new LoasModel({
      name: displayName,
      url: uploadResult.url,
      fileKey: uploadResult.filename,
    });

    await loa.save();

    return {
      status: 201,
      success: true,
      message: "File uploaded record created successfully",
      data: loa,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      status: 500,
      success: false,
      message: "File upload failed",
    };
  }
};
/** Edit files service */
export const editFile = async (
  loaId: string,
  displayName: string,
  file: Express.Multer.File | undefined
): ServiceResponse => {
  try {
    const loa = await LoasModel.findById(loaId);
    if (!loa) {
      return {
        status: 400,
        success: false,
        message: "LOA not found",
        data: loa,
      };
    }
    let uploadResult: { url: string; filename: string } | null = null;
    if (file) {
      uploadResult = await uploadToS3(
        file.buffer,
        file.originalname,
        file.mimetype,
        "loa"
      );
      if (uploadResult.url) await deleteFromS3(loa.url);
    }
    loa.name = displayName || loa.name;
    loa.url = uploadResult?.url || loa.url;
    await loa.save();

    return {
      status: 200,
      success: true,
      message: "LOA file updated successfully",
      data: loa,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      status: 500,
      success: false,
      message: "LOA file updation failed",
    };
  }
};

/**
 * Get files service
 */
export const getFiles = async (): ServiceResponse => {
  try {
    const files = await LoasModel.find();
    return {
      status: 200,
      success: true,
      message: "Files fetched successfully",
      data: files,
    };
  } catch (error) {
    console.error("Error fetching files:", error);
    return {
      status: 500,
      success: false,
      message: "Failed to fetch files",
    };
  }
};

/**
 * Delete file service
 */
export const deleteFile = async (id: string): ServiceResponse => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      return {
        status: 400,
        success: false,
        message: "Invalid ID",
      };
    }

    const file = await LoasModel.findById(id);
    if (!file) {
      return {
        status: 404,
        success: false,
        message: "File not found",
      };
    }

    await deleteFromS3(file.url);
    const deletedLoa = await LoasModel.findByIdAndDelete(id);

    return {
      status: 200,
      success: true,
      message: "File record deleted successfully",
      data: deletedLoa,
    };
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      status: 500,
      success: false,
      message: "Failed to delete file",
    };
  }
};

/**
 * Update file service
 */
export const updateFile = async (
  id: string,
  file: Express.Multer.File,
  displayName: string
): ServiceResponse => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      return {
        status: 400,
        success: false,
        message: "Invalid ID",
      };
    }

    const existingFile = await LoasModel.findById(id);
    if (!existingFile) {
      return {
        status: 404,
        success: false,
        message: "File not found",
      };
    }

    // Delete the old file from S3
    await deleteFromS3(existingFile.url);

    // Upload the new file
    const uploadResult = await uploadToS3(
      file.buffer,
      file.originalname,
      file.mimetype,
      "loa"
    );

    // Update the database record
    existingFile.name = displayName;
    existingFile.url = uploadResult.url;
    await existingFile.save();

    return {
      status: 200,
      success: true,
      message: "File updated successfully",
      data: existingFile,
    };
  } catch (error) {
    console.error("Error updating file:", error);
    return {
      status: 500,
      success: false,
      message: "Failed to update file",
    };
  }
};
