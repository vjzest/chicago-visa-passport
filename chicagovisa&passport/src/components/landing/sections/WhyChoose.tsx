"use client";

import { useState } from "react";
import { useHomepageContent } from "@/hooks/use-homepage-content";

import BtnHashLink from "@/components/landing/common/BtnHashLink";
const featureIcons = [
  {
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.154 6.12774C25.1312 5.15059 25.7601 3.91291 25.973 2.54686C26.0824 1.8427 25.8565 1.15047 25.3522 0.646728C24.8485 0.142988 24.1551 -0.0823409 23.4531 0.0270736C22.0875 0.239944 20.8493 0.868265 19.8721 1.84541L16.8501 4.86731L15.0409 4.47352C15.3497 4.00499 15.2982 3.36692 14.8865 2.95472C14.4153 2.48457 13.6499 2.48402 13.1786 2.95472L12.2648 3.8685L10.1209 3.40159L10.2704 3.25209C10.7411 2.78139 10.7406 2.01495 10.2704 1.54479C9.81591 1.08872 9.02019 1.08818 8.56302 1.54479L7.31717 2.7906L2.87978 1.82429C2.53094 1.74791 2.17072 1.85408 1.91668 2.10703L1.02346 3.00022C0.788914 3.23476 0.680579 3.55813 0.727163 3.88691C0.773747 4.2157 0.967125 4.49627 1.258 4.65715L11.6793 10.4139L6.40391 16.1857L1.04621 16.4707L0.216365 17.2999C0.0386955 17.4781 -0.0360557 17.7322 0.0164866 17.9786C0.0695707 18.2251 0.241281 18.4255 0.476368 18.5149L5.54806 20.4518L7.48563 25.5239C7.57555 25.759 7.77597 25.9312 8.02243 25.9838C8.07443 25.9946 8.12697 26 8.17843 26C8.37235 26 8.55977 25.9236 8.70115 25.7828L9.52991 24.9541L9.81483 19.596L15.5869 14.3208L21.34 24.7379C21.5004 25.0288 21.781 25.2222 22.1097 25.2688C22.4385 25.3143 22.7619 25.207 22.9965 24.9725L23.8902 24.0793C24.1432 23.8263 24.2488 23.4667 24.173 23.1168L23.2083 18.6839L24.4557 17.437C24.6838 17.2089 24.8095 16.9056 24.8095 16.5828C24.8095 16.2599 24.6838 15.9566 24.4557 15.7286C23.9845 15.2584 23.2191 15.2579 22.7478 15.7286L22.5978 15.8786L22.1314 13.7348L23.0458 12.8204C23.2738 12.5924 23.3995 12.2891 23.3995 11.9662C23.3995 11.6434 23.2738 11.3401 23.0463 11.1126C22.6482 10.7145 21.9911 10.6641 21.5274 10.9604L21.1331 9.14855L24.1551 6.12666L24.154 6.12774Z"
          fill="#1C1C1C"
        />
      </svg>
    ),
  },
  {
    icon: (
      <svg
        width="18"
        height="30"
        viewBox="0 0 18 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.80569 29.9288C6.20254 30.0984 6.66397 29.9568 6.89577 29.5907L17.4426 12.8328C17.6134 12.5616 17.6238 12.2191 17.4692 11.9393C17.3147 11.6587 17.0195 11.4844 16.6993 11.4844H9.66034L12.2782 1.09522C12.3838 0.675512 12.17 0.242035 11.7726 0.0712346C11.3778 -0.0986874 10.9135 0.0437541 10.6826 0.409379L0.135686 17.1672C-0.0351152 17.4384 -0.0454278 17.7809 0.109084 18.0607C0.263596 18.3414 0.55885 18.5156 0.879006 18.5156H7.91799L5.30014 28.9048C5.19455 29.3246 5.40825 29.758 5.80569 29.9288Z"
          fill="#1C1C1C"
        />
      </svg>
    ),
  },
  {
    icon: (
      <svg
        width="22"
        height="30"
        viewBox="0 0 22 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.5357 12.9697H5.49575V9.31117C5.49575 7.77137 6.11493 6.37052 7.11646 5.35751C8.11805 4.34155 9.49626 3.71061 11.0143 3.71061C12.5323 3.71061 13.9134 4.34161 14.9121 5.35751C15.9136 6.37052 16.5357 7.77142 16.5357 9.31117V12.9697ZM21.241 13.7396C20.9499 13.4472 20.5933 13.2215 20.1938 13.0941V9.31117C20.1938 6.74966 19.1608 4.4197 17.4973 2.7323C15.8337 1.04489 13.5395 0 11.0143 0C8.489 0 6.1948 1.04489 4.53126 2.7323C2.86771 4.4197 1.83475 6.74966 1.83475 9.31117V13.0826C1.42387 13.2099 1.05576 13.4385 0.75902 13.7396C0.291071 14.2172 0 14.8713 0 15.5948V27.3748C0 28.0984 0.291071 28.7526 0.75902 29.2301C1.2298 29.7048 1.87475 30 2.58804 30H19.412C20.1253 30 20.7702 29.7048 21.241 29.2301C21.7089 28.7526 22 28.0984 22 27.3748V15.5948C22.0001 14.8712 21.709 14.2172 21.241 13.7396ZM9.20802 18.6339C9.6674 18.1708 10.3009 17.8814 11 17.8814C11.6991 17.8814 12.3325 18.1708 12.792 18.6339C13.2514 19.0999 13.5339 19.7425 13.5339 20.4516C13.5339 21.0044 13.3627 21.5138 13.0716 21.9335C12.829 22.2809 12.5037 22.5645 12.1242 22.7555V23.948C12.1242 24.2606 11.9987 24.5472 11.7932 24.7526C11.5906 24.9581 11.311 25.0884 10.9999 25.0884C10.6917 25.0884 10.4093 24.9581 10.2067 24.7526C10.0041 24.5472 9.87565 24.2606 9.87565 23.948V22.7555C9.49898 22.5645 9.1737 22.2809 8.93113 21.9335C8.63722 21.5139 8.46602 21.0044 8.46602 20.4516C8.46613 19.7424 8.75147 19.0999 9.20802 18.6339Z"
          fill="#1C1C1C"
        />
      </svg>
    ),
  },
];

