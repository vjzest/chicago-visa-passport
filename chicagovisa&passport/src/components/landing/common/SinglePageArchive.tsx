"use client";
import ImagePassport from "@/components/landing/sections/ImagePassport";
import SelectVisaType from "./SelectVisaType";
import BgFull from "@/components/landing/sections/BgFull";
import ContactUsServices from "@/components/landing/sections/ContactUsServices";
import RequirementsAccordion from "./RequirementsAccordion";
import BtnHashLink from "./BtnHashLink";
import { useHomepageContent } from "@/hooks/use-homepage-content";

interface AccordionData {
  title: string;
  text: string;
}
interface PassportSection {
  accordions: AccordionData[];
}
interface RequirementData {
  section_title: string;
  content: {
    text?: string;
    list?: string[];
  };
}
interface PageData {
  passportSections?: PassportSection[];
  requirements?: RequirementData[];
  hero_title?: string;
  hero_description?: string;
  image?: string;
  hero_image?: string;
  country?: string;
  [key: string]: any;
}
interface SinglePageArchiveProps {
  data: PageData;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  title?: string;
  description?: string;
  image?: string;
  mode?: "visa" | "passport";
  requirementsTitle?: string;
  requirementsDescription?: string;
  serviceTypes?: any[];
  buttonText?: string;
}

export default function SinglePageArchive({
  data,
  activeIndex,
  setActiveIndex,
  title,
  description,
  image,
  mode = "visa",
  requirementsTitle,
  requirementsDescription,
  serviceTypes = [],
  buttonText,
}: SinglePageArchiveProps) {
  const content = useHomepageContent();
  const texts = content.singlePageArchiveComponent;
  const requirementsData =
    mode === "passport"
      ? (data.passportSections?.[activeIndex]?.accordions || []).map((acc) => ({
        section_title: acc.title,
        content: {
          text: acc.text,
          list: [],
        },
      }))
      : serviceTypes[activeIndex]?.requiredDocuments?.map((doc: any) => ({
        section_title: doc.title,
        content: {
          text: doc.instruction?.replace(/\n/g, "<br/>") || "",
        },
      })) || [];

  return (
    <>
      <section
        id="visa_single"
        className="bg-[linear-gradient(to_bottom,#e1f1fd,rgba(225,241,253,0)_60%)]"
      >
        <div className="container">
          <div className="visa-single-header">
            <h1 className="text-center max-w-[750px] mx-auto">
              {title || data.hero_title}
            </h1>
            <div className="font-medium max-w-[720px] mx-auto mt-[12px] mb-[25px] text-center text-[#1c1c1c] rich-text" dangerouslySetInnerHTML={{ __html: description || data.hero_description || "" }} />
            <div className="text-center">
              <BtnHashLink text={buttonText || texts.buttonText} path="#get_started" />
            </div>
            <div className="visa-single-header__img relative mt-[45px]">
              <img
                src={image || data.image || data.hero_image}
                alt={title || data.country}
                className="w-full object-cover aspect-[16/6] rounded-[30px] max-[767px]:aspect-[16/9] max-[767px]:rounded-[20px]"
              />
            </div>
          </div>
          <SelectVisaType
            activePassportIndex={activeIndex}
            setActivePassportIndex={setActiveIndex}
            title={
              mode === "passport"
                ? texts.selectTypeTitles.passport
                : texts.selectTypeTitles.visa
            }
            serviceTypes={serviceTypes}
          />
          <RequirementsAccordion
            country={
              mode === "passport" ? requirementsTitle || "" : data.country || ""
            }
            description={requirementsDescription}
            requirements={requirementsData as any}
          />
        </div>
      </section>
      <BgFull />
      <ContactUsServices />
      <ImagePassport />
    </>
  );
}