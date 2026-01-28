
import axiosInstance from '@/services/axios/axios';

const generateQueryString = (params: Record<string, any>) => {
    return Object.keys(params)
        .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '')
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
};

export interface CrmReportParams {
    // 1. Customer Information
    customerName?: string;
    email?: string;
    phone?: string;
    gender?: string;
    ageGroup?: string;
    exactAge?: number;
    dob?: string;
    country?: string;
    state?: string;
    city?: string;
    zipCode?: string;

    // 2. Order Details
    orderId?: string;
    website?: string;
    serviceType?: string;
    visaCountry?: string;
    visaType?: string;
    expediteTier?: string;
    orderStatus?: string[];
    slaStatus?: string;

    // 3. Financial Information
    totalOrderValueMin?: number;
    totalOrderValueMax?: number;
    refundAmount?: number;
    promoCode?: string;
    creditCardType?: string;
    paymentStatus?: string;
    paymentProcessor?: string;

    // 4. Timeline & Dates
    orderDateFrom?: string;
    orderDateTo?: string;
    paymentDate?: string;
    docSubmissionDate?: string;
    issuedDate?: string;
    shippingDate?: string;
    deliveryDate?: string;
    slaDeadline?: string;

    // 5. Marketing & Journey
    acquisitionSource?: string;
    campaign?: string;
    landingPage?: string;
    deviceType?: string;
    browser?: string;
    os?: string;

    // 6. Operational / Fulfillment
    courier?: string;
    courierLocation?: string;
    govOffice?: string;
    qaStatus?: string;
    reworkNeeded?: string;
    reworkReason?: string;

    // 7. Customer Service
    ticketStatus?: string;
    ticketReason?: string;
    resolutionTime?: number;
    csatScore?: number;
    npsScore?: number;

    // 8. Other Options
    keywords?: string;
    staffAgent?: string;
    repeatCustomer?: boolean;
    clvMin?: number;
    clvMax?: number;
    fraudFlag?: boolean;
}

export const reportApi = {
    getCrmReports: async (payload: CrmReportParams) => {
        // Filter out empty fields
        const filteredPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v != null && v !== '')
        );

        return axiosInstance.post('/admin/reports/crm-reports', filteredPayload);
    },
};
