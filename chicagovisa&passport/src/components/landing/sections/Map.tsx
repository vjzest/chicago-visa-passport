"use client";
import { useHomepageContent } from "@/hooks/use-homepage-content";

export default function Map() {
  const content = useHomepageContent();
  const texts = content.mapSection;

  return (
    <section id="map_section">
      <iframe
        className="w-full h-[250px] md:h-[350px] lg:h-[528px] mb-[-25px] md:mb-[-100px]"
        src={texts.embedUrl}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
  );
}
