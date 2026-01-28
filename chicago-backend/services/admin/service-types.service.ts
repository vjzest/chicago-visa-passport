import { ServiceResponse } from "../../types/service-response.type";
import { ServiceTypesModel } from "../../models/service-type.model";
import { uploadToS3 } from "../../utils/s3";
import { ServiceLevelsModel } from "../../models/service-level.model";
import { CountryPairModel } from "../../models/country-pair.model";
import mongoose from "mongoose";

export default class ServiceTypeService {
  private readonly model = ServiceTypesModel;
  private readonly serviceLevelModel = ServiceLevelsModel;
  private readonly countryPairModel = CountryPairModel;

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
    countryPair: string;
    isEvisa?: boolean;
  }): ServiceResponse {
    try {
      // Validate country pair exists
      if (!data.countryPair) {
        return {
          status: 400,
          success: false,
          message: "Country pair is required",
        };
      }

      const countryPair = await this.countryPairModel.findById(data.countryPair);
      if (!countryPair) {
        return {
          status: 400,
          success: false,
          message: "Country pair not found",
        };
      }

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

      // Increment sort orders for all service types >= the new sort order
      await this.model.updateMany(
        { sortOrder: { $gte: data.sortOrder } },
        { $inc: { sortOrder: 1 } }
      );

      let visa = await this.model.create(data);
      visa = await visa.populate([{ path: "shippingAddress" }, { path: "countryPair" }]);
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

  async findAll(options?: {
    onlyActive: boolean;
    citizenOf?: string;
    // residingIn?: string;
    travelingTo?: string;
    countryPairId?: string;
    isEvisa?: boolean;
  }): ServiceResponse<any> {
    try {
      // Build query filter
      const filter: any = options?.onlyActive ? { isActive: true } : {};

      // Filter by isEvisa if specified
      if (options?.isEvisa !== undefined) {
        filter.isEvisa = options.isEvisa;
      }

      // If countryPairId is provided, filter by that directly
      if (options?.countryPairId) {
        filter.countryPair = options.countryPairId;
      }
      // Otherwise, if citizenOf or travelingTo is provided, find matching country pairs
      else if (options?.citizenOf || options?.travelingTo) {
        const countryPairFilter: any = {};

        if (options?.citizenOf) {
          // Match citizenOf with fromCountryCode (case-insensitive)
          countryPairFilter.fromCountryCode = options.citizenOf.toUpperCase();
        }

        if (options?.travelingTo) {
          // Match travelingTo with toCountryCode (case-insensitive)
          countryPairFilter.toCountryCode = options.travelingTo.toUpperCase();
        }

        // Find matching country pairs
        const matchingCountryPairs = await this.countryPairModel
          .find(countryPairFilter)
          .select("_id")
          .lean();

        // Get the IDs of matching country pairs
        const countryPairIds = matchingCountryPairs.map((cp) => cp._id);

        // Add countryPair filter to the service types query
        filter.countryPair = { $in: countryPairIds };
      }

      console.log("Service Types Query Filter:", filter);

      const serviceTypes = await this.model
        .find(filter)
        .sort({ sortOrder: 1 })
        .populate("shippingAddress")
        .populate("countryPair")
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
      const serviceType = await this.model.findById(id).populate("countryPair");

      if (!serviceType) {
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
      countryPair: string;
      isEvisa?: boolean;
    }
  ): ServiceResponse {
    try {
      // Validate country pair exists
      if (!data.countryPair) {
        return {
          status: 400,
          success: false,
          message: "Country pair is required",
        };
      }

      const countryPair = await this.countryPairModel.findById(data.countryPair);
      if (!countryPair) {
        return {
          status: 400,
          success: false,
          message: "Country pair not found",
        };
      }

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
      const oldSortOrder = serviceType.sortOrder;
      const newSortOrder = data.sortOrder;

      if (oldSortOrder !== newSortOrder) {
        // First, remove the item from its current position by decrementing everything above it
        await this.model.updateMany(
          {
            _id: { $ne: id },
            sortOrder: { $gt: oldSortOrder },
          },
          { $inc: { sortOrder: -1 } }
        );

        // Then, make space at the new position by incrementing everything >= new position
        await this.model.updateMany(
          {
            _id: { $ne: id },
            sortOrder: { $gte: newSortOrder },
          },
          { $inc: { sortOrder: 1 } }
        );
      }

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
        message: `Service type ${serviceType.isArchived ? "unarchived" : "archived"
          } successfully`,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
