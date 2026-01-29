import mongoose from "mongoose";

export interface IRole {
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
    configuration: boolean;
    logs: boolean;
    shippingLocations: boolean;
    queries: boolean;
    additionalServices: boolean;
  };
  viewSearchResults: {
    allCases: boolean;
    byAssignedLocation: boolean;
    allStatus: boolean;
    statusLimited: boolean;
    withinGivenTimeFrames: boolean;
  };
  viewCasesByLocation: Map<string, boolean>;
  viewCasesByStatus: Map<string, boolean>;
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
}

const roleSchema = new mongoose.Schema<IRole>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
  },
  viewCases: {
    seeOnlyAssignedCases: { type: Boolean, default: false },
    _id: false,
  },
  viewCaseDetails: {
    applicantInformation: { type: Boolean, default: false },
    travelInformation: { type: Boolean, default: false },
    invoiceInformation: { type: Boolean, default: false },
    shippingInformation: { type: Boolean, default: false },
    billingInformation: { type: Boolean, default: false },
    otherInformation: { type: Boolean, default: false },
    courierNotes: { type: Boolean, default: false },
    actionNotes: { type: Boolean, default: false },
    messages: { type: Boolean, default: false },
    emails: { type: Boolean, default: false },
    liveChat: { type: Boolean, default: false },
    companyCaseNotes: { type: Boolean, default: false },
    uploadedDocuments: { type: Boolean, default: false },
    serviceTypeAndLevel: { type: Boolean, default: false },
    passportApplicationInformation: { type: Boolean, default: false },
    fullCreditCardNumber: { type: Boolean, default: false },
    _id: false,
  },
  viewAdminFeatures: {
    caseInformation: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
    reports: { type: Boolean, default: false },
    adminLogReport: { type: Boolean, default: false },
    contentManagementSystem: { type: Boolean, default: false },
    addMessagesToAlertBoard: { type: Boolean, default: false },
    formsAndLocationInformation: { type: Boolean, default: false },
    messagesSection: { type: Boolean, default: false },
    websiteActivity: { type: Boolean, default: false },
    emailSystem: { type: Boolean, default: false },
    affiliateCenter: { type: Boolean, default: false },
    controlPanel: { type: Boolean, default: false },
    qaForum: { type: Boolean, default: false },
    _id: false,
  },
  viewMessages: {
    all: { type: Boolean, default: false },
    assigned: { type: Boolean, default: false },
    courier: { type: Boolean, default: false },
    management: { type: Boolean, default: false },
    _id: false,
  },
  viewReports: {
    financial: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
    couriers: { type: Boolean, default: false },
    courierIndividual: { type: Boolean, default: false },
    employee: { type: Boolean, default: false },
    employeeIndividual: { type: Boolean, default: false },
    vendors: { type: Boolean, default: false },
    vendorsIndividual: { type: Boolean, default: false },
    liveChat: { type: Boolean, default: false },
    _id: false,
  },
  viewManifest: {
    view: { type: Boolean, default: false },
    addRemark: { type: Boolean, default: false },
    downloadManifest: { type: Boolean, default: false },
    viewDetail: { type: Boolean, default: false },
    searchCases: { type: Boolean, default: false },
    officeEdit: { type: Boolean, default: false },
    officeArchive: { type: Boolean, default: false },
    courierEdit: { type: Boolean, default: false },
    courierArchive: { type: Boolean, default: false },
    _id: false,
  },
  editCaseDetails: {
    assignedRepresentative: { type: Boolean, default: false },
    billingOptions: { type: Boolean, default: false },
    billingInformation: { type: Boolean, default: false },
    contactInformation: { type: Boolean, default: false },
    applicantsName: { type: Boolean, default: false },
    applicantsDateOfBirth: { type: Boolean, default: false },
    shippingInformation: { type: Boolean, default: false },
    companyCaseNotes: { type: Boolean, default: false },
    courierNotes: { type: Boolean, default: false },
    travelInformation: { type: Boolean, default: false },
    uploadedDocuments: { type: Boolean, default: false },
    passportApplicationAndForm: { type: Boolean, default: false },
    shippingOptions: { type: Boolean, default: false },
    refundAndVoid: { type: Boolean, default: false },
    otherBillingOptions: { type: Boolean, default: false },
    inboundShippingLabel: { type: Boolean, default: false },
    outboundShippingLabel: { type: Boolean, default: false },
    serviceTypeAndLevel: { type: Boolean, default: false },
    actionButton: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    _id: false,
  },
  viewAndEditManagementTools: {
    forms: { type: Boolean, default: false },
    promoCodes: { type: Boolean, default: false },
    serviceLevel: { type: Boolean, default: false },
    serviceTypes: { type: Boolean, default: false },
    statuses: { type: Boolean, default: false },
    reports: { type: Boolean, default: false },
    faq: { type: Boolean, default: false },
    loa: { type: Boolean, default: false },
    configuration: { type: Boolean, default: false },
    files: { type: Boolean, default: false },
    logs: { type: Boolean, default: false },
    shippingLocations: { type: Boolean, default: false },
    queries: { type: Boolean, default: false },
    additionalServices: { type: Boolean, default: false },
    _id: false,
  },
  viewSearchResults: {
    allCases: { type: Boolean, default: false },
    byAssignedLocation: { type: Boolean, default: false },
    allStatus: { type: Boolean, default: false },
    statusLimited: { type: Boolean, default: false },
    withinGivenTimeFrames: { type: Boolean, default: false },
    _id: false,
  },
  viewCasesByLocation: {
    type: Map,
    of: Boolean,
    required: true,
    _id: false,
  },
  viewCasesByStatus: {
    type: Map,
    of: Boolean,
    required: true,
    _id: false,
  },
  ultimateUserPrivileges: {
    createAdministrator: { type: Boolean, default: false },
    createAndEditRoles: { type: Boolean, default: false },
    createAndEditUsers: { type: Boolean, default: false },
    archiveUsers: { type: Boolean, default: false },
    _id: false,
  },
  otherSettings: {
    autoAssignCases: { type: Boolean, default: false },
    listInDropdown: { type: Boolean, default: false },
    lockOutFeature: { type: Boolean, default: false },
    _id: false,
  },
});

