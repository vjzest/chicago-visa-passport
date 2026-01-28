import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import BlogsService from "../../services/admin/blogs.service";

export default class AdminBlogsController {
  private blogsService = new BlogsService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, subtitle, content } = req.body;
      const thumbnail = req.file;
      const response = await this.blogsService.create({
        thumbnailFile: thumbnail!,
        title,
        subtitle,
        content,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.blogsService.findAll();
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, subtitle, content } = req.body;
      const { blogId } = req.params;
      const thumbnail = req.file;
      const response = await this.blogsService.update(blogId, {
        thumbnailFile: thumbnail!,
        title,
        subtitle,
        content,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { blogId } = req.params;
      const response = await this.blogsService.findById(blogId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
