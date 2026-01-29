import { toast } from "sonner";
import axiosInstance from "../axios/axios";
import { AxiosInstance } from "axios";
// ---------------------------------------------------PROMO
// create promo-code
export const CreatePromoCode = async (data: any) => {
  const response = await axiosInstance.post("/admin/promo/create", data);
  if (response?.data?.success) {
    toast.success(response?.data?.message);
    return response.data;
  } else {
    toast.error(response?.data?.message);
  }
};

// update promo-code
export const updatePromoCode = async (data: any) => {
  const response = await axiosInstance.patch(
    `/admin/promo/update/${data._id}`,
    data
  );
  if (response?.data?.success) {
    toast.success(response?.data?.message);
  } else {
    toast.error(response?.data?.message);
  }
};

// update promo-code
export const DeletePromoCode = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/promo/delete/${id}`);
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
        "unknown error occurred"
    );
  }
};

// activate/deactivate promo-code
export const ActivePromoCode = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/promo/active/${id}`);
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
        "unknown error occurred"
    );
  }
};

// get Promo-code
export const GetPromoCode = async () => {
  try {
    const response = await axiosInstance.get(`/admin/promo/`);
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
        "unknown error occurred"
    );
  }
};

// shipping Address functions

// Create shipping address
export const CreateShippingAddress = async (data: any) => {
  const response = await axiosInstance.post("/admin/shippings/create", data);
  if (response?.data?.success) {
    return response.data;
  }
};

// Update shipping address
export const UpdateShippingAddress = async (data: any) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/shippings/update/${data._id}`,
      data
    );
    if (response?.data?.success) {
      toast.success(response?.data?.message);
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

// Delete shipping address
export const DeleteShippingAddress = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/shippings/delete/${id}`);
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

// Activate/deactivate shipping address
export const ToggleShippingAddressStatus = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/shippings/active/${id}`);
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

// Get all shipping addresses
export const GetShippingAddresses = async () => {
  const response = await axiosInstance.get("/admin/shippings");
  if (response?.data?.success) {
    return response?.data;
  }
};

// -------------------------------------------- ---- SERVICE LEVEL

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

// Get all ServiceTypes
export const GetAllServiceTypes = async () => {
  try {
    const response = await axiosInstance.get("/admin/service-types");
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

/*======================================
 *           FORMS START
 ======================================*/
class FormsAPI {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axiosInstance;
  }
  async reorderFields(data: IDynamicFormField[], formId: string) {
    try {
      const response = await this.axiosInstance.patch(
        `/admin/forms/fields/reorder/${formId}`,
        data
      );
      if (response?.data?.success) {
        toast.success("Reordered Fields Successfully");
        return response.data;
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        (error as any)?.response?.data?.message ||
          (error as Error).message ||
          "Unknown error occurred"
      );
    }
  }

  async reorderForms(data: any) {
    try {
      const response = await this.axiosInstance.patch(
        `/admin/forms/reorder`,
        data
      );
      if (response?.data?.success) {
        toast.success("Reordered Forms Successfully");
        return response.data;
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        (error as any)?.response?.data?.message ||
          (error as Error).message ||
          "Unknown error occurred"
      );
    }
  }
}

export const formsAPI = new FormsAPI();

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
}

/// for all new case
class CaseAPI {
  async getAllNew() {
    try {
      const { data } = await axiosInstance.get(`/admin/cases/new`);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async cancelCase(caseId: string, reason: string) {
    try {
      const response = await axiosInstance.patch(
        `/admin/cases/cancel/${caseId}`,
        { reason }
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        return response.data;
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async chargeForOrderManually(
    caseId: string,
    data: {
      processor: string;
      serviceLevel: string;
      serviceType: string;
      additionalServices: {
        service: string;
        addons: string[];
      }[];
      billingInfo: {
        cardHolderName: string;
        cardNumber: string;
        expirationDate: string;
        cardVerificationCode: string;
      };
    }
  ) {
    const response = await axiosInstance.patch(
      `/admin/cases/charge-for-order/${caseId}`,
      data
    );
    return response?.data;
  }
}

class ProcessorAPI {
  async getActiveProcessor(caseId: string) {
    try {
      const response = await axiosInstance.get(
        `/admin/processors/active-processor/${caseId}`
      );
      if (response?.data?.success) {
        return response?.data;
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.message ||
          (error as Error).message ||
          "Unknown error occurred"
      );
    }
  }
  async chargeCustomerManually(
    formattedValues: {
      description: string;
      amount: number | undefined;
      processor: string;
      cardNumber: string;
      cvc: string;
      expiry: any;
    },
    caseId: string
  ) {
    const { data } = await axiosInstance.post(
      "/admin/cases/charge-customer-manually",
      {
        transaction: formattedValues,
        caseId,
      }
    );
    return data;
  }
  async createProcessorId(data: any) {
    try {
      const response = await axiosInstance.post("/admin/processors/", data);
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

  async UpdateProcessorId(data: any) {
    try {
      const response = await axiosInstance.put(
        `/admin/processors/${data._id}`,
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

  // Delete processorId
  async DeleteProcessorId(id: string) {
    try {
      const response = await axiosInstance.delete(`/admin/processors/${id}`);
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

  // Activate/deactivate ProcessorId
  async ToggleProcessorId(id: string) {
    try {
      const response = await axiosInstance.patch(`/admin/processors/${id}`);
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
  // Default ProcessorId
  async DefaultProcessorId(id: string) {
    try {
      const response = await axiosInstance.patch(
        `/admin/processors/default/${id}`
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

  async GetAllProcessorId() {
    try {
      const response = await axiosInstance.get("/admin/processors");
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
  }
}

// FEDEX CONFIGURATIONS

class FedexConfigurationsAPI {
  async getAll() {
    try {
      const response = await axiosInstance.get(`/admin/configs`);
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
      const response = await axiosInstance.post("/admin/configs/", data);
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
        `/admin/configs/${data._id}`,
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

  // Delete configuration
  async Delete(id: string) {
    try {
      const response = await axiosInstance.delete(`/admin/configs/${id}`);
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

  // Activate/deactivate configuration
  async Active(id: string) {
    try {
      const response = await axiosInstance.patch(`/admin/configs/${id}`);
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

// EMAIL APIs

class EmailApi {
  async resendCredentials(data: { accountId: string; caseId: string }) {
    try {
      const response = await axiosInstance.post(`/admin/email/resend`, data);
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
  async sendTestimonialRequest(caseId: string) {
    try {
      const response = await axiosInstance.patch(
        `/admin/cases/send-testimonial-request/` + caseId,
        {
          caseId,
        }
      );
      return response?.data;
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

// courier notes

class CourierNotesApi {
  async create(id: string, data: any) {
    try {
      const response = await axiosInstance.post(
        `/admin/cases/${id}/courier-note`,
        data
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        return response?.data;
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

// Additional service

class AdditionalServiceAPI {
  async getAll() {
    try {
      const response = await axiosInstance.get(`/admin/additional-Services`, {
        cache: false,
      });
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

export const visaTypeApi = new ServiceTypeAPI();
export const additionalService = new AdditionalServiceAPI();
export const emailApi = new EmailApi();
export const fedexConfigurationsAPI = new FedexConfigurationsAPI();
export const caseApi = new CaseAPI();
export const processorApi = new ProcessorAPI();
export const courierNotesApi = new CourierNotesApi();
