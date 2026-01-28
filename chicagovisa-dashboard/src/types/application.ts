type IApplicantInfo = {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
} & any;

export type IApplication = {
  _id: string;
  applicantInfo: IApplicantInfo;
  status: {
    title: string;
    _id: string;
  };
  subStatus: {
    title: string;
    _id: string;
  };
  flag: boolean;
  caseManager: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  success: boolean;
  additionalShippingOptions?: {
    firstMorningOvernight: boolean;
    saturdayDelivery: boolean;
    extraShipping: boolean;
    inboundTrackingId?: { id: string };
    outboundTrackingId?: { id: string };
    outbound2TrackingId?: { id: string };
    outbound3TrackingId?: { id: string };
  };
  isSuccess: boolean;
  notes: [];
  docReviewStatus: "pending" | "ongoing" | "approved" | "rejected" | "expert";
  docReviewMessage: string;
  inBoundStatus: "not sent" | "sent" | "delivered";
  outBoundStatus: "not sent" | "sent" | "delivered";
  outBound2Status: "not sent" | "sent" | "delivered";
  outBound3Status: "not sent" | "sent" | "delivered";
  documents: {
    title: string;
    isVerified: boolean;
    urls: string[];
  }[];
};
