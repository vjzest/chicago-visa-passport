"use client";

import { useState } from "react";
import SinglePageArchive from "@/components/landing/common/SinglePageArchive";
import { useHomepageContent } from "@/hooks/use-homepage-content";
export default function UkEtaVisa() {
  const content = useHomepageContent();
  const texts = content.ukEtaVisaPage;
  const [activePassportIndex, setActivePassportIndex] = useState(0);

  const ukEtaData = {
    country: texts.country,
    hero_title: texts.hero_title,
    hero_description: texts.hero_description,
    image: texts.image.src,
    requirements: texts.requirements || [],
  };

  return (
    <>
      <SinglePageArchive
        mode="visa"
        data={ukEtaData}
        activeIndex={activePassportIndex}
        setActiveIndex={setActivePassportIndex}
      />
    </>
  );
}