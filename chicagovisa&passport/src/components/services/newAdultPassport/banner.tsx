import { services } from "@/data/services";
import Image from "next/image";
import Link from "next/link";
import ServiceSelect from "../service-select";

const banner = () => {
  const service = services["new-adult-passport"];

  return (
    <div className="relative md:px-4 w-full pt-8 justify-center bg-[#F2F9FF] min-h-[400px] sm:min-h-[700px] lg:min-h-[600px] overflow-hidden">
      {/* Content Container */}
      {/* Left Content */}
      <h1 className="font-grotesk w-full text-[24px] sm:text-[30px] md:text-[40px] [@media(min-width:1290px)]:text-[40px] font-bold leading-tight text-[#144066] text-center">
        {service.bannerTitle}
      </h1>
      <h2 className="font-grotesk w-full text-[24px] sm:text-[30px] md:text-[40px] [@media(min-width:1290px)]:text-[40px] font-bold leading-tight text-[#144066] text-center mb-4">
        {service.bannerSubtitle}
      </h2>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-[1290px] mx-auto">
        <div className="flex flex-col items-center lg:w-1/2">
          <ul className="leading-normal text-sm md:text-[20px] space-y-4 text-[#144066] max-w-[580px]">
            <li className="flex items-start justify-center px-6 md:px-0">
              Ready to travel but need a New Passport? Chicago Passport & Visa Expedite makes it
              simple, secure, and fast. Our fully guided process takes the
              stress out of applying—we’ll walk you through every step, help you
              avoid common mistakes, and ensure your application is submitted
              correctly the first time. With years of trusted experience and a
              commitment to personal service, we’ll get you passport-ready
              without the hassle.
            </li>
          </ul>
          <h2 className="text-[#144066] text-xl font-semibold my-6 px-4 md:px-0">
            Apply for your new passport today and get one step closer to
            takeoff!
          </h2>
          <ServiceSelect serviceTitle="New Passport" />
        </div>

        {/* Right Image */}
        <div className="relative md:mb-10 lg:w-1/2 h-[300px] sm:h-[380px] lg:h-[470px] w-full">
          <Image
            src={service.image}
            alt="Passport Renewal Service"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
      <div className="text-[#144066] px-4 md:px-10 space-y-4 mt-4 mb-6 text-lg">
        <h3 className="text-xl md:text-2xl font-semibold ">
          You can apply for a new U.S. passport if you&apos;re 16 or older and
          meet at least one of the following conditions:
        </h3>

        <ul className="list-disc ml-10 space-y-2">
          <li>You&apos;ve never been issued a U.S. Passport before.</li>
          <li>
            Your most recent U.S. Passport was issued when you were under 16.
          </li>
          <li>Your last U.S. Passport was issued over 15 years ago.</li>
        </ul>
        <div className="text-center mb-8 sm:mb-12">
          <Link
            href={service.bannerButton.link}
            className="inline-block bg-[#006DCC] text-white px-8 py-3 rounded-full hover:bg-[#144066] transition"
          >
            {service.bannerButton.text}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default banner;
