import {Response, Request, NextFunction} from "express";
import LogsService from "../../services/admin/logs.service";

export default class AdminLogsController {
  logsService = new LogsService();

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.logsService.findAll();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