// Custom validation to ensure at least one boolean is true in each section except otherSettings
roleSchema.pre("save", function (next) {
  const sections = [
    { path: "viewCases", data: this.viewCases },
    { path: "viewInCaseDetails", data: this.viewCaseDetails },
    { path: "viewAdminFeatures", data: this.viewAdminFeatures },
    { path: "viewMessages", data: this.viewMessages },
    { path: "viewReports", data: this.viewReports },
    { path: "viewManifest", data: this.viewManifest },
    { path: "editCaseDetails", data: this.editCaseDetails },
    {
      path: "viewAndEditManagementTools",
      data: this.viewAndEditManagementTools,
    },
    { path: "viewSearchResults", data: this.viewSearchResults },
    { path: "ultimateUserPrivileges", data: this.ultimateUserPrivileges },
  ];
  for (const section of sections) {
    const hasAtLeastOneTrue = Object.values(section.data!).some(
      (value) => value === true
    );
    if (hasAtLeastOneTrue) {
      next();
      return;
    }
  }

  // Special handling for Map types
  const locationValues = Array.from(this.viewCasesByLocation.values());
  const statusValues = Array.from(this.viewCasesByStatus.values());

  if (locationValues.some((value) => value === true)) {
    next();
    return;
  }

  if (statusValues.some((value) => value === true)) {
    next();
    return;
  }

  next(new Error("At least one access should be given to the role"));
});

export const RolesModel = mongoose.model("roles", roleSchema);

export const ROLE_FIELD_EXCLUSION: { [key: string]: string | string[] } = {
  applicantInformation: "applicantInfo",
  travelInformation: "travelPlansInfo",
  shippingInformation: "shippingInformation",
  billingInformation: "billingInformation",
  otherInformation: ["submissionDate"],
  courierNotes: "courierNotes",
  actionNotes: "actionNotes",
  passportApplicationInformation: ["passportFormLogs", "passportFormUrl"],
  serviceTypeAndLevel: ["serviceType", "serviceLevel"],
  messages: "messages",
  emails: "emails",
  liveChat: "liveChat",
  companyCaseNotes: "notes",
  uploadedDocuments: "documents",
};