export default function WhyChoose() {
  const content = useHomepageContent();
  const texts = content.whyChooseSection;

  const features = texts.features.map((feature: any, index: number) => ({
    ...feature,
    ...featureIcons[index],
  }));

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      id="why_choose"
      className="pt-[70px] pb-[117px] max-sm:pt-[50px] max-sm:pb-[50px]"
    >
      <div className="container">
        <div className="grid gap-[20px] grid-cols-1 md:grid-cols-2">
          <div className="mb-[20px] md:mb-0">
            <h2>{texts.main.heading}</h2>
            <div className="max-w-[461px] my-[17px] rich-text" dangerouslySetInnerHTML={{ __html: texts.main.paragraph }} />
            <BtnHashLink
              text={texts.main.button.text}
              path={texts.main.button.path}
            />
          </div>

          <div>
            {features.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
                className={`cursor-pointer mb-[15px] transition-all duration-200 p-[30px] rounded-[25px] max-sm:p-[20px] max-sm:rounded-[20px] ${activeIndex === index ? "bg-[#122241]" : "bg-[#f8f9fd]"
                  }`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex justify-center items-center transition-all duration-200 w-[62px] h-[62px] max-w-[62px] flex-none rounded-[15px] ${activeIndex === index ? "bg-white/10" : "bg-[#fdfdfe]"
                      }`}
                  >
                    <div
                      className={
                        activeIndex === index ? "[&>svg>path]:fill-white" : ""
                      }
                    >
                      {item.icon}
                    </div>
                  </div>

                  <div className="flex-1 pl-[31px] max-sm:pl-[20px]">
                    <h3
                      className={`m-0 transition-all duration-200 ${activeIndex === index ? "text-white" : ""}`}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div
                  className={`transition-all duration-[800ms] ease-in-out overflow-hidden max-h-0 pl-[94px] max-md:pl-0 ${activeIndex === index ? "max-h-[1000px] pt-[15px]" : ""
                    }`}
                >
                  <div
                    className={`m-0 transition-all duration-200 rich-text ${activeIndex === index ? "text-white [&>p]:!text-white" : ""}`}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section >
  );
}