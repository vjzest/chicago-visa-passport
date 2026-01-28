"use client";
import WhyChoose from "@/components/landing/sections/WhyChoose";
import ContactUsServices from "@/components/landing/sections/ContactUsServices";
import Map from "@/components/landing/sections/Map";
import VisaProcessStep from "./VisaProcessSteps";
import { useHomepageContent } from "@/hooks/use-homepage-content";

export default function VisaProcess() {
  const content = useHomepageContent();
  const texts = content.visaProcessPage;

  return (
    <>
      <section
        id="visa_process"
        className="bg-[linear-gradient(to_bottom,#e1f1fd,rgba(225,241,253,0)_35%)] pb-[106px] max-[767px]:pb-[10px]"
      >
        <div className="container mx-auto px-4">
          <h1 className="max-w-[864px] mx-auto text-center">
            {texts.header.heading}
          </h1>
          <div
            className="font-[500] max-w-[656px] mx-auto text-center mt-[12px] mb-[89px] text-[#1c1c1c] max-[767px]:mb-[30px] rich-text"
            dangerouslySetInnerHTML={{ __html: texts.header.paragraph }}
          />
          <div className="flex flex-col gap-[50px] max-[767px]:gap-[20px]">
            {texts.steps.map((step: any, index: number) => (
              <VisaProcessStep key={step.id} {...step} index={index} />
            ))}
          </div>
        </div>
      </section>
      <WhyChoose />
      <ContactUsServices bg="#F8F9FD" />
      <Map />
    </>
  )
}