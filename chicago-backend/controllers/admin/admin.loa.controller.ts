import { NextFunction, Request, Response } from "express";
import * as loaService from "../../services/admin/loa.service";
import CustomError from "../../utils/classes/custom-error";

export class AdminLoaController {
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const name = req.body.name;
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }
      const response = await loaService.uploadFile(req.file, name);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async editFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { loaId } = req.params;
      const name = req.body.name;
      const response = await loaService.editFile(loaId, name, req.file);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getFiles(_req: Request, res: Response, next: NextFunction) {
    try {
      const response = await loaService.getFiles();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await loaService.deleteFile(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
