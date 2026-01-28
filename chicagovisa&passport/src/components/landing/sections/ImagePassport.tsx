"use client";
import { useHomepageContent } from "@/hooks/use-homepage-content";
export default function ImagePassport() {
  const content = useHomepageContent();
  const texts = content.imagePassportSection;
  return (
    <section
      id="image_passport"
      className="bg-cover bg-[bottom_center] min-h-[528px] mb-[-100px] max-[1024px]:min-h-[350px] max-[767px]:min-h-[250px] max-[767px]:mb-[-25px]"
      style={{ backgroundImage: `url(${texts.image.src})` }}
      role="img"
      aria-label={texts.image.alt}
    ></section>
  );
}