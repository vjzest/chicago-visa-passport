import Banner from "@/components/services/passportPages/banner";
import Requirement from "@/components/services/passportPages/requirement";
import Government from "@/components/services/passportPages/government";
// import Pricing from "@/components/services/passportPages/pricing";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQPage from "@/components/services/passportPages/faq";

import ContactPage from "@/components/pages/home/contact-page";
import type { Metadata } from "next";
import Who from "@/components/pages/home/who-is-it-for";
import InfoBox from "@/components/pages/home/info";

export const metadata: Metadata = {
  title: "Add Passport Pages - Chicago Passport & Visa Expedite",
  description: "Learn more about Chicago Passport & Visa Expedite",
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
