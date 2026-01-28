import { services } from "@/data/services";
import Image from "next/image";
import Link from "next/link";

const banner = () => {
  const service = services["add-passport-pages"];

  return (
    <div className="relative w-full bg-[#F2F9FF] min-h-[400px] sm:min-h-[700px] lg:min-h-[600px] overflow-hidden">
      {/* Content Container */}
      <div className="container mx-auto px-4 h-full">
        {/* Left Content */}
        <div className="relative pt-8 sm:pt-12 lg:absolute lg:top-24 lg:left-16 w-full lg:max-w-[45%]">
          <h1 className="font-grotesk text-[24px] sm:text-[30px] md:text-[40px] lg:text-[50px] font-bold leading-tight text-[#144066] text-center lg:text-left mb-4">
            {service.bannerTitle}
          </h1>
          <h2 className="font-grotesk text-[24px] sm:text-[30px] md:text-[40px] lg:text-[50px] font-bold leading-tight text-[#144066] text-center lg:text-left mb-6">
            {service.bannerSubtitle}
          </h2>
          <ul className="text-sm mb-8 space-y-4 text-[#144066] max-w-md mx-auto lg:mx-0">
            <li className="flex items-start">{service.bannerSteps1}</li>
            <li className="flex items-start">{service.bannerSteps2}</li>
          </ul>
          <div className="text-center lg:text-left">
            <Link
              href={service.bannerButton.link}
              className="inline-block bg-[#006DCC] text-white px-8 py-3 rounded-full hover:bg-[#144066] transition"
            >
              {service.bannerButton.text}
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative mt-8 lg:absolute lg:top-0 lg:right-4 w-full lg:w-1/2 h-[320px] sm:h-[400px] lg:h-[570px]">
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
