import { ServiceResponse } from "../../types/service-response.type";
import { deleteFromS3, uploadToS3 } from "../../utils/s3";
import { BlogsModel } from "../../models/blogs.model";

export default class BlogsService {
  private readonly model = BlogsModel;

  async create(data: {
    title: string;
    subtitle: string;
    content: string;
    thumbnailFile: Express.Multer.File;
  }): ServiceResponse {
    try {
      const { thumbnailFile } = data;
      if (!thumbnailFile) {
        return {
          status: 400,
          success: false,
          message: "Thumbnail is required",
        };
      }
      const { url } = await uploadToS3(
        data.thumbnailFile.buffer,
        data.title.replace(" ", ""),
        data.thumbnailFile.mimetype,
        "/blogs"
      );
      await this.model.create({
        ...data,
        thumbnail: url,
      });

      return {
        status: 200,
        success: true,
        message: "Blog created successfully",
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  async update(
    blogId: string,
    data: {
      title: string;
      subtitle: string;
      content: string;
      thumbnailFile: Express.Multer.File;
    }
  ): ServiceResponse {
    try {
      const { thumbnailFile } = data;
      const blog = await this.model.findById(blogId);
      if (!blog) {
        return {
          status: 404,
          success: false,
          message: "Blog not found",
        };
      }

      if (thumbnailFile) {
        await deleteFromS3(blog.thumbnail);
        const { url } = await uploadToS3(
          data.thumbnailFile.buffer,
          data.title.replace(" ", ""),
          data.thumbnailFile.mimetype,
          "/blogs"
        );
        blog.thumbnail = url;
      }
      blog.title = data.title;
      blog.subtitle = data.subtitle;
      blog.content = data.content;
      await blog.save();

      return {
        status: 200,
        success: true,
        message: "Blog updated successfully",
      };
    } catch (error) {
      console.log((error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  // find single Additional
  async findById(id: string): Promise<ServiceResponse> {
    try {
      const blog = await this.model.findById(id);
      return {
        status: 200,
        success: true,
        data: blog,
        message: "Blog retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding blog:", error);
      throw error;
    }
  }

  async findBySlug(slug: string): ServiceResponse {
    try {
      const blog = await this.model.findOne({ slug });
      return {
        status: 200,
        success: true,
        data: blog,
        message: "Blog retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding blog:", error);
      throw error;
    }
  }

  // find all additional
  async findAll(): ServiceResponse {
    try {
      const blogs = await this.model
        .find()
        .select("title thumbnail subtitle slug");

      return {
        status: 200,
        success: true,
        data: blogs,
        message: "Blogs retrieved successfully",
      };
    } catch (error) {
      console.error("Error finding blogs:", error);
      throw error;
    }
  }
}
