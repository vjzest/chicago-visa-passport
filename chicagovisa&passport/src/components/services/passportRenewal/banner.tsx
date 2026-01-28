import { services } from "@/data/services";
import Image from "next/image";
import Link from "next/link";
import ServiceSelect from "../service-select";

const Banner = () => {
  const service = services["passport-renewal"];

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
          <ul className="leading-normal text-sm md:text-[20px] mb-8 space-y-4 text-[#144066] max-w-[580px]">
            <li className="flex items-start justify-center px-6 md:px-0">
              Don&apos;t let an expired passport hold you back—renew it quickly
              and securely with Chicago Passport & Visa Expedite. Trusted for fast, hassle-free
              service in as little as 3 days. Stay ready for travel and Real ID
              requirements.
            </li>
            <li className="flex items-start justify-center">
              {service.bannerSteps2}
            </li>
          </ul>
          <ServiceSelect serviceTitle="Passport Renewal" />
        </div>

        {/* Right Image */}
        <div className="relative lg:w-1/2 h-[300px] sm:h-[380px] lg:h-[470px] w-full">
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
        <h3 className="text-xl md:text-2xl font-semibold text-center">
          Adult U.S. Passport Renewal - Currently Valid or Expired (10-Year
          Validity, Real ID alternative)
        </h3>

        <p className="md:ml-8">
          <strong>To be eligible for renewal:</strong>
        </p>

        <ul className="list-disc ml-10 space-y-2">
          <li>
            Your most recent U.S. passport must have been valid for 10 years and
            either still be active or have expired within the past 5 years.
          </li>
          <li>
            Your physical Passport must be submitted and must be undamaged.
          </li>
          <li>
            If your name has changed, you&apos;ll need to include legal
            documentation such as a marriage certificate, divorce decree, or a
            court-issued name change order.
          </li>
          <li>
            If you were also issued a valid passport card, it must be submitted
            with your passport book.
          </li>
          <li>
            Passports issued to children under the age of 16 are only valid for
            5 years and are not eligible for renewal.
          </li>
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

export default Banner;
