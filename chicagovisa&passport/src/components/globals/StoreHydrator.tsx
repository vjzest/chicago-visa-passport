"use client";

import { useRef } from "react";
import { useDataStore } from "@/store/use-data-store";

interface HydrationData {
    homepageContent?: any;
    serviceLevels?: any[];
    additionalServices?: any[];
    contactInfo?: any;
    toCountries?: any[];
}

export default function StoreHydrator({ data }: { data: HydrationData }) {
    const initialized = useRef(false);

    if (!initialized.current && data) {
        const store = useDataStore.getState();

        if (data.homepageContent) store.setHomepageContent(data.homepageContent);
        if (data.serviceLevels) store.setStoreServiceLevels(data.serviceLevels);
        if (data.additionalServices) store.setStoreAdditionalServices(data.additionalServices);
        if (data.contactInfo) store.setStoreContactInfo(data.contactInfo);

        initialized.current = true;
    }

    return null;
}
