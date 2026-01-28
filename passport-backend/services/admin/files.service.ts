import { CaseFilesModel } from "../../models/case-files.model";
import { FilesModel } from "../../models/files.model";
import { ServiceResponse } from "../../types/service-response.type";
import { deleteFromS3, uploadToS3 } from "../../utils/s3";
uploadToS3;

export async function getAllFiles(): Promise<ServiceResponse> {
  try {
    const files = await FilesModel.find().sort({ createdAt: -1 });
    return {
      status: 200,
      success: true,
      message: "Files retrieved successfully",
      data: files,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//delete file
export async function deleteFile(fileId: string): Promise<ServiceResponse> {
  try {
    const file = await FilesModel.findById(fileId);
    if (!file) {
      return {
        status: 404,
        success: false,
        message: "File not found",
      };
    }
    await deleteFromS3(file.url);
    await FilesModel.deleteOne({ _id: fileId });
    return {
      status: 200,
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadFile(
  file: Express.Multer.File,
  title: string
): Promise<ServiceResponse> {
  try {
    const { url } = await uploadToS3(
      file.buffer,
      file.originalname,
      file.mimetype,
      "admin/files"
    );

    const newFile = await FilesModel.create({
      title,
      url,
      fileType: file.mimetype,
    });

    return {
      status: 201,
      success: true,
      message: "File uploaded successfully",
      data: newFile,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllCaseFiles(
  caseId: string
): Promise<ServiceResponse> {
  try {
    const files = await CaseFilesModel.find({ case: caseId }).sort({
      createdAt: -1,
    });
    return {
      status: 200,
      success: true,
      message: "Case Files retrieved successfully",
      data: files,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//delete file
export async function deleteCaseFile(fileId: string): Promise<ServiceResponse> {
  try {
    const file = await CaseFilesModel.findById(fileId);
    if (!file) {
      return {
        status: 404,
        success: false,
        message: "Case File not found",
      };
    }
    await deleteFromS3(file.url);
    await CaseFilesModel.deleteOne({ _id: fileId });
    return {
      status: 200,
      success: true,
      message: "Case File deleted successfully",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadCaseFile({
  file,
  caseId,
  title,
  description,
}: {
  file: Express.Multer.File;
  caseId: string;
  title: string;
  description: string;
}): Promise<ServiceResponse> {
  try {
    if (!file) {
      return {
        success: false,
        message: "No file uploaded",
        status: 400,
      };
    }

    const { url } = await uploadToS3(
      file.buffer,
      file.originalname,
      file.mimetype,
      "admin/casefiles"
    );

    const newFile = await CaseFilesModel.create({
      title,
      case: caseId,
      url,
      fileType: file.mimetype,
      description,
    });

    return {
      status: 201,
      success: true,
      message: "Case File uploaded successfully",
      data: newFile,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editCaseFile({
  fileId,
  title,
  description,
}: {
  fileId: string;
  title: string;
  description: string;
}): Promise<ServiceResponse> {
  try {
    const file = await CaseFilesModel.findById(fileId);
    if (!file) {
      return {
        status: 404,
        success: false,
        message: "Case File not found",
      };
    }
    file.title = title;
    file.description = description;
    await file.save();
    return {
      status: 200,
      success: true,
      message: "Case File updated successfully",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
