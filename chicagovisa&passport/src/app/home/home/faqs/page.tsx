import FAQPage from "@/app/home/home/faqs/seprateFAQ";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Chicago Passport & Visa Expedite",
  description: "Learn more about Chicago Passport & Visa Expedite",
};

export default function Page() {
  return <FAQPage />;
}
