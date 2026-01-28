import RolesService from "../../services/admin/roles.service";
import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import AdminsService from "../../services/admin/admins.service";
import AdminFilesService from "../../services/admin/admin-files.service";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";

export default class AdminRolesController {
  rolesService = new RolesService();
  adminsService = new AdminsService();
  adminFilesService = new AdminFilesService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.rolesService.create(req.body);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async findMyRole(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.rolesService
        //@ts-ignore
        .findMyRole(req.admin?.role?._id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.rolesService.findAll();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await this.rolesService.findById(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async activate(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const response = await this.rolesService.activate(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async deactivate(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const response = await this.rolesService.deactivate(id);

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.rolesService.update(req.params.id, req.body);
      res.status(response.status).json(response);
    } catch (error) {
      console.log(error);
      next(new CustomError(500, (error as Error).message));
    }
  }

  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        password,
        role,
        status,
        ipRestriction,
        autoAssign,
        ipAddress,
      } = req.body;
      const response = await this.adminsService.create({
        firstName,
        lastName,
        username,
        email,
        password,
        role,
        ipRestriction,
        autoAssign,
        ipAddress,
        image: req.file!,
        status,
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async updateAdmin(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { adminId } = req.params;
      const {
        firstName,
        lastName,
        username,
        email,
        password,
        role,
        status,
        ipRestriction,
        autoAssign,
        ipAddress,
      } = req.body;
      const response = await this.adminsService.update(adminId, {
        firstName,
        lastName,
        username,
        email,
        password,
        role,
        ipRestriction,
        autoAssign,
        ipAddress,
        image: req.file!,
        status,
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async findAllAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminsService.findAll();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async findByIdAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await this.adminsService.findById(id);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async findCaseManagers(req: Request, res: Response, next: NextFunction) {
    try {
      const { listInDropdown, caseId } = req.query;
      const response = await this.adminsService.findCaseManagers({
        listInDropdown: Boolean(listInDropdown),
        caseId: String(caseId ?? ""),
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getAdminAccessDetails(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.adminsService.getAdminAccessDetails(
        req.admin._id
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async uploadAdminFile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { adminId } = req.params;
      const { title } = req.body;
      
      if (!req.file) {
        return next(new CustomError(400, "File is required"));
      }
      
      const response = await this.adminFilesService.uploadFile(
        adminId,
        title,
        req.file
      );
      
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async updateAdminFile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fileId } = req.params;
      const { title } = req.body;
      
      // File validation is handled by middleware
      
      const response = await this.adminFilesService.updateFile(
        fileId,
        title,
        req.file
      );
      
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async deleteAdminFile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { fileId } = req.params;
      
      const response = await this.adminFilesService.deleteFile(fileId);
      
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async getAdminFiles(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { adminId } = req.params;
      
      const response = await this.adminFilesService.getFilesByAdminId(adminId);
      
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
