"use client";

import { useState } from "react";
import { useHomepageContent } from "@/hooks/use-homepage-content";

import CornerLink from "@/components/landing/common/CornerLink";
import CornerLinkFeatured from "@/components/landing/common/CornerLinkFeatured";
import TravelTabs from "@/components/landing/common/TravelTabs";


export default function TravelService() {
  const content = useHomepageContent();
  const texts = content.travelServiceSection;

  const [activeTab, setActiveTab] = useState("passport");

  const resolveImage = (img: any) => {
    if (typeof img === "string") return img;
    return img?.src || "";
  };

  const renderVisaContent = (data: any[], type: string) => {
    if (!data || data.length === 0) return null;
    const [featured, ...rest] = data;

    const bgImage = resolveImage(
      type === "visa" ? texts.images.visaBg : texts.images.evisaBg
    );
    const bgStyle = { backgroundImage: `url(${bgImage})` };

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[00px] md:gap-[34px]">
          <div
            className={`h-full bg-no-repeat bg-[bottom_right] flex relative rounded-[20px] bg-[#f8f9fd] min-h-[410px] items-end p-[42px] max-lg:items-start max-sm:mb-[20px] max-sm:h-auto max-sm:min-h-[250px] max-sm:p-[30px_20px] max-sm:bg-[70%_auto]`}
            style={bgStyle}
          >
            <h3>{featured.country}</h3>
            <CornerLinkFeatured
              to={`/${type === "visa" ? "visas" : "e-visas"}/${featured.slug}`}
              img={resolveImage(texts.images.buttonIcon)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[34px]">
            {rest.map((item) => (
              <div
                className="relative bg-[#f8f9fd] bg-cover bg-right-bottom bg-no-repeat rounded-[20px] min-h-[114px] px-[29px] pt-[32px] pb-[16px] max-lg:px-[20px] max-lg:pt-[25px] max-lg:pb-[16px] max-sm:rounded-[10px] max-sm:min-h-[90px]"
                key={item.slug || item.country}
              >
                <h3 className="text-[16px] md:text-[22px]">{item.country}</h3>
                <div className="travel-service-single-all__link">
                  <CornerLink
                    to={`/${type === "visa" ? "visas" : "e-visas"}/${item.slug}`}
                    img={resolveImage(texts.images.buttonIcon)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section>
      <div className="container">
        <div className="text-center">
          {/* 3. All static text is now rendered from the 'texts' object. */}
          <h2 className="max-w-[630px] mx-auto">{texts.header.heading}</h2>
          <p className="max-w-[616px] mt-[16px] mb-[29px] mx-auto">
            {texts.header.subheading}
          </p>

          <TravelTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div>
          {activeTab === "passport" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[0px] md:gap-[34px]">
                <div
                  className="h-full bg-no-repeat bg-[bottom_right] flex relative rounded-[20px] bg-[#f8f9fd] min-h-[410px] items-end p-[42px] max-lg:items-start max-sm:mb-[20px] max-sm:h-auto max-sm:min-h-[250px] max-sm:p-[30px_20px] max-lg:bg-[80%_auto] max-sm:bg-[60%_auto]"
                  style={{ backgroundImage: `url(${resolveImage(texts.images.passportBg)})` }}
                >
                  <h3 className="text-[16px] md:text-[22px]">
                    {texts.passportTab.featured.title}
                  </h3>
                  <CornerLinkFeatured
                    to="/us-passport"
                    img={resolveImage(texts.images.buttonIcon)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] sm:gap-[34px]">
                  {/* The service list now comes from the JSON file */}
                  {texts.passportTab.services.map((service: any, i: number) => (
                    <div
                      className="relative bg-[#f8f9fd] bg-cover bg-right-bottom bg-no-repeat rounded-[20px] min-h-[114px] px-[29px] pt-[32px] pb-[16px] max-lg:px-[20px] max-lg:pt-[25px] max-lg:pb-[16px] max-sm:rounded-[10px] max-sm:min-h-[90px]"
                      key={i}
                    >
                      <h3>
                        {service.line1}
                        {service.line2 && ( // This cleanly handles line breaks
                          <>
                            <br className="hidden md:inline-block" />
                            {service.line2}
                          </>
                        )}
                      </h3>
                      <CornerLink
                        to={`/us-passport?activeIndex=${i + 1}`}
                        img={resolveImage(texts.images.buttonIcon)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "visa" && renderVisaContent(content.visas, "visa")}
          {activeTab === "evisa" && renderVisaContent(content.evisas, "evisa")}
        </div>
      </div>
    </section>
  );
}