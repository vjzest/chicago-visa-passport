interface IReferralSource {
  source: string;
  medium: string;
  keyword: string;
  referral: string;
  promoCode: string;
  referringUrl: string;
}

interface IAdditionalService {
  service: string; // ObjectId of the additional service
  addons?: string[]; // ObjectId of addon services
}

interface IAdditionalShippingOptions {
  firstMorningOvernight?: boolean;
  saturdayDelivery?: boolean;
  extraShipping?: boolean;
  inBoundStatus?: "not sent" | "sent" | "delivered" | "";
  outBoundStatus?: "not sent" | "sent" | "delivered" | "";
  outBound2Status?: "not sent" | "sent" | "delivered" | "";
  outBound3Status?: "not sent" | "sent" | "delivered" | "";
  inboundTrackingId: {
    id: string;
    note: string;
    createdAt: string;
  };
  outboundTrackingId: {
    id: string;
    createdAt: string;
  };
  outbound2TrackingId: {
    id: string;
    createdAt: string;
  };
  outbound3TrackingId: {
    id: string;
    createdAt: string;
  };
}

interface ICourierNote {
  note: string;
  host: string;
  createdAt: Date;
}

interface IBillingInfo {
  cardNumber: string;
  cardHolderName: string;
  expirationDate?: string;
  expirationMonth?: string;
  expirationYear?: string;
  cardVerificationCode: string;
}

interface IAccountDetails {
  email1?: string;
  email2?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone1?: string;
  phone2?: string;
  consentToUpdates?: boolean;
}

interface ICancellation {
  status: "none" | "requested" | "cancelled" | "rejected";
  note?: string;
  date?: Date | null;
}

interface ICaseInfo {
  caseManager?: string;
  isCanceled?: boolean;
  statusDate?: Date;
  status?: string;
  stateOfResidency?: string;
  subStatus1?: string;
  subStatus2?: string;
  serviceLevel: string; // ObjectId of the Speed of Service
  serviceType: string; // ObjectId of the service type
  referralSource?: IReferralSource;
  additionalShippingOptions?: IAdditionalShippingOptions;
  additionalServices?: IAdditionalService[];
  statusChange?: string;
  processingLocation?: string;
  requestForTestimonial?: boolean;
  disableAutoEmails?: boolean;
  notes?: string[];
  voidTransaction?: boolean;
  makeConfirmationMailObsolete?: boolean;
}

interface IApplicantInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  email?: string;
}

interface IRefund {
  isRefunded: boolean;
  refundedAmount: number;
  refundNote?: string;
}

interface IVoid {
  isVoid: boolean;
  voidAmount: number;
  voidNote?: string;
}

interface IDocument {
  document: string; // ObjectId of the document
  isVerified?: boolean;
  urls?: string[];
}

export interface ICase {
  _id: string;
  caseNo: string;
  account?: string; // ObjectId of the account
  billingInfo: IBillingInfo;
  caseInfo: ICaseInfo;
  accountDetails?: IAccountDetails;
  isOpened?: boolean;
  refund?: IRefund;
  void?: IVoid;
  lastOpened?: Date | null;
  cancellation?: ICancellation;
  courierNotes?: ICourierNote[];
  additionalShippingOptions?: IAdditionalShippingOptions;
  passportFormUrl?: string;
  inboundStatus: string;
  reviewStage: "application" | "documents" | "done";
  applicationReviewStatus: "pending" | "ongoing" | "approved" | "rejected";
  applicationReviewMessage?: string;
  docReviewStatus:
    | "pending"
    | "ongoing"
    | "approved"
    | "rejected"
    | "expert"
    | string;
  docReviewMessage: string;
  documents: IDocument[];
  notes?: {
    manualNote?: string;
    autoNote?: string;
    host?: string;
    createdAt?: Date;
  }[];
}
