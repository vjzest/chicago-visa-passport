import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import BlogsService from "../../services/admin/blogs.service";

export default class CommonBlogsController {
  private readonly blogsService = new BlogsService();

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.blogsService.findAll();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const response = await this.blogsService.findBySlug(slug);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
