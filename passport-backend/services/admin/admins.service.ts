import IAdmin from "../../interfaces/admin.interface";
import { AdminsModel, IAdminDoc } from "../../models/admins.model";
import { RolesModel } from "../../models/roles.model";
import { ServiceResponse } from "../../types/service-response.type";
import { deleteFromS3, uploadToS3 } from "../../utils/s3";
import { resizeImage } from "../../utils/sharp";
import bcrypt from "bcryptjs";
import { CasesModel } from "../../models/cases.model";
import { clearRedisAdminCache } from "../../config/redis";
import { resetCaseManagerLoads } from "../../utils/lib/cm-load-balancer";

export default class AdminsService {
  private readonly adminsModel = AdminsModel;
  private readonly rolesModel = RolesModel;
  private readonly casesModel = CasesModel;

  async create(data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    image: Express.Multer.File;
    password: string;
    role: string;
    autoAssign: boolean;
    ipRestriction: boolean;
    ipAddress: string;
    status: string;
  }): ServiceResponse {
    try {
      let imageUrl = "";
      if (data.image) {
        const resizedImage = await resizeImage(data.image.buffer, 600, 600);
        const { url } = await uploadToS3(
          resizedImage,
          data.image.originalname,
          data.image.mimetype,
          "admins/profile-images"
        );
        imageUrl = url;
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      await this.adminsModel.create({
        ...data,
        image: imageUrl,
        password: hashedPassword,
        ipAddress: data.ipAddress || "",
      });
      resetCaseManagerLoads();

      return {
        status: 201,
        success: true,
        message: "admin created successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(): ServiceResponse<any> {
    try {
      const admins = await this.adminsModel
        .find()
        .sort({ createdAt: -1 })
        .populate("role")
        .select("-password")
        .sort({ _id: -1 });
      return {
        status: 200,
        success: true,
        message: "admins fetched successfully",
        data: admins,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findById(id: string): ServiceResponse<any> {
    try {
      const admin = await this.adminsModel.findById(id);
      return {
        status: 200,
        success: true,
        message: "admin fetched successfully",
        data: admin,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(
    id: string,
    data: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      image: Express.Multer.File;
      password: string;
      role: string;
      autoAssign: boolean;
      ipRestriction: boolean;
      ipAddress: string;
      status: string;
    }
  ): ServiceResponse {
    try {
      const admin = await this.adminsModel.findById(id);
      if (!admin) {
        return {
          status: 400,
          success: false,
          message: "Admin not found",
        };
      }

      let newImage;
      if (data.image) {
        const resizedImage = await resizeImage(data.image.buffer, 600, 600);
        if (admin.image) await deleteFromS3(admin.image);
        const { url: ImageUrl } = await uploadToS3(
          resizedImage,
          data.image.originalname,
          data.image.mimetype,
          "admins/profile-images"
        );
        newImage = ImageUrl;
      }
      if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
      }
      if (
        admin.status !== data.status ||
        admin.autoAssign !== data.autoAssign
      ) {
        resetCaseManagerLoads();
      }
      admin.set({
        firstName: data.firstName || admin.firstName,
        lastName: data.lastName || admin.lastName,
        username: data.username || admin.username,
        email: data.email || admin.email,
        image: newImage || admin.image,
        password: data.password || admin.password,
        role: data.role || admin.role,
        autoAssign: data.autoAssign ?? admin.autoAssign,
        ipRestriction: data.ipRestriction ?? admin.ipRestriction,
        ipAddress: data.ipAddress || admin.ipAddress,
        status: data.status || admin.status,
      });

      await clearRedisAdminCache(admin._id?.toString());
      await admin.save();

      return {
        status: 200,
        success: true,
        message: "Admin details updated successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findCaseManagers(
    options: { listInDropdown?: boolean; caseId?: string } = {
      listInDropdown: false,
      caseId: "",
    }
  ): ServiceResponse<IAdminDoc[]> {
    try {
      const feasibleRoles = await this.rolesModel
        .find({
          // "otherSettings.autoAssignCases": true,
          ...(options?.listInDropdown
            ? { "otherSettings.listInDropdown": true }
            : {}),
        })
        .select("_id");
      let caseManagerSpecific: any[] = [];
      if (options?.caseId) {
        const case_ = await this.casesModel
          .findById(options?.caseId)
          .select("caseInfo.caseManager");
        const result = await this.adminsModel
          .findOne({
            _id: case_?.caseInfo?.caseManager,
          })
          .select(" firstName lastName _id image");
        if (result) {
          caseManagerSpecific.push(result);
        }
      }
      const caseManagers = await this.adminsModel
        .find({
          role: { $in: feasibleRoles.map((role) => role._id) },
          _id: { $ne: caseManagerSpecific[0]?._id },
          status: "Active",
        })
        .select(" firstName lastName _id image");
      return {
        status: 200,
        success: true,
        message: "Case managers fetched successfully",
        data: [...caseManagers, ...caseManagerSpecific] as any,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAdminAccessDetails(adminId: string): ServiceResponse<IAdmin> {
    try {
      const admin = (await AdminsModel.findById(adminId).populate(
        "role"
      )) as IAdminDoc & {
        role: any;
      };
      const access = admin?.role;
      return {
        status: 200,
        success: true,
        message: `Access details fetched successfully`,
        data: access,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        success: false,
        message: `Error updating Application ::  ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }
}
