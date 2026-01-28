import { toast } from "sonner";
import axiosInstance from "./axios/axios";

class PassportContentAPI {
    async getContent() {
        try {
            const response = await axiosInstance.get("/content", {
                cache: false
            } as any); // Type assertion needed for axios-cache-interceptor custom config if types aren't perfect
            return response.data;
        } catch (error: any) {
            console.error("Error fetching passport content:", error);
            throw error;
        }
    }

    async updateContent(data: any) {
        try {
            console.log("Updating content...", {
                baseURL: axiosInstance.defaults.baseURL, // Note: interceptor sets this dynamically, so this might check default
                keys: Object.keys(data),
                imageSrc: data.usPassportPage?.image?.src
            });
            const response = await axiosInstance.put("/admin/content", { data }); // This hits /api/v1/admin/content
            if (response.status === 200 || response.status === 201) {
                toast.success("Content updated successfully!");
                return response.data;
            }
            throw new Error("Failed to update content");
        } catch (error: any) {
            console.error("Error updating passport content:", error);
            toast.error("Failed to update content.");
            throw error;
        }
    }
}

export const passportContentApi = new PassportContentAPI();
