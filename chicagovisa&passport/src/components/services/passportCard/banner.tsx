import { services } from "@/data/services";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const banner = () => {
  const service = services["passport-card"];

  return (
    <div className="relative w-full bg-[#F2F9FF] min-h-[400px] sm:min-h-[700px] lg:min-h-[600px] overflow-hidden">
      {/* Content Container */}
      <div className="container mx-auto px-4 h-full flex flex-col items-center [@media(min-width:1290px)]:block">
        {/* Left Content */}
        <div className="relative px-4 md:px-0 pt-12 md:pt-0 [@media(min-width:1290px)]:absolute [@media(min-width:1290px)]:top-12 [@media(min-width:1290px)]:left-16 w-full [@media(min-width:1290px)]:max-w-[45%] flex flex-col items-center [@media(min-width:1290px)]:items-start">
          <h1 className="font-grotesk text-[24px] sm:text-[30px] md:text-[40px] [@media(min-width:1290px)]:text-[50px] font-bold leading-tight text-[#144066] text-center [@media(min-width:1290px)]:text-left mb-1">
            {service.bannerTitle}
          </h1>
          <h2 className="font-grotesk text-[24px] sm:text-[30px] md:text-[40px] [@media(min-width:1290px)]:text-[50px] font-bold leading-tight text-[#144066] text-center [@media(min-width:1290px)]:text-left mb-6">
            {service.bannerSubtitle}
          </h2>
          <ul className="leading-normal text-sm md:text-[20px] mb-8 space-y-4 text-[#144066] max-w-[580px] mx-auto [@media(min-width:1290px)]:mx-0">
            <div className="space-y-6 text-[1.05rem]">
              <p>
                The Passport Card is valid for the same length of time as the
                Passport Book and offers a more affordable alternative. It can
                be used for{" "}
                <span className="font-semibold">land and sea travel</span>{" "}
                between the{" "}
                <span className="font-semibold">
                  U.S., Canada, Mexico, and the Caribbean
                </span>
                . While it is{" "}
                <span className="font-semibold">
                  not valid for international air travel
                </span>
                , it{" "}
                <span className="font-semibold">
                  can be used for domestic air travel as a Real ID-compliant
                  form of identification
                </span>
                .
              </p>

              <div className="space-y-2 flex flex-col">
                <div className="flex items-start gap-2">
                  <div className="flex flex-shrink-0">
                    <Check className="text-green-600 mt-1" size={20} />
                  </div>
                  <span>
                    <span className="font-semibold">Valid for 10 years</span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex flex-shrink-0">
                    <Check className="text-green-600 mt-1" size={20} />
                  </div>{" "}
                  <span>
                    <span className="font-semibold">DOMESTIC FLIGHTS</span> –
                    Can be used in place of{" "}
                    <span className="font-semibold">Real ID</span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex flex-shrink-0">
                    <Check className="text-green-600 mt-1" size={20} />
                  </div>
                  <span>
                    Accepted for travel to and from{" "}
                    <span className="font-semibold">the U.S.</span> by land or
                    sea from{" "}
                    <span className="font-semibold">
                      Canada, Mexico, Bermuda, and the Caribbean
                    </span>
                  </span>
                </div>
              </div>
            </div>
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
