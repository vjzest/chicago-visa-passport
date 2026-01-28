import type { Metadata } from "next";
import About from "@/components/pages/home/about-page";

export const metadata: Metadata = {
  title: "About Us - Chicago Passport & Visa Expedite",
  description: "Learn more about Chicago Passport & Visa Expedite",
};

export default function AboutPage() {
  return (
    <div>
      <About />
    </div>
  );
}
