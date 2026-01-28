import Banner from "@/components/services/damagedPassport/banner";
import Requirement from "@/components/services/damagedPassport/requirement";
import Government from "@/components/services/damagedPassport/government";
// import Pricing from "@/components/services/damagedPassport/pricing";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQPage from "@/components/services/damagedPassport/faq";

import ContactPage from "@/components/pages/home/contact-page";
import type { Metadata } from "next";
import Who from "@/components/pages/home/who-is-it-for";
import InfoBox from "@/components/pages/home/info";

export const metadata: Metadata = {
  title: "Damaged Passport Services - Fast & Expedited Processing",
  description:
    "Worried about your damaged passport? Get a fast replacement with expedited processing from Chicago Passport & Visa Expedite. Apply today for a hassle-free replacement!",
};

const page = () => {
  return (
    <div>
      <Banner />
      <Who />
      <Requirement />
      <Government />
      {/* <Pricing /> */}
      <HowItWorks />
      <FAQPage />
      {/* <TestimonialsSection /> */}
      <ContactPage />
      <InfoBox />
    </div>
  );
};

export default page;
