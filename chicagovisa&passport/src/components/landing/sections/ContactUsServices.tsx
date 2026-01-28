"use client";
import BtnAll from "@/components/landing/common/BtnAll";
import { useHomepageContent } from "@/hooks/use-homepage-content";

interface Props {
  bg?: string | null;
}

export default function ContactUsServices({ bg = null }: Props) {
  const content = useHomepageContent();
  const texts = content.contactUsServicesSection;

  return (
    <section
      id="contact_us_services"
      className={`py-[97px] max-[1024px]:py-[80px] max-[767px]:py-[50px] ${bg ? `bg-[${bg}]` : ""
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          <div>
            <div>
              <h2 className="max-w-[482px]">{texts.heading}</h2>
            </div>
          </div>
          <div>
            <div>
              <div
                className="mb-[18px] rich-text"
                dangerouslySetInnerHTML={{ __html: texts.paragraph }}
              />
              <BtnAll text={texts.button.text} path={texts.button.path} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}