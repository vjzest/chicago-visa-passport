import Banner from "@/components/services/passportCard/banner";
import Requirement from "@/components/services/passportCard/requirement";
import Government from "@/components/services/passportCard/government";
// import Pricing from "@/components/services/passportCard/pricing";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQPage from "@/components/services/passportCard/faq";

import ContactPage from "@/components/pages/home/contact-page";
import type { Metadata } from "next";
import Who from "@/components/pages/home/who-is-it-for";
import InfoBox from "@/components/pages/home/info";

export const metadata: Metadata = {
  title: "Passport Card Services - Get Yours Today!",
  description:
    " Need a passport card? Apply easily with fast processing and expedited service in as fast as 3 days. Get your passport card for land and sea travel today!",
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
