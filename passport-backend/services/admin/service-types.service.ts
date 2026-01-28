import { ServiceResponse } from "../../types/service-response.type";
import { ServiceTypesModel } from "../../models/service-type.model";
import { uploadToS3 } from "../../utils/s3";
import { ServiceLevelsModel } from "../../models/service-level.model";
import mongoose from "mongoose";

export default class ServiceTypeService {
  private readonly model = ServiceTypesModel;
  private readonly serviceLevelModel = ServiceLevelsModel;

  async create(data: {
    serviceType: string;
    description: string;
    shortHand: string;
    processingTime: string;
    sortOrder: number;
    requiredDocuments: {
      title: string;
      key: string;
      instructions: string[];
      attachment: Express.Multer.File | string;
      sampleImage: Express.Multer.File | string;
      isRequired: boolean;
    }[];
    shippingAddress: string;
  }): ServiceResponse {
    try {
      const uploads = data.requiredDocuments.map(async (doc, index) => {
        if (doc.sampleImage && typeof doc.sampleImage !== "string") {
          const { url } = await uploadToS3(
            doc.sampleImage.buffer,
            doc.sampleImage.fieldname,
            doc.sampleImage.mimetype,
            "passservicetypes/demo-images"
          );
          data.requiredDocuments[index].sampleImage = url;
        }
        return "";
      });
      const uploads2 = data.requiredDocuments.map(async (doc, index) => {
        if (doc.attachment && typeof doc.attachment !== "string") {
          const { url } = await uploadToS3(
            doc.attachment.buffer,
            doc.attachment.fieldname,
            doc.attachment.mimetype,
            "passservicetypes/attachments"
          );
          data.requiredDocuments[index].attachment = url;
        }
        return "";
      });
      await Promise.all([...uploads, ...uploads2]);
      let visa = await this.model.create(data);
      visa = await visa.populate([{ path: "shippingAddress" }]);
      return {
        status: 201,
        success: true,
        message: "Visa type created successfully",
        data: visa,
      };
    } catch (error) {
      console.error("CREATE VISA TYPE ERROR", error);
      throw error;
    }
  }

