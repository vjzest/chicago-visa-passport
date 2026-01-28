import { TravelPlansFormData } from "@/components/pages/step/application-form-section";
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

export interface IAccountDetails {
  fullName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  consentToUpdates: boolean;
  caseId: string;
}

interface CaseState {
  formStatus: any;
  importantData: {
    name: string;
    email: string;
    caseId: string;
  };
  travelPlansOrderFormData: TravelPlansFormData;
  sourceInfoData: {
    howDidYouHearAboutUs?: string;
    source?: string;
    medium?: string;
    keyword?: string;
    referral?: string;
    referringUrl?: string;
  };
  accountDetails: IAccountDetails;
  verifiedEmail: string;
  isOfflineLink: boolean;
  offlinePaymentToken: string;
  setIsOfflineLink: (value: boolean) => void;
  setOfflinePaymentToken: (value: string) => void;
  billingData: {
    paymentMethod: "card" | "nmi";
    cardHolderName: string;
    cardNumber: string;
    expirationDate: string;
    cardVerificationCode: string;
  };
  userData: {
    email: string;
    fullName: string;
    _id?: string;
    phone?: string;
    email2?: string;
    phone2?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    dateOfBirth?: string;
  };
  setIsDepartureDateRequired: (value: boolean) => void;
  setUserData: (
    email: string,
    fullName: string,
    _id?: string,
    phone?: string,
    email2?: string,
    phone2?: string,
    firstName?: string,
    middleName?: string,
    lastName?: string,
    dateOfBirth?: string
  ) => void;
  setVerifiedEmail: (email: string) => void;
  setBillingData: (
    paymentMethod: "card" | "nmi",
    cardHolderName: string,
    cardNumber: string,
    expirationDate: string,
    cardVerificationCode: string
  ) => void;
  setTravelPlansOrderFormData: (data: TravelPlansFormData) => void;
  setSourceInfoData: (data: {
    howDidYouHearAboutUs?: string;
    source?: string;
    medium?: string;
    keyword?: string;
    referral?: string;
    referringUrl?: string;
  }) => void;
  setAccountDetails: ({
    fullName,
    email,
    phone,
    emailVerified,
    consentToUpdates,
    caseId,
  }: IAccountDetails) => void;
  passportFormData: { [key in IPassportFormKeys]?: object };
  setPassportFormData: (values: {
    [key in IPassportFormKeys]?: object;
  }) => void;
  generalFormData: any;
  formData: any;
  isDepartureDateRequired: boolean;
  setFormData: (data: any) => void;
  setGeneralFormData: (data: any) => void;
  setFormStatus: (data: any) => void;
  clearAllData: () => void;
}

export const useCaseStore = create<CaseState>()(
  devtools(
    persist(
      (set) => ({
        isDepartureDateRequired: false,
        isOfflineLink: false,
        offlinePaymentToken: "",
        setIsOfflineLink: (value) => set({ isOfflineLink: value }),
        setOfflinePaymentToken: (value) => set({ offlinePaymentToken: value }),
        formStatus: {},
        generalFormData: {},
        travelPlansOrderFormData: {
          hasPlans: false,
        },
        sourceInfoData: {},
        passportFormData: {},
        formData: {
          isBillingSameAsShipping: true,
        },
        importantData: {
          name: "",
          email: "",
          caseId: "",
        },
        verifiedEmail: "",
        accountDetails: {
          fullName: "",
          phone: "",
          email: "",
          emailVerified: false,
          consentToUpdates: true,
          caseId: "",
        },
        billingData: {
          paymentMethod: "nmi",
          cardHolderName: "",
          cardNumber: "",
          expirationDate: "",
          cardVerificationCode: "",
        },
        userData: {
          email: "",
          fullName: "",
          _id: "",
          phone: "",
          firstName: "",
          middleName: "",
          lastName: "",
          dateOfBirth: "",
        },
        setIsDepartureDateRequired: (value: boolean) =>
          set({ isDepartureDateRequired: value }),
        setUserData: (
          email,
          fullName,
          _id,
          phone,
          email2,
          phone2,
          firstName,
          middleName,
          lastName,
          dateOfBirth
        ) =>
          set({
            userData: {
              email,
              fullName,
              _id,
              phone,
              email2,
              phone2,
              firstName,
              middleName,
              lastName,
              dateOfBirth,
            },
          }),
        setVerifiedEmail: (email) => set({ verifiedEmail: email }),
        setSourceInfoData: (data) => set({ sourceInfoData: data }),
        setAccountDetails: ({
          fullName,
          phone,
          email,
          emailVerified,
          consentToUpdates,
          caseId,
        }) =>
          set({
            accountDetails: {
              fullName,
              phone,
              email,
              emailVerified,
              consentToUpdates,
              caseId,
            },
          }),
        setBillingData: (
          paymentMethod,
          cardHolderName,
          cardNumber,
          expirationDate,
          cardVerificationCode
        ) =>
          set({
            billingData: {
              paymentMethod,
              cardHolderName,
              cardNumber,
              expirationDate,
              cardVerificationCode,
            },
          }),
        setFormData: (data) => set({ formData: data }),
        setTravelPlansOrderFormData: (data: TravelPlansFormData) =>
          set({ travelPlansOrderFormData: data }),
        setGeneralFormData: (data) =>
          set((state) => ({
            generalFormData: { ...state.generalFormData, ...data },
          })),

        setFormStatus: (data) =>
          set((state) => ({ formStatus: { ...state.formStatus, ...data } })),
        setPassportFormData: (data: { [key in IPassportFormKeys]?: object }) =>
          set((state) => ({
            passportFormData: { ...state.passportFormData, ...data },
          })),
        clearAllData: () => {
          set((state) => {
            return {
              isOfflineLink: false,
              offlinePaymentToken: "",
              formStatus: {},
              generalFormData: {},
              travelPlansOrderFormData: {
                hasPlans: false,
              },
              sourceInfoData: {},
              passportFormData: {},
              formData: {},
              importantData: {
                name: "",
                email: "",
                caseId: "",
              },
              verifiedEmail: "",
              accountDetails: {
                fullName: "",
                phone: "",
                email: "",
                emailVerified: false,
                consentToUpdates: true,
                caseId: "",
              },
              billingData: {
                paymentMethod: "nmi",
                cardHolderName: "",
                cardNumber: "",
                expirationDate: "",
                cardVerificationCode: "",
              },
              userData: {
                email: "",
                fullName: "",
                _id: "",
                phone: "",
                firstName: "",
                middleName: "",
                lastName: "",
                dateOfBirth: "",
              },
            };
          });
        },
      }),
      {
        name: "case-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
