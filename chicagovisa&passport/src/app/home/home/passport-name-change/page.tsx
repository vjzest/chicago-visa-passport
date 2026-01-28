import Banner from "@/components/services/nameChanges/banner";
import Requirement from "@/components/services/nameChanges/requirement";
import Government from "@/components/services/nameChanges/government";
// import Pricing from "@/components/services/nameChanges/pricing";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQPage from "@/components/services/nameChanges/faq";

import ContactPage from "@/components/pages/home/contact-page";
import type { Metadata } from "next";
import Who from "@/components/pages/home/who-is-it-for";
import InfoBox from "@/components/pages/home/info";

export const metadata: Metadata = {
  title: "Name Change Services – Get It Updated In As Fast3 Days",
  description:
    "Need a name change? Get a fast and secure update with expedited processing. Apply today to update your passport name hassle-free! ",
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
