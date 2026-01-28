import { AxiosInstance } from "axios";
import axiosInstance from "../config/axios";
import { toast } from "sonner";

class GeneralFetchApi {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axiosInstance;
  }

  async getHomepageContent() {
    try {
      // Use direct fetch with no-store to bypass axiosInstance's client-side cache (5s TTL)
      const baseUrl = process.env.NEXT_PUBLIC_BASEURL || "http://localhost:8002/api/v1";
      const response = await fetch(`${baseUrl}/content/homepage`, { cache: 'no-store' });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPassportContent() {
    try {
      // Direct call to Passport Backend to get fresh content
      const passportUrl = process.env.NEXT_PUBLIC_PASSPORT_BASE_URL || "http://localhost:4001/api/v1";
      const response = await fetch(`${passportUrl}/content`, { cache: 'no-store' });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error fetching passport content:", error);
      return null;
    }
  }

  async getServiceTypes(params?: any) {
    try {
      const response = await this.axiosInstance.get(`/user/service-types`, {
        params,
      });
      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getAdditionalServices() {
    try {
      const response = await this.axiosInstance.get(
        `/common/additional-services`
      );
      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getServiceLevels() {
    try {
      const response = await axiosInstance.get(`/common/service-levels`);
      return response?.data;
    } catch (error) {
      console.log("Error :: ", error);
      return error;
    }
  }

  async getForms() {
    try {
      const visaApplicationFormMongoId = "passport-application-forms"; // ATTENTION
      const response = await axiosInstance.get(
        `/common/forms/${visaApplicationFormMongoId}`
      );
      return response?.data;
    } catch (error) {
      console.log({ error });
      return error;
    }
  }

  async getServiceLevelById(Id: string) {
    try {
      const response = await axiosInstance.get(`/common/service-levels/${Id}`);
      return response?.data;
    } catch (error) {
      console.log("Error :: ", error);
      return error;
    }
  }

  async getConsularFees(params: {
    fromCountryCode: string;
    toCountryCode: string;
    serviceLevelId?: string;
    serviceTypeId?: string;
  }) {
    try {
      const response = await axiosInstance.get(`/common/consular-fees`, {
        params,
      });
      return response?.data;
    } catch (error) {
      console.log("Error fetching consular fees:", error);
      return error;
    }
  }

  async getEnabledFromCountries() {
    try {
      const response = await axiosInstance.get(
        `/common/country-pairs/enabled-from`
      );
      return response?.data;
    } catch (error) {
      console.log("Error fetching enabled from countries:", error);
      return error;
    }
  }

  async getEnabledToCountries(fromCountryCode?: string) {
    try {
      const response = await axiosInstance.get(
        `/common/country-pairs/enabled-to`,
        {
          params: fromCountryCode ? { fromCountryCode } : {},
        }
      );
      return response?.data;
    } catch (error) {
      console.log("Error fetching enabled to countries:", error);
      return error;
    }
  }
}

class CasesFetchApi {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axiosInstance;
  }

  async getAllCases() {
    try {
      const response = await this.axiosInstance.get(`/user/case`);
      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getCaseById(id: string) {
    try {
      const response = await this.axiosInstance.get(`/user/case/${id}`, {
        cache: false,
      } as any);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      toast.error(
        response?.data?.message || "error occurred while fetching case"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "error occurred while fetching case"
      );
      console.log(error);
      return error;
    }
  }
}
class TransactionFetchApi {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axiosInstance;
  }

  async getAllTransactionById() {
    try {
      const response = await this.axiosInstance.get(`/user/transactions`);
      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getAllTransactionByCaseId(id: string) {
    try {
      const response = await this.axiosInstance.get(`/user/transactions/${id}`);
      if (response?.data?.success) {
        // toast.success(response?.data?.message);
        return response?.data;
      }
      toast.error(
        response?.data?.message || "error occurred while fetching case"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "error occurred while fetching case"
      );
      console.log(error);
      return error;
    }
  }
}
class UserFetchApi {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axiosInstance;
  }

  async getUser() {
    try {
      const response = await this.axiosInstance.get(`/user/account/`);
      if (response?.data?.success) {
        // toast.success(response?.data?.message);
        return response?.data;
      }
      toast.error(
        response?.data?.message || "error occurred while fetching user data"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "error occurred while fetching user data"
      );
      console.log(error);
      return error;
    }
  }

  async verifyPaymentLink(token: string) {
    try {
      const response = await this.axiosInstance.get(
        `/common/payment-link/${token}`
      );
      return response?.data;
    } catch (error) {
      console.log("Error verifying payment link:", error);
      return error;
    }
  }
}

class ApplicationFetchApi {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axiosInstance;
  }

  async getAllCases() {
    try {
      const response = await this.axiosInstance.get(`/user/case`);
      return response?.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async updateApplicationTrackingId(id: string, tracking: any) {
    try {
      const response = await this.axiosInstance.patch(
        `/user/applications/add-tracking/${id}`,
        {
          tracking,
        }
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      toast.error(
        response?.data?.message || "error occurred while fetching case"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "error occurred while fetching case"
      );
      console.log(error);
      return error;
    }
  }
}

const generalFetchApi = new GeneralFetchApi();
const casesFetchApi = new CasesFetchApi();
const applicationFetchApi = new ApplicationFetchApi();
const transactionFetchApi = new TransactionFetchApi();
const userFetchApi = new UserFetchApi();

export const RecordUserAction = async (actionNote: string, caseId: string) => {
  try {
    const response = await axiosInstance.post(`/user/case/record-action`, {
      caseId,
      actionNote,
    });
    return response?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export {
  generalFetchApi,
  applicationFetchApi,
  casesFetchApi,
  transactionFetchApi,
  userFetchApi,
};
