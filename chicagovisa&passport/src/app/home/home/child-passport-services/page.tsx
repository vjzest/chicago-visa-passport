import Banner from "@/components/services/childPassport/banner";
import Requirement from "@/components/services/childPassport/requirement";
import Government from "@/components/services/childPassport/government";
// import Pricing from "@/components/services/childPassport/pricing";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQPage from "@/components/services/childPassport/faq";

import ContactPage from "@/components/pages/home/contact-page";
import type { Metadata } from "next";
import Who from "@/components/pages/home/who-is-it-for";
import InfoBox from "@/components/pages/home/info";

export const metadata: Metadata = {
  title: "Child Passport Services – Fast & Secure Processing in 3 Days",
  description:
    "Get your child's passport with fast processing options, including expedited services in as fast as 3 days. Start your child’s passport application today!",
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
