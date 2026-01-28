import { Response, Request, NextFunction } from "express";
import StatusService from "../../services/admin/status.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminStatusController {
  statusService = new StatusService();

  async create(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { parent } = req.query;
      const response = await this.statusService.create(
        req.body,
        parent as string
      );

      res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(new Error((error as Error).message));
    }
  }

  async findAll(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { onlyAllowed, showCaseCount } = req.query;
      const allowedStatuses: string[] = [];
      // console.log("user role", req.admin.role.viewCasesByStatus);
      (req.admin.role.viewCasesByStatus as Map<string, boolean>).forEach(
        (value, key) => {
          if (value) allowedStatuses.push(key);
        }
      );
      const response = await this.statusService.findAll({
        onlyAllowed: Boolean(onlyAllowed),
        onlyAssigned: req.admin.role.viewCases.seeOnlyAssignedCases,
        showCaseCount: Boolean(showCaseCount),
        allowedStatuses: allowedStatuses,
        adminId: req.admin._id,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async findAllParentStatuses(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.statusService.findAllParentStatus();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await this.statusService.findOne(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findSubstatuses(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await this.statusService.findSubstatuses(id);
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
      const response = await this.statusService.update(id, req.body);

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
      const response = await this.statusService.delete(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
