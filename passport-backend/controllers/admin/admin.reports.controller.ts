import { Request, Response, NextFunction } from "express";

import AdminReportsService from "../../services/admin/reports.service";

export default class AdminReportsController {
  private AdminReportsService = new AdminReportsService();

  async filterApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.AdminReportsService.getApplicationReports(
        req.query
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async filterCase(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, groupBy } = req.query;

      if (
        typeof groupBy !== "string" ||
        !["serviceType", "toCountry", "serviceLevel"].includes(groupBy)
      ) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Invalid groupBy parameter",
        });
      }

      const response = await this.AdminReportsService.getAggregatedCaseReports({
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        groupBy: groupBy as "serviceType" | "serviceLevel",
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async filterApplicationsAndCases(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response =
        await this.AdminReportsService.getApplicationsAndCaseReports(req.query);
      console.log(response.data);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async getTotalTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { groupBy, startDate, endDate } = req.query;
      const response = await this.AdminReportsService.getTotalTransactions(
        String(groupBy),
        String(startDate),
        String(endDate)
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async getCaseManagerReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      const response = await this.AdminReportsService.getCaseManagerReports(
        String(startDate),
        String(endDate)
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async filterCRMReports(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.body;
      const response = await this.AdminReportsService.filterCRMReports(filters);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
