"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useCaseStore } from "@/store/use-case-store";
import { useDataStore } from "@/store/use-data-store";
import useFetchStoreData from "@/hooks/use-fetch-store-data";
const chinaImg = "/landing/assets/china-img.png";

import SinglePageArchive from "@/components/landing/common/SinglePageArchive";

export default function VisasSingle() {
  const params = useParams();
  const slug = params?.slug as string;

  const [activePassportIndex, setActivePassportIndex] = useState(-1);

  const { generalFormData } = useCaseStore((state) => state);
  const { storeServiceTypes } = useDataStore((state) => state);
  const { fetchServiceTypes } = useFetchStoreData();

  // Fetch service types based on country selection
  useEffect(() => {
    const fetchData = async () => {
      if (generalFormData?.citizenOf && generalFormData?.residingIn && generalFormData?.travelingTo) {
        await fetchServiceTypes({
          citizenOf: generalFormData.citizenOf,
          residingIn: generalFormData.residingIn,
          travelingTo: generalFormData.travelingTo,
        });
      }
    };

    fetchData();
  }, [generalFormData?.citizenOf, generalFormData?.residingIn, generalFormData?.travelingTo, fetchServiceTypes]);

  // Sync activePassportIndex with stored serviceType when storeServiceTypes loads
  useEffect(() => {
    if (storeServiceTypes.length > 0 && generalFormData?.serviceType) {
      const storedServiceTypeIndex = storeServiceTypes.findIndex(
        (st: any) => st._id === generalFormData.serviceType
      );
      if (storedServiceTypeIndex !== -1) {
        setActivePassportIndex(storedServiceTypeIndex);
      }
    }
  }, [storeServiceTypes, generalFormData?.serviceType]);

  // Create default page data based on the slug and traveling to country
  const pageData = useMemo(() => {
    const countryName = slug
      ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")
      : generalFormData?.travelingTo?.label || "Visa";

    return {
      hero_title: `${countryName} Visa Requirements`,
      hero_description: `Complete information and requirements for ${countryName} visa applications.`,
      image: chinaImg,
      country: `${countryName} Travel Visas`,
      requirements: storeServiceTypes.map((serviceType: any) => ({
        section_title: serviceType.serviceType || "Visa Type",
        content: {
          text: serviceType.description || `Requirements for ${serviceType.serviceType || "this visa type"}:`,
          list: serviceType.requirements || [],
        },
      })),
    };
  }, [slug, generalFormData?.travelingTo, storeServiceTypes]);

  return (
    <SinglePageArchive
      data={pageData}
      activeIndex={activePassportIndex}
      setActiveIndex={setActivePassportIndex}
      serviceTypes={storeServiceTypes}
    />
  );
}
