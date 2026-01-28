import { Response, Request, NextFunction } from "express";
import ServiceTypeService from "../../services/admin/service-types.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminServiceTypeController {
  serviceTypeService = new ServiceTypeService();

  async create(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { serviceType, description, shortHand, processingTime, sortOrder, countryPair, isEvisa } =
        req.body;
      const shippingAddress = req.body.shippingAddress;
      const requiredDocs = JSON.parse(req.body.requiredDocs) as {
        title: string;
        key: string;
        instructions: string[];
        sampleImage: Express.Multer.File;
        attachment: Express.Multer.File;
        isRequired: boolean;
      }[];
      Array.isArray(req.files) &&
        req.files.forEach((file) => {
          requiredDocs.forEach((doc) => {
            if (doc.title + "sampleImage" === file.fieldname) {
              doc.sampleImage = file;
            }
            if (doc.title + "attachment" === file.fieldname) {
              doc.attachment = file;
            }
          });
        });

      const response = await this.serviceTypeService.create({
        serviceType,
        description,
        shortHand,
        processingTime,
        shippingAddress,
        sortOrder: Number(sortOrder),
        requiredDocuments: requiredDocs,
        countryPair,
        isEvisa: isEvisa === "true",
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const countryPairId = req.query.countryPairId as string | undefined;
      const onlyActive = req.query.onlyActive === "true";

      const response = await this.serviceTypeService.findAll({
        onlyActive,
        countryPairId,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const response = await this.serviceTypeService.findOne(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async update(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const {
        serviceType,
        description,
        shortHand,
        validity,
        processingTime,
        sortOrder,
        countryPair,
        isEvisa,
      } = req.body;
      const shippingAddress = req.body.shippingAddress;

      // Parse first set of required documents
      const requiredDocs = JSON.parse(req.body.requiredDocs) as {
        title: string;
        key: string;
        instructions: string[];
        sampleImage: Express.Multer.File;
        attachment: Express.Multer.File;
        isRequired: boolean;
      }[];

      // Parse second set of required documents (if exists)
      let requiredDocs2: {
        title: string;
        key: string;
        instructions: string[];
        sampleImage: Express.Multer.File;
        attachment: Express.Multer.File;
        isRequired: boolean;
      }[] = [];

      // Only parse requiredDocs2 if it exists in the request body
      if (req.body.requiredDocs2) {
        try {
          requiredDocs2 = JSON.parse(req.body.requiredDocs2);
        } catch (error) {
          console.warn("Error parsing requiredDocs2:", error);
          requiredDocs2 = [];
        }
      }

      // Handle file uploads for both document sets
      if (Array.isArray(req.files)) {
        req.files.forEach((file) => {
          // Handle files for first set of documents
          requiredDocs.forEach((doc) => {
            if (doc.title + "sampleImage" === file.fieldname) {
              doc.sampleImage = file;
            }
            if (doc.title + "attachment" === file.fieldname) {
              doc.attachment = file;
            }
          });

          // Handle files for second set of documents
          requiredDocs2.forEach((doc) => {
            if (doc.title + "sampleImage2" === file.fieldname) {
              doc.sampleImage = file;
            }
            if (doc.title + "attachment2" === file.fieldname) {
              doc.attachment = file;
            }
          });
        });
      }

      // Prepare update data
      const updateData: any = {
        serviceType,
        description,
        shortHand,
        validity,
        sortOrder: Number(sortOrder),
        processingTime,
        shippingAddress,
        requiredDocuments: requiredDocs,
        countryPair,
        isEvisa: isEvisa === "true",
      };

      // Only include requiredDocuments2 if it has data
      // This ensures backward compatibility for existing service types
      if (requiredDocs2.length > 0) {
        updateData.requiredDocuments2 = requiredDocs2;
      }

      const response = await this.serviceTypeService.update(id, updateData);

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async delete(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const response = await this.serviceTypeService.delete(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async getServiceTypeSortOrders(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.serviceTypeService.findAll();
      return res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async toggleArchiveState(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await this.serviceTypeService.toggleArchiveState(id);
      return res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
