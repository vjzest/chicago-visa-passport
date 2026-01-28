export type TRoleData = {
  _id?: string;
  title: string;
  viewCases: {
    seeOnlyAssignedCases: boolean;
  };
  viewCaseDetails: {
    applicantInformation: boolean;
    travelInformation: boolean;
    invoiceInformation: boolean;
    shippingInformation: boolean;
    billingInformation: boolean;
    otherInformation: boolean;
    courierNotes: boolean;
    actionNotes: boolean;
    passportApplicationInformation: boolean;
    serviceTypeAndLevel: boolean;
    messages: boolean;
    emails: boolean;
    liveChat: boolean;
    companyCaseNotes: boolean;
    uploadedDocuments: boolean;
    fullCreditCardNumber: boolean;
  };

  viewAdminFeatures: {
    caseInformation: boolean;
    marketing: boolean;
    reports: boolean;
    adminLogReport: boolean;
    contentManagementSystem: boolean;
    addMessagesToAlertBoard: boolean;
    formsAndLocationInformation: boolean;
    messagesSection: boolean;
    websiteActivity: boolean;
    emailSystem: boolean;
    affiliateCenter: boolean;
    controlPanel: boolean;
    qaForum: boolean;
  };
  viewMessages: {
    all: boolean;
    assigned: boolean;
    courier: boolean;
    management: boolean;
  };
  viewReports: {
    financial: boolean;
    marketing: boolean;
    couriers: boolean;
    courierIndividual: boolean;
    employee: boolean;
    employeeIndividual: boolean;
    vendors: boolean;
    vendorsIndividual: boolean;
    liveChat: boolean;
  };
  viewManifest: {
    view: boolean;
    addRemark: boolean;
    downloadManifest: boolean;
    viewDetail: boolean;
    searchCases: boolean;
    officeEdit: boolean;
    officeArchive: boolean;
    courierEdit: boolean;
    courierArchive: boolean;
  };
  editCaseDetails: {
    assignedRepresentative: boolean;
    billingOptions: boolean;
    billingInformation: boolean;
    contactInformation: boolean;
    applicantsName: boolean;
    applicantsDateOfBirth: boolean;
    shippingInformation: boolean;
    companyCaseNotes: boolean;
    courierNotes: boolean;
    travelInformation: boolean;
    serviceTypeAndLevel: boolean;
    uploadedDocuments: boolean;
    shippingOptions: boolean;
    refundAndVoid: boolean;
    otherBillingOptions: boolean;
    inboundShippingLabel: boolean;
    outboundShippingLabel: boolean;
    actionButton: boolean;
    status: boolean;
    passportApplicationAndForm: boolean;
  };
  viewAndEditManagementTools: {
    forms: boolean;
    promoCodes: boolean;
    serviceLevel: boolean;
    serviceTypes: boolean;
    statuses: boolean;
    reports: boolean;
    faq: boolean;
    files: boolean;
    configuration: boolean;
    logs: boolean;
    shippingLocations: boolean;
    queries: boolean;
    loa: boolean;
    additionalServices: boolean;
  };
  viewSearchResults: {
    allCases: boolean;
    byAssignedLocation: boolean;
    allStatus: boolean;
    statusLimited: boolean;
    withinGivenTimeFrames: boolean;
  };
  viewCasesByLocation: { [key: string]: boolean };
  viewCasesByStatus: { [key: string]: boolean };
  ultimateUserPrivileges: {
    createAdministrator: boolean;
    createAndEditRoles: boolean;
    createAndEditUsers: boolean;
    archiveUsers: boolean;
  };
  otherSettings: {
    autoAssignCases: boolean;
    listInDropdown: boolean;
    lockOutFeature: boolean;
  };
};

