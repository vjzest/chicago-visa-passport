export type AccessParams = "read" | "write" | "delete";

export type ServiceKeys =
  | "stats"
  | "cases"
  | "forms"
  | "promoCodes"
  | "serviceLevel"
  | "serviceTypes"
  | "statuses"
  | "reports"
  | "faq"
  | "roles"
  | "configuration";

export interface IRole {
  _id: string;
  title: "";
  viewCases: {
    seeOnlyAssignedCases: false;
  };
  viewCaseDetails: {
    applicantInformation: false;
    travelInformation: false;
    invoiceInformation: false;
    shippingInformation: false;
    billingInformation: false;
    serviceTypeAndLevel: false;
    otherInformation: false;
    courierNotes: false;
    messages: false;
    emails: false;
    liveChat: false;
    companyCaseNotes: false;
    uploadedDocuments: false;
    actionNotes: false;
    passportApplicationInformation: false;
  };
  viewAdminFeatures: {
    caseInformation: false;
    marketing: false;
    reports: false;
    adminLogReport: false;
    contentManagementSystem: false;
    addMessagesToAlertBoard: false;
    formsAndLocationInformation: false;
    messagesSection: false;
    websiteActivity: false;
    emailSystem: false;
    affiliateCenter: false;
    controlPanel: false;
    qaForum: false;
  };
  viewCasesByStatus: {};
  viewMessages: {
    all: false;
    assigned: false;
    courier: false;
    management: false;
  };
  viewReports: {
    financial: false;
    marketing: false;
    couriers: false;
    courierIndividual: false;
    employee: false;
    employeeIndividual: false;
    vendors: false;
    vendorsIndividual: false;
    liveChat: false;
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
    assignedRepresentative: false;
    billingOptions: false;
    billingInformation: false;
    contactInformation: false;
    applicantsName: false;
    applicantsDateOfBirth: false;
    shippingInformation: false;
    companyCaseNotes: false;
    courierNotes: false;
    travelInformation: false;
    serviceTypeAndLevel: false;
    uploadedDocuments: false;
    passportApplicationAndForm: false;
    shippingOptions: false;
    refundAndVoid: false;
    otherBillingOptions: false;
    inboundShippingLabel: false;
    outboundShippingLabel: false;
    actionButton: false;
    status: false;
  };
  viewAndEditManagementTools: {
    forms: false;
    promoCodes: false;
    serviceLevel: false;
    serviceTypes: false;
    statuses: false;
    reports: false;
    faq: false;
    configuration: false;
    logs: false;
    shippingLocations: false;
    queries: false;
    additionalServices: false;
  };
  viewSearchResults: {
    allCases: false;
    byAssignedLocation: false;
    allStatus: false;
    statusLimited: false;
    withinGivenTimeFrames: false;
  };
  viewCasesByLocation: {};
  ultimateUserPrivileges: {
    createAdministrator: false;
    createAndEditRoles: false;
    createAndEditUsers: false;
    archiveUsers: false;
  };
  otherSettings: {
    autoAssignCases: false;
    listInDropdown: false;
    lockOutFeature: false;
  };
}
