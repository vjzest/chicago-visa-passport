

import { services } from "@/data/services";
import Image from "next/image";
import Link from "next/link";

const banner = () => {
  const service = services["child-passport-services"];

  return (
    <div className="relative w-full bg-[#F2F9FF] min-h-[400px] sm:min-h-[700px] lg:min-h-[600px] overflow-hidden">
      {/* Content Container */}
      <div className="container mx-auto px-4 h-full flex flex-col items-center [@media(min-width:1290px)]:block">
        {/* Left Content */}
        <div className="relative pt-8 sm:pt-12 [@media(min-width:1290px)]:absolute [@media(min-width:1290px)]:top-24 [@media(min-width:1290px)]:left-16 w-full [@media(min-width:1290px)]:max-w-[45%] flex flex-col items-center [@media(min-width:1290px)]:items-start">
          <h1 className="font-grotesk text-[24px] sm:text-[30px] md:text-[40px] [@media(min-width:1290px)]:text-[50px] font-bold leading-tight text-[#144066] text-center [@media(min-width:1290px)]:text-left mb-1">
            {service.bannerTitle}
          </h1>
          <h2 className="font-grotesk text-[24px] sm:text-[30px] md:text-[40px] [@media(min-width:1290px)]:text-[50px] font-bold leading-tight text-[#144066] text-center [@media(min-width:1290px)]:text-left mb-6">
            {service.bannerSubtitle}
          </h2>
          <ul className="leading-normal text-sm md:text-[1.25rem] mb-8 space-y-4 text-[#144066] max-w-[580px] mx-auto [@media(min-width:1290px)]:mx-0">
            <li className="flex items-start justify-center [@media(min-width:1290px)]:justify-start">
              {service.bannerSteps1}
            </li>
            <li className="flex items-start justify-center [@media(min-width:1290px)]:justify-start">
              {service.bannerSteps2}
            </li>
          </ul>
          <div className="text-center mb-8 sm:mb-12 [@media(min-width:1290px)]:mb-0">
            <Link
              href={service.bannerButton.link}
              className="inline-block bg-[#006DCC] text-white px-8 py-3 rounded-full hover:bg-[#144066] transition"
            >
              {service.bannerButton.text}
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative mt-2 [@media(min-width:1290px)]:absolute [@media(min-width:1290px)]:top-0 [@media(min-width:1290px)]:right-3 w-full [@media(min-width:1290px)]:w-1/2 h-[320px] sm:h-[400px] [@media(min-width:1290px)]:h-[600px]">
          <Image
            src={service.image}
            alt="Passport Renewal Service"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default banner;