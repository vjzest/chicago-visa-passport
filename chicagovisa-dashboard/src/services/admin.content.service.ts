import { toast } from "sonner";
import axiosInstance from "./axios/axios";
class ContentAPI {
  async getHomepageContent() {
    try {
      const response = await axiosInstance.get("/admin/content/homepage");
      if (response.data.success === false) {
        throw new Error(response.data.message || "Failed to fetch content");
      }
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const url = error.config?.url;
      const message = error.response?.data?.message || error.message;

      let errorMessage = `Failed to fetch content: ${message}`;
      if (status === 404) {
        errorMessage = `API Route Not Found (404): ${url}. Please ensure the backend server is running and the route is registered.`;
      } else if (!status) {
        errorMessage = `Network Error: Could not connect to the backend at ${url}.`;
      }

      toast.error(errorMessage);
      throw error;
    }
  }
  async updateHomepageContent(formData: FormData) {
    try {
      const response = await axiosInstance.put("/admin/content/homepage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const isSuccess = response.data.success || response.status === 200 || response.status === 201;

      if (isSuccess) {
        toast.success(
          response.data.message || "Homepage content updated successfully!"
        );
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to update content");
      }
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      let errorMessage = `${message}`;
      if (status === 404) {
        errorMessage = `Update Failed (404): The endpoint was not found. Please check your backend configuration.`;
      }

      toast.error(errorMessage);
      throw error;
    }
  }
}
export const contentApi = new ContentAPI();
