import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import ProcessorService from "../../services/admin/processor.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminProcessorController {
  processorService = new ProcessorService();

  async createProcessor(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        userName,
        password,
        processorName,
        description,
        transactionLimit,
        isDefault,
      } = req.body;

      if (!userName.trim() || !password || !processorName.trim()) {
        return res
          .status(400)
          .json({ message: "some field missing", success: false });
      }

      const data = {
        userName,
        password,
        processorName,
        transactionLimit,
        description,
        isDefault,
      };

      const response = await this.processorService.create(data);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getAllProcessor(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.processorService.findAll();

      res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(new CustomError(500, (error as Error).message));
    }
  }

  //  update MerChant id
  async updateProcessor(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        userName,
        password,
        processorName,
        description,
        isDefault,
        transactionLimit,
      } = req.body;

      const id = req.params.id;

      if (!userName.trim() || !processorName.trim()) {
        return res
          .status(400)
          .json({ message: "some field missing", success: false });
      }
      const data = {
        userName,
        password,
        processorName,
        description,
        transactionLimit,
        isDefault,
      };
      const response = await this.processorService.findByIdAndUpdate(id, data);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  // Deleting Processor
  async deleteProcessor(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      if (!id.trim()) {
        return res
          .status(400)
          .json({ message: "required field is missing", success: false });
      }
      const response = await this.processorService.findByIdAndDelete(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  // activate Processor
  async activateProcessor(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      if (!id.trim()) {
        return res
          .status(400)
          .json({ message: "processor id is missing", success: false });
      }
      const response = await this.processorService.findByIdAndActive(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  // Make Default Processor
  async DefaultProcessor(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      if (!id.trim()) {
        return res
          .status(400)
          .json({ message: "processor id is missing", success: false });
      }
      const response = await this.processorService.findByIdAndDefault(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async GetActiveProcessor(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.processorService.GetActiveProcessor(req);
      res.status(response.status).json(response);
    } catch (error) {
      console.error("Error getting active processor:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
