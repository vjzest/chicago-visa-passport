import Banner from "@/components/services/lostStolenPassport/banner";
import Requirement from "@/components/services/lostStolenPassport/requirement";
import Government from "@/components/services/lostStolenPassport/government";
// import Pricing from "@/components/services/lostStolenPassport/pricing";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQPage from "@/components/services/lostStolenPassport/faq";

import ContactPage from "@/components/pages/home/contact-page";
import type { Metadata } from "next";
import Who from "@/components/pages/home/who-is-it-for";
import InfoBox from "@/components/pages/home/info";

export const metadata: Metadata = {
  title: "Lost Passport Services – Fast Processing For 3 Days",
  description:
    "Get a replacement for your lost passport with secure processing and expedited service in as fast as 3 days. Apply for passport replacement! today",
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
