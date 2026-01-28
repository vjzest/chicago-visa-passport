import Banner from "@/components/services/newAdultPassport/banner";
import Requirement from "@/components/services/newAdultPassport/requirement";
import Government from "@/components/services/newAdultPassport/government";
// import Pricing from "@/components/services/newAdultPassport/pricing";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQPage from "@/components/services/newAdultPassport/faq";

import ContactPage from "@/components/pages/home/contact-page";
import type { Metadata } from "next";

import InfoBox from "@/components/pages/home/info";
import Who from "@/components/pages/home/who-is-it-for";

export const metadata: Metadata = {
  title: "New Passport Services – Fast & Easy Processing in 3 Days",
  description:
    "Need a new passport? Apply easily with fast processing options, including expedited services with Chicago Passport & Visa Expedite. Start your application today!",
};

const page = () => {
  return (
    <div>
      <Banner />
      <HowItWorks />
      {/* <Who /> */}
      <Requirement />
      <Government />
      {/* <Pricing /> */}
      <FAQPage />
      {/* <TestimonialsSection /> */}
      <ContactPage />
      <InfoBox />
    </div>
  );
};

export default page;
