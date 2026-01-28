import AboutJett from "@/components/about-jett/about-jett";
import BlogSection from "@/components/blog-post/blog-post";
import Features from "@/components/globals/hero-section/features";
import HeroWrapper from "@/components/globals/hero-section/hero";
import { ServiceSelection } from "@/components/globals/passport-services/service-selection";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import FAQPage from "@/components/pages//home/home-faq";
import GetYourPassport from "@/components/pages/home/get-your-passport";
import InfoBox from "@/components/pages/home/info";
import SuspendedApplicationPage from "@/components/pages/home/suspended-application-page";

import { fetchHomepageContent } from "@/services/content.service";

export default async function Home() {
  const content = await fetchHomepageContent();

  return (
    <div>
      <HeroWrapper content={content?.heroSection} />
      <HowItWorks content={content?.processSection} />
      <div id="passport " className="">
        <ServiceSelection />
      </div>
      <Features />
      <AboutJett />
      {/* <TestimonialsSection />  */}
      {/* client  */}
      <SuspendedApplicationPage />
      <FAQPage /> {/* client */}
      <GetYourPassport />
      <BlogSection /> {/* client */}
      {/* <ContactPage /> */}
      <InfoBox />
    </div>
  );
}
