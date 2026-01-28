import { toast } from "sonner";
import axiosInstance from "../axios/axios";

// -------------------------------------------- ---- SERVICE LEVEL PASSPORT

// Create service level
export const CreateServiceLevel = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      "/admin/service-levels/create",
      data
    );
    if (response?.data?.success) {
      toast.success(response?.data?.message);
      return response.data;
    } else {
      toast.error(response?.data?.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(
      (error as any)?.response?.data?.message ||
      (error as Error).message ||
      "Unknown error occurred"
    );
  }
};

// Update service level
export const UpdateServiceLevel = async (data: any) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/service-levels/update/${data._id}`,
      data
    );
    if (response?.data?.success) {
      toast.success(response?.data?.message);
      return response.data;
    } else {
      toast.error(response?.data?.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(
      (error as any)?.response?.data?.message ||
      (error as Error).message ||
      "Unknown error occurred"
    );
  }
};

// Delete service level
export const DeleteServiceLevel = async (id: string) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/service-levels/delete/${id}`
    );
    if (response?.data?.success) {
      toast.success(response?.data?.message);
      return response?.data;
    } else {
      toast.error(response?.data?.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(
      (error as any)?.response?.data?.message ||
      (error as Error).message ||
      "Unknown error occurred"
    );
  }
};

// Activate/deactivate service level
export const ToggleServiceLevelStatus = async (id: string) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/service-levels/active/${id}`
    );
    if (response?.data?.success) {
      toast.success(response?.data?.message);
      return response?.data;
    } else {
      toast.error(response?.data?.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(
      (error as any)?.response?.data?.message ||
      (error as Error).message ||
      "Unknown error occurred"
    );
  }
};

// Get all service levels
export const GetServiceLevels = async () => {
  try {
    const response = await axiosInstance.get("/admin/service-levels/");
    if (response?.data?.success) {
      return response?.data;
    } else {
      toast.error(response?.data?.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(
      (error as any)?.response?.data?.message ||
      (error as Error).message ||
      "Unknown error occurred"
    );
  }
};

class ServiceTypeAPI {
  async getAll() {
    try {
      const { data } = await axiosInstance.get(`/admin/service-types`);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getOne(id: string) {
    const { data } = await axiosInstance.get(`/admin/service-types/` + id);
    return data;
  }

  async create(data: any) {
    try {
      const response = await axiosInstance.post(
        "/admin/service-types",
        data
      );
      if (response?.data?.success) {
        return response.data;
      } else {
        throw new Error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async Update(id: string, data: any) {
    try {
      const response = await axiosInstance.put(
        `/admin/service-types/${id}`,
        data
      );
      if (response?.data?.success) {
        return response.data;
      } else {
        throw new Error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

// Additional service

class AdditionalServiceAPI {
  async getAll() {
    try {
      const response = await axiosInstance.get(`/admin/additional-Services`);
      if (response?.data?.success) {
        // toast.success(response?.data?.message);
        return response.data;
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async create(data: any) {
    try {
      const response = await axiosInstance.post(
        "/admin/additional-Services/",
        data
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        return response.data;
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        (error as any)?.response?.data?.message ||
        (error as Error).message ||
        "Unknown error occurred"
      );
    }
  }

  async Update(data: any) {
    try {
      const response = await axiosInstance.put(
        `/admin/additional-Services/${data._id}`,
        data
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        return response.data;
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        (error as any)?.response?.data?.message ||
        (error as Error).message ||
        "Unknown error occurred"
      );
    }
  }

  // Delete additional-Services
  async Delete(id: string) {
    try {
      const response = await axiosInstance.delete(
        `/admin/additional-Services/${id}`
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        return response?.data;
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        (error as any)?.response?.data?.message ||
        (error as Error).message ||
        "Unknown error occurred"
      );
    }
  }

  // Activate/deactivate additional-Services
  async Active(id: string) {
    try {
      const response = await axiosInstance.patch(
        `/admin/additional-Services/${id}`
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        return response?.data;
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        (error as any)?.response?.data?.message ||
        (error as Error).message ||
        "Unknown error occurred"
      );
    }
  }
}

// Country Access API
class CountryAccessAPI {
  async getEnabledFromCountries() {
    try {
      const response = await axiosInstance.get(
        "/admin/country-pairs/enabled-from"
      );
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(
        (error as any)?.response?.data?.message ||
        (error as Error).message ||
        "Error fetching enabled from countries"
      );
      throw error;
    }
  }

  async getEnabledToCountries(fromCountryCode?: string) {
    try {
      const url = fromCountryCode
        ? `/admin/country-pairs/enabled-to?fromCountryCode=${fromCountryCode}`
        : "/admin/country-pairs/enabled-to";
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(
        (error as any)?.response?.data?.message ||
        (error as Error).message ||
        "Error fetching enabled to countries"
      );
      throw error;
    }
  }

  async getAllCountryPairs() {
    try {
      const response = await axiosInstance.get("/admin/country-pairs");
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(
        (error as any)?.response?.data?.message ||
        (error as Error).message ||
        "Error fetching country pairs"
      );
      throw error;
    }
  }
}

export const serviceTypeApi = new ServiceTypeAPI();
export const additionalService = new AdditionalServiceAPI();
export const countryAccessApi = new CountryAccessAPI();

