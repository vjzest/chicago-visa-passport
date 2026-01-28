import { clearRedisAdminCache } from "../../config/redis";
import { AdminsModel } from "../../models/admins.model";
import { RolesModel } from "../../models/roles.model";
import { ServiceResponse } from "../../types/service-response.type";
import { flattenObject } from "../../utils/object";

export default class RolesService {
  private readonly model = RolesModel;
  private readonly adminsModel = AdminsModel;

  async create(data: any): ServiceResponse {
    try {
      await this.model.create(data);
      return {
        status: 201,
        success: true,
        message: "Role created successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(): ServiceResponse<any> {
    try {
      const roles = await this.model.find();
      return {
        status: 200,
        success: true,
        message: "roles fetched successfully",
        data: roles,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findMyRole(roleId: string): ServiceResponse<any> {
    try {
      const role = await this.model.findById(roleId);
      return {
        status: 200,
        success: true,
        message: "role fetched successfully",
        data: role,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findById(id: string): ServiceResponse<any> {
    try {
      const role = await this.model.findById(id);
      return {
        status: 200,
        success: true,
        message: "role fetched successfully",
        data: role,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async activate(id: string): ServiceResponse {
    try {
      await this.model.findByIdAndUpdate(id, { active: true });
      return {
        status: 200,
        success: true,
        message: "Role activated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async deactivate(id: string): ServiceResponse {
    try {
      await this.model.findByIdAndUpdate(id, { active: false });
      return {
        status: 200,
        success: true,
        message: "Role deactivated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: any): ServiceResponse {
    try {
      const flatData = flattenObject(data);
      console.log("flat data :", flatData);
      await this.model.updateOne(
        { _id: id },
        {
          $set: flatData,
        },
        { new: true, runValidators: true }
      );
      const affectedAdmins = await this.adminsModel
        .find({ role: id })
        .select("_id");
      affectedAdmins.forEach(async (admin) => {
        await clearRedisAdminCache(admin?._id?.toString());
      });
      return {
        status: 200,
        success: true,
        message: "Role access updated successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
