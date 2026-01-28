"use client";

import dynamic from "next/dynamic";
import { HomepageProvider } from "@/hooks/use-homepage-content";
import Hero from "@/components/landing/sections/Hero";
import ProcessSection from "@/components/landing/sections/Process";
import TravelService from "@/components/landing/sections/TravelService";
import DoneRight from "@/components/landing/sections/DoneRight";
import PopularVisas from "@/components/landing/sections/PopularVisas";
import WhyChoose from "@/components/landing/sections/WhyChoose";
import ComparisonTable from "@/components/landing/sections/ComparisonTable";
import ImagePassport from "@/components/landing/sections/ImagePassport";

const TestimonialsSlider = dynamic(
  () => import("@/components/landing/sections/Testimonials"),
  { ssr: false }
);

export default function Homepage({ content }: { content?: any }) {
  return (
    <HomepageProvider data={content}>
      <div className="bg-[#E1F1FD]">
        <Hero />
        <ProcessSection />
      </div>
      <TravelService />
      <DoneRight />
      <PopularVisas />
      <WhyChoose />
      <ComparisonTable />
      <TestimonialsSlider />
      <ImagePassport />
    </HomepageProvider>
  );
}
