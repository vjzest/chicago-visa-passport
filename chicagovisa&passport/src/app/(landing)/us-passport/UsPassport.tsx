"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SinglePageArchive from "@/components/landing/common/SinglePageArchive";
import { useHomepageContent } from "@/hooks/use-homepage-content";
import { generalFetchApi } from "@/lib/endpoints/endpoint";
import { useCaseStore } from "@/store/use-case-store";
import { useDataStore } from "@/store/use-data-store";

export default function UsPassport() {
  const content = useHomepageContent();
  const texts = content.usPassportPage;
  const searchParams = useSearchParams();
  const initialIndex = searchParams.get("activeIndex");
  const defaultIndex = initialIndex ? Number(initialIndex) : 0;

  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const { setGeneralFormData, generalFormData } = useCaseStore();
  const { setStoreServiceLevels, setStoreServiceTypes } = useDataStore((state) => state);

  useEffect(() => {
    // Set default values for Passport flow to ensure correct routing in Plans.tsx
    setGeneralFormData({
      ...generalFormData,
      citizenOf: "US",
      travelingTo: "US",
      residingIn: "US",
    });

    const fetchServices = async () => {
      try {
        // Fetch all service types (no country filters needed for passport generally, or default to US)
        const typesResponse = await generalFetchApi.getServiceTypes({
          citizenOf: "US", // Assuming US citizens for US Passport
          travelingTo: "US", // Domestic/Gov service
          residingIn: "US"
        });

        // Also fetch Service Levels (Speed of Service)
        const levelsResponse = await generalFetchApi.getServiceLevels();

        if (typesResponse?.success) {
          setServiceTypes(typesResponse.data);
          setStoreServiceTypes(typesResponse.data); // Update store for Plans.tsx
        }

        if (levelsResponse?.success) {
          setStoreServiceLevels(levelsResponse.data); // Update store for Plans.tsx
        }

      } catch (error) {
        console.error("Error fetching passport services/levels", error);
      }
    };
    fetchServices();
  }, []);

  const passportSections = texts.passportSections || [];
  const activeItem = passportSections[activeIndex] || passportSections[0] || { title: "", description: "" };

  return (
    <>
      <SinglePageArchive
        mode="passport"
        title={texts.title}
        description={texts.description}
        image={texts.image.src}
        data={{ passportSections }}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        requirementsTitle={activeItem.title}
        requirementsDescription={activeItem.description}
        serviceTypes={serviceTypes}
        buttonText={texts.buttonText}
      />
    </>
  );
}