"use client";

import { useHomepageContent } from "@/hooks/use-homepage-content";
import VisasArchive from "@/components/landing/common/VisasArchive";

export default function Visas() {
  const content = useHomepageContent();
  return (
    <>
      <VisasArchive
        title="We Offer Visas for Various Countries"
        description="Browse through each country to learn the various visa requirements
            and document types."
        data={content.visas || []}
      />
    </>
  );
}
