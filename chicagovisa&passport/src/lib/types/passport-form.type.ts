import { TravelPlansFormData } from "@/components/pages/step/application-form-section";

export interface PersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  dateOfBirth: string;
  gender: string;
  changingGenderMarker?: boolean;
  cityOfBirth: string;
  countryOfBirth: string;
  stateOfBirth?: string;
  socialSecurityNumber: string;
  occupation: string;
  employerOrSchool?: string;
  height: {
    feet: number;
    inches: number;
  };
  eyeColor: string;
  hairColor: string;
  isComplete: boolean;
}

interface _Address {
  line1: string;
  line2?: string;
  inCareOf?: string;
  city: string;
  zipCode: string;
  country: string;
  state?: string;
}

export interface ContactInfo {
  mailing: _Address;
  permanent?: _Address;
  sameAsMailing: boolean;
  emailAddress: string;
  phoneNumber: string;
  phoneNumberType: "home" | "cell" | "work";
  additionalPhoneNumber?: string;
  additionalPhoneNumberType?: "home" | "cell" | "work";
  preferredCommunication: "mail" | "email" | "both";
  isComplete: boolean;
}
export interface EmergencyContact {
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  street?: string;
  apartmentOrUnit?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  isComplete: boolean;
}
interface _Parent {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  gender?: string;
  isUSCitizen: boolean;
}

interface _MarriageDetails {
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseDateOfBirth?: string;
  marriageDate?: string;
  spousePlaceOfBirth?: string;
  spouseIsUSCitizen?: boolean;
  isWidowedOrDivorced?: boolean;
  widowOrDivorceDate?: string;
}

export interface ParentAndMarriageInfo {
  isParent1Unknown: boolean;
  isParent2Unknown: boolean;
  parent1?: _Parent; // Required if `isParent1Unknown` is false
  parent2?: _Parent; // Required if `isParent2Unknown` is false
  isMarried: boolean;
  marriageDetails?: _MarriageDetails; // Required if `isMarried` is true
  isComplete: boolean;
}

interface _PassportCardDetails {
  status: "yes" | "damaged" | "lost" | "stolen";
  firstNameAndMiddleName?: string;
  lastName?: string;
  number?: string;
  issueDate?: string;
  hasReportedLostOrStolen?: boolean;
}

interface _PassportBookDetails {
  status: "yes" | "damaged" | "lost" | "stolen";
  firstNameAndMiddleName?: string;
  lastName?: string;
  number?: string;
  issueDate?: string;
  isOlderThan15Years?: "yes" | "no" | "unknown";
  hasReportedLostOrStolen?: boolean;
  isComplete: boolean;
}

export interface PassportHistory {
  hasPassportCardOrBook: "book" | "card" | "both" | "none";
  passportCardDetails?: _PassportCardDetails;
  passportBookDetails?: _PassportBookDetails;
  isComplete?: boolean;
}

export interface ProductInfo {
  passportOption: "card" | "book" | "both";
  largeBook?: boolean;
  processingMethod: "routine" | "expedited" | "agency";
  deliveryMethod: {
    book: "standard" | "one-two-day";
  };
  additionalFees?: {
    fileSearch?: boolean;
  };
  isComplete: boolean;
}

export interface IPassportFormData {
  personalInfo?: PersonalInfo;
  contactInfo?: ContactInfo;
  emergencyContact?: EmergencyContact;
  parentAndMarriageInfo?: ParentAndMarriageInfo;
  passportHistory?: PassportHistory;
  travelPlans?: TravelPlansFormData;
  productInfo?: ProductInfo;
  lostInfo?: any;
  nameChangeInfo?: any;
}
