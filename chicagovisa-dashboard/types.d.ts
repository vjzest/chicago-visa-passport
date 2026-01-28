type ManifestRecord = {
  _id: string;
  applicantInfo: {
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
  };
  departureDate?: string;
  serviceType: {
    serviceType: string;
  };
  serviceLevel: {
    serviceLevel: string;
  };
  caseManager: {
    firstName: string;
    lastName: string;
  };
  caseNo: string;
  manifestRemarks: string;
  paymentMethod?: "Online" | "Offline" | "Pending";
  isOfflineLink?: boolean;
  deviceInfo?: {
    isOfflineLink?: boolean;
  };
};

type CaseSearchResult = {
  caseNo: string;
  applicantInfo: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
  };
  contactInformation: {
    email1?: string;
  };
  caseInfo: {
    serviceType: {
      serviceType: string;
    };
  };
  _id: string;
};

type CaseSearchFormData = {
  fullName: string;
  dateOfBirth: string;
  email: string;
};
