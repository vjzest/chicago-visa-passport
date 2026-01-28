import { NextFunction, Request, Response } from "express";
import * as filesService from "../../services/admin/files.service";
import CustomError from "../../utils/classes/custom-error";

export class AdminFilesController {
  async getAllFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await filesService.getAllFiles();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params;
      const response = await filesService.deleteFile(fileId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const title = req.body.title;
      const response = await filesService.uploadFile(req.file, title);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
  async getAllCaseFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const { caseId } = req.params;
      const response = await filesService.getAllCaseFiles(caseId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async deleteCaseFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params;
      const response = await filesService.deleteCaseFile(fileId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async uploadCaseFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { caseId } = req.params;
      const { title, description } = req.body;

      const response = await filesService.uploadCaseFile({
        file: req.file!,
        title,
        caseId,
        description,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async editCaseFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params;
      const { title, description } = req.body;

      const response = await filesService.editCaseFile({
        fileId,
        title,
        description,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
