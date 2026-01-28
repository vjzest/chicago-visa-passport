import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type PassportStatus = "yes" | "damaged" | "stolen" | "lost";
type PassportOption = "card" | "book" | "both";

type ContactInfo = {
  emailAddress?: string;
  sameAsMailing?: boolean;
  preferredCommunication?: "mail" | "email" | "both";
  phoneNumber?: string;
  phoneNumberType?: "home" | "cell" | "work";
  additionalPhoneNumbers?: { phone: string; type: "home" | "cell" | "work" }[];
  permanent?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  mailing?: {
    inCareOf?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
};

type EmergencyContact = {
  emergencyContactName?: string;
  street?: string;
  apartmentOrUnit?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
};

interface ParentInfo {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  gender?: string;
  isUSCitizen?: boolean;
}

interface MarriageDetails {
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseDateOfBirth?: string;
  marriageDate?: string;
  spousePlaceOfBirth?: string;
  spouseIsUSCitizen?: boolean;
  isWidowedOrDivorced?: boolean;
  widowOrDivorceDate?: string;
}

interface ParentAndMarriageInfo {
  isParent1Unknown: boolean;
  isParent2Unknown: boolean;
  parent1?: ParentInfo;
  parent2?: ParentInfo;
  isMarried: boolean;
  marriageDetails?: MarriageDetails | null; // Can be `null` if not married
  isComplete: boolean;
  createdAt?: string; // If `timestamps: true` is used
  updatedAt?: string; // If `timestamps: true` is used
}

type PassportDetails = {
  firstNameAndMiddleName?: string;
  lastName?: string;
  issueDate?: string;
  status?: PassportStatus;
  number?: string;
  hasReportedLostOrStolen?: boolean;
};

type PassportHistory = {
  hasPassportCardOrBook?: PassportOption | "none";
  passportCardDetails?: PassportDetails;
  passportBookDetails?: PassportDetails & {
    isOlderThan15Years?: "yes" | "no" | "unknown";
  };
};

type ProductInfo = {
  passportOption: "card" | "book" | "both";
  largeBook?: boolean;
  processingMethod: "expedited";
  deliveryMethod?: {
    book?: "one-two-day";
  };
  additionalFees?: {
    fileSearch?: boolean;
  };
  isComplete: boolean;
};

type LostOrStolenInfo = {
  isOwnPassport: boolean;
  reporterFirstName?: string;
  reporterMiddleName?: string;
  reporterLastName?: string;
  reporterRelationship?: string;
  policeReport: boolean;
  lostAtSameTime?: boolean;
  cardLostDetails?: string;
  cardLostLocation?: string;
  cardLostDate?: string;
  bookLostDetails?: string;
  bookLostLocation?: string;
  bookLostDate?: string;
  hadPreviousLost: boolean;
  previousLostCount?: "1" | "2";
  previousLostDates?: string[];
  previousPoliceReport?: boolean;
  createdAt?: string; // Added if timestamps are used
  updatedAt?: string; // Added if timestamps are used
};

type TravelPlans = {
  travelDate?: string;
  returnDate?: string;
  travelDestination?: string;
};

type PersonalInfo = {
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
};

export type PassportFormData = {
  caseId: string;
  personalInfo?: PersonalInfo;
  contactInfo?: ContactInfo;
  emergencyContact?: EmergencyContact;
  parentAndMarriageInfo?: ParentAndMarriageInfo;
  passportHistory?: PassportHistory;
  productDetails?: ProductInfo;
  lostOrStolenInfo?: LostOrStolenInfo;
  travelPlans?: TravelPlans;
};

type PassportFormStore = {
  caseId: string;
  personalInfo?: Partial<PersonalInfo>;
  contactInfo?: Partial<ContactInfo>;
  emergencyContact?: Partial<EmergencyContact>;
  parentAndMarriageInfo?: Partial<ParentAndMarriageInfo>;
  passportHistory?: Partial<PassportHistory>;
  productDetails?: Partial<ProductInfo>;
  lostOrStolenInfo?: Partial<LostOrStolenInfo>;
  travelPlans?: Partial<TravelPlans>;

  // Setter methods for each section
  setCaseId: (caseId: string) => void;
  setPersonalInfo: (data: Partial<PersonalInfo>) => void;
  setContactInfo: (data: Partial<ContactInfo>) => void;
  setEmergencyContact: (data: Partial<EmergencyContact>) => void;
  setParentAndMarriageInfo: (data: Partial<ParentAndMarriageInfo>) => void;
  setPassportHistory: (data: Partial<PassportHistory>) => void;
  setProductDetails: (data: Partial<ProductInfo>) => void;
  setLostOrStolenInfo: (data: Partial<LostOrStolenInfo>) => void;
  setTravelPlans: (data: Partial<TravelPlans>) => void;
  resetStore: (caseId: string) => void;
};

export const usePassportApplicationStore = create<PassportFormStore>()(
  persist(
    (set) => ({
      caseId: "",
      personalInfo: {},
      contactInfo: {},
      emergencyContact: {},
      parentAndMarriageInfo: {},
      passportHistory: {},
      productDetails: {},
      lostOrStolenInfo: {},
      travelPlans: {},
      setCaseId: (caseId) => set({ caseId }),
      setParentAndMarriageInfo: (data) => set({ parentAndMarriageInfo: data }),
      setPersonalInfo: (data) => set({ personalInfo: data }),
      setContactInfo: (data) => set({ contactInfo: data }),
      setEmergencyContact: (data) => set({ emergencyContact: data }),
      setPassportHistory: (data) => set({ passportHistory: data }),
      setProductDetails: (data) => set({ productDetails: data }),
      setLostOrStolenInfo: (data) => set({ lostOrStolenInfo: data }),
      setTravelPlans: (data) => set({ travelPlans: data }),
      resetStore: (caseId) =>
        set({
          caseId,
          personalInfo: {},
          contactInfo: {},
          emergencyContact: {},
          parentAndMarriageInfo: {},
          passportHistory: {},
          productDetails: {},
          lostOrStolenInfo: {},
          travelPlans: {},
        }),
    }),
    {
      name: "passport-application-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
