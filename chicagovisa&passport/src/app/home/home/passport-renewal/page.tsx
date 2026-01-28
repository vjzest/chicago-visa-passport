import Banner from "@/components/services/passportRenewal/banner";
import Requirement from "@/components/services/passportRenewal/requirement";
import Government from "@/components/services/passportRenewal/government";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQPage from "@/components/services/passportRenewal/faq";
import ContactPage from "@/components/pages/home/contact-page";
import InfoBox from "@/components/pages/home/info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Passport Renewal Services - Get Your Passport in 3 Days",
  description:
    "Need a passport renewal? Renew your passport quickly in a secure and expedited service in as fast as 3 days. Start your renewal process today.",
};

const page = () => {
  return (
    <div>
      <Banner />
      {/* <Who /> */}
      <HowItWorks />
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
