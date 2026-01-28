import { create } from "zustand";

interface DataState {
  storeServiceTypes: any[];
  storeServiceLevels: any[];
  storeAdditionalServices: any[];
  homepageContent: any | null;
  storeContactInfo: {
    email: string;
    phone: string;
    googleMapsUrl: string;
  };
  setStoreContactInfo: (contactInfo: {
    email: string;
    phone: string;
    googleMapsUrl: string;
  }) => void;
  setStoreServiceTypes: (storeServiceTypes: any[]) => void;
  setStoreServiceLevels: (storeServiceLevels: any[]) => void;
  setStoreAdditionalServices: (storeAdditionalServices: any[]) => void;
  setHomepageContent: (content: any) => void;
}

export const useDataStore = create<DataState>()((set) => ({
  storeServiceTypes: [],
  storeServiceLevels: [],
  storeAdditionalServices: [],
  homepageContent: null,
  storeContactInfo: {
    email: "",
    phone: "",
    googleMapsUrl: "",
  },
  setStoreContactInfo: (contactInfo: {
    email: string;
    phone: string;
    googleMapsUrl: string;
  }) => set({ storeContactInfo: contactInfo }),
  setStoreServiceTypes: (serviceTypes) =>
    set({ storeServiceTypes: serviceTypes }),
  setStoreServiceLevels: (serviceLevels) =>
    set({ storeServiceLevels: serviceLevels }),
  setStoreAdditionalServices: (additionalServices) =>
    set({ storeAdditionalServices: additionalServices }),
  setHomepageContent: (content) => set({ homepageContent: content }),
}));