// Initialize form data (truncated for brevity)
export const initialRoleFormData: TRoleData = {
  title: "",
  viewCases: {
    seeOnlyAssignedCases: false,
  },
  viewCaseDetails: {
    applicantInformation: false,
    travelInformation: false,
    invoiceInformation: false,
    shippingInformation: false,
    billingInformation: false,
    serviceTypeAndLevel: false,
    otherInformation: false,
    courierNotes: false,
    messages: false,
    emails: false,
    liveChat: false,
    companyCaseNotes: false,
    uploadedDocuments: false,
    actionNotes: false,
    passportApplicationInformation: false,
    fullCreditCardNumber: false,
  },
  viewAdminFeatures: {
    caseInformation: false,
    marketing: false,
    reports: false,
    adminLogReport: false,
    contentManagementSystem: false,
    addMessagesToAlertBoard: false,
    formsAndLocationInformation: false,
    messagesSection: false,
    websiteActivity: false,
    emailSystem: false,
    affiliateCenter: false,
    controlPanel: false,
    qaForum: false,
  },
  viewCasesByStatus: {},
  viewMessages: {
    all: false,
    assigned: false,
    courier: false,
    management: false,
  },
  viewReports: {
    financial: false,
    marketing: false,
    couriers: false,
    courierIndividual: false,
    employee: false,
    employeeIndividual: false,
    vendors: false,
    vendorsIndividual: false,
    liveChat: false,
  },
  viewManifest: {
    view: false,
    addRemark: false,
    downloadManifest: false,
    viewDetail: false,
    searchCases: false,
    officeEdit: false,
    officeArchive: false,
    courierEdit: false,
    courierArchive: false,
  },
  editCaseDetails: {
    assignedRepresentative: false,
    billingOptions: false,
    billingInformation: false,
    contactInformation: false,
    applicantsName: false,
    applicantsDateOfBirth: false,
    shippingInformation: false,
    companyCaseNotes: false,
    courierNotes: false,
    travelInformation: false,
    serviceTypeAndLevel: false,
    uploadedDocuments: false,
    passportApplicationAndForm: false,
    shippingOptions: false,
    refundAndVoid: false,
    otherBillingOptions: false,
    inboundShippingLabel: false,
    outboundShippingLabel: false,
    actionButton: false,
    status: false,
  },
  viewAndEditManagementTools: {
    forms: false,
    promoCodes: false,
    serviceLevel: false,
    serviceTypes: false,
    statuses: false,
    reports: false,
    faq: false,
    files: false,
    configuration: false,
    logs: false,
    loa: false,
    shippingLocations: false,
    queries: false,
    additionalServices: false,
  },
  viewSearchResults: {
    allCases: false,
    byAssignedLocation: false,
    allStatus: false,
    statusLimited: false,
    withinGivenTimeFrames: false,
  },
  viewCasesByLocation: {},
  ultimateUserPrivileges: {
    createAdministrator: false,
    createAndEditRoles: false,
    createAndEditUsers: false,
    archiveUsers: false,
  },
  otherSettings: {
    autoAssignCases: false,
    listInDropdown: false,
    lockOutFeature: false,
  },
};

export const accordionItems: {
  id: string;
  title: string;
  formDataKey: keyof Omit<TRoleData, "title" | "_id">;
  dynamicRender?: boolean;
}[] = [
    {
      id: "viewing-access-for-cases",
      title: "View Cases",
      formDataKey: "viewCases",
    },
    {
      id: "viewing-access-in-case-details",
      title: "View Case Details",
      formDataKey: "viewCaseDetails",
    },
    {
      id: "viewing-access-for-admin-features",
      title: "View Admin Features",
      formDataKey: "viewAdminFeatures",
    },
    {
      id: "viewing-access-for-messages",
      title: "View Messages",
      formDataKey: "viewMessages",
    },
    {
      id: "view-access-for-reports-section",
      title: "View Reports",
      formDataKey: "viewReports",
    },
    {
      id: "viewing-access-for-manifest-section",
      title: "View Manifest",
      formDataKey: "viewManifest",
    },
    {
      id: "case-details-edit-options",
      title: "Edit Case Details",
      formDataKey: "editCaseDetails",
    },
    {
      id: "view-and-edit-tools",
      title: "View and Edit Management Tools",
      formDataKey: "viewAndEditManagementTools",
    },
    {
      id: "search-bar-access",
      title: "View Search Results Based On",
      formDataKey: "viewSearchResults",
    },
    {
      id: "location-access",
      title: "View Cases By Location",
      formDataKey: "viewCasesByLocation",
      dynamicRender: true,
    },
    {
      id: "status-access",
      title: "View Cases By Status",
      formDataKey: "viewCasesByStatus",
      dynamicRender: true,
    },
    {
      id: "ultimate-users-special-privileges",
      title: "Ultimate User Privileges",
      formDataKey: "ultimateUserPrivileges",
    },
    {
      id: "other-setting-options",
      title: "Other Settings",
      formDataKey: "otherSettings",
    },
  ];
