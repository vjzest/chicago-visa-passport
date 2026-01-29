import axiosInstance from "./axios/axios";

export interface GenerateLinkParams {
    serviceType: string;
    serviceLevel: string;
    note?: string;
}

export interface GenerateLinkResponse {
    success: boolean;
    link: string;
    token: string;
    expiresIn: string;
    message?: string;
    amount?: number;
}

export const PaymentLinkService = {
    generateLink: async (data: GenerateLinkParams): Promise<GenerateLinkResponse> => {
        const payload = {
            serviceTypeId: data.serviceType,
            serviceLevelId: data.serviceLevel,
            note: data.note
        };
        const response = await axiosInstance.post("/admin/payment-link/generate", payload);
        return response.data;
    },

    getLinks: async () => {
        // @ts-ignore - axios-cache-interceptor property
        const response = await axiosInstance.get("/admin/payment-link?limit=100", { cache: false });
        return response.data;
    }
};