  async findAll(options?: { onlyActive: boolean }): ServiceResponse<any> {
    try {
      const serviceTypes = await this.model
        .find(options?.onlyActive ? { isActive: true } : {})
        .sort({ sortOrder: 1 })
        .populate("shippingAddress")
        .lean();
      const serviceLevelQueries = serviceTypes.map(async (serviceType) => {
        //@ts-ignore
        serviceType.serviceLevels = await this.serviceLevelModel.find({
          serviceTypes: serviceType._id,
        });
      });
      await Promise.all(serviceLevelQueries);
      return {
        status: 200,
        success: true,
        message: "Visa types fetched successfully",
        data: serviceTypes,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOne(id: string): ServiceResponse<any> {
    try {
      const serviceType = await this.model.findById(id);
      // .populate("country")

      if (!serviceType) {
        // return {
        //   status: 400,
        //   success: false,
        //   message: "Visa type not found",
        // };
        throw new Error("Visa type not found");
      }
      return {
        status: 200,
        success: true,
        message: "Visa type fetched successfully",
        data: serviceType,
      };
    } catch (error) {
      console.error(error);
      throw new Error((error as Error).message);
    }
  }

  async update(
    id: string,
    data: {
      serviceType: string;
      description: string;
      shortHand: string;
      validity: string;
      processingTime: string;
      sortOrder: number;
      requiredDocuments: {
        _id?: string;
        title: string;
        key: string;
        instructions: string[];
        sampleImage: Express.Multer.File | string;
        attachment: Express.Multer.File | string;
        isRequired: boolean;
      }[];
      requiredDocuments2?: {
        _id?: string;
        title: string;
        key: string;
        instructions: string[];
        sampleImage: Express.Multer.File | string;
        attachment: Express.Multer.File | string;
        isRequired: boolean;
      }[];
      shippingAddress: string;
    }
  ): ServiceResponse {
    try {
      const serviceType = await this.model.findById(id).select("sortOrder");
      if (!serviceType) {
        return {
          status: 404,
          success: false,
          message: "Service type not found",
        };
      }

      data.requiredDocuments.forEach((doc) => {
        if (!doc._id) {
          doc._id = new mongoose.Types.ObjectId().toString();
        }
      });

      data.requiredDocuments2?.forEach((doc) => {
        if (!doc._id) {
          doc._id = new mongoose.Types.ObjectId().toString();
        }
      });

      // Handle uploads for first set of required documents
      const uploads = data.requiredDocuments.map(async (doc, index) => {
        if (doc.sampleImage && typeof doc.sampleImage !== "string") {
          const { url } = await uploadToS3(
            doc.sampleImage.buffer,
            doc.sampleImage.fieldname,
            doc.sampleImage.mimetype,
            "visatypes/demo-images"
          );
          data.requiredDocuments[index].sampleImage = url;
        }
        return "";
      });

      const uploads2 = data.requiredDocuments.map(async (doc, index) => {
        if (doc.attachment && typeof doc.attachment !== "string") {
          const { url } = await uploadToS3(
            doc.attachment.buffer,
            doc.attachment.fieldname,
            doc.attachment.mimetype,
            "visatypes/attachments"
          );
          data.requiredDocuments[index].attachment = url;
        }
        return "";
      });

      // Handle uploads for second set of required documents (if exists)
      let uploads3: Promise<string>[] = [];
      let uploads4: Promise<string>[] = [];

      if (data.requiredDocuments2 && data.requiredDocuments2.length > 0) {
        uploads3 = data.requiredDocuments2.map(async (doc, index) => {
          if (doc.sampleImage && typeof doc.sampleImage !== "string") {
            const { url } = await uploadToS3(
              doc.sampleImage.buffer,
              doc.sampleImage.fieldname,
              doc.sampleImage.mimetype,
              "visatypes/demo-images"
            );
            data.requiredDocuments2![index].sampleImage = url;
          }
          return "";
        });

        uploads4 = data.requiredDocuments2.map(async (doc, index) => {
          if (doc.attachment && typeof doc.attachment !== "string") {
            const { url } = await uploadToS3(
              doc.attachment.buffer,
              doc.attachment.fieldname,
              doc.attachment.mimetype,
              "visatypes/attachments"
            );
            data.requiredDocuments2![index].attachment = url;
          }
          return "";
        });
      }

      // Wait for all uploads to complete
      await Promise.all([...uploads, ...uploads2, ...uploads3, ...uploads4]);

      // Handle sort order update
      await this.model.updateOne(
        { sortOrder: data.sortOrder },
        {
          $set: { sortOrder: serviceType?.sortOrder },
        }
      );

      // Update the service type document
      await this.model.updateOne({ _id: id }, { $set: data });

      return {
        status: 200,
        success: true,
        message: "Service type updated successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async delete(id: string): ServiceResponse {
    try {
      //make soft delete

      const serviceType = await this.model.findByIdAndUpdate(id, {
        $set: { isActive: true },
      });
      if (!serviceType) {
        return {
          status: 400,
          success: false,
          message: "Service type not found",
        };
      }
      return {
        status: 200,
        success: true,
        message: "Service type deleted successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getServiceTypeSortOrders() {
    try {
      const serviceTypes = await this.model
        .find({})
        .sort({ sortOrder: 1 })
        .select("serviceType sortOrder");
      return {
        status: 200,
        success: true,
        message: "Service types fetched successfully",
        data: serviceTypes,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async toggleArchiveState(serviceTypeId: string) {
    try {
      const serviceType = await this.model
        .findById(serviceTypeId)
        .select("isArchived");
      if (!serviceType) {
        return {
          status: 400,
          success: false,
          message: "Service type not found",
        };
      }
      await this.model.updateOne(
        { _id: serviceTypeId },
        {
          $set: {
            isArchived: !serviceType.isArchived,
            isActive: serviceType.isArchived,
          },
        }
      );
      return {
        status: 200,
        success: true,
        message: `Service type ${
          serviceType.isArchived ? "unarchived" : "archived"
        } successfully`,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
