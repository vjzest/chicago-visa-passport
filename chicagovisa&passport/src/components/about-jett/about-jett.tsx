import React from "react";
import Image from "next/image";
import AboutLeftSection from "./about-left-section";

interface AboutJettProps {
  title?: string;
  learnMoreLink?: string;
}

const AboutJett: React.FC<AboutJettProps> = ({
  title = "Your Trusted, Professional, and Secure Hand-Carry Expediting Passport Service",
}) => {
  const serviceSVGs = [
    {
      src: "/assets/nmi.png",
      alt: "Nmi Seal",
      scale: "w-[250%] scale-[2.6]",
    },
    {
      src: "/assets/trusted.png",
      alt: "Trusted seal",
      scale: "w-[250%] scale-[2.6]",
    },
    {
      src: "/credit-svg/ePrivacyseal_DE_F.svg",
      alt: "ePrivacy Seal",
      scale: "w-[240%] scale-[1.8]",
    },
    {
      src: "/assets/shield.jpg",
      alt: "Visa Seal",
      scale: "w-[280%] scale-[1.2]",
    },
  ];

  return (
    <div className="w-full mt-4 sm:mt-6 lg:mt-10">
      <div className="mx-auto w-full bg-[#006DCC] px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-12 px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8">
          {/* Left section - Logo and Title */}
          <AboutLeftSection title={title} />
          {/* Right section - Main content */}
          <div className="flex-1 space-y-4 sm:space-y-6 lg:space-y-8 !font-roboto">
            {/* Main description */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6 !font-roboto">
              <p className="font-inter text-sm sm:text-base lg:text-[16px] text-white">
                We are a private business registered with U.S. Passport Agencies
                under the name Travel Center Tours, explicitly authorized by the
                U.S. Government to provide a specific Hand-Carry Expedited
                Passport Services. As an approved, authorized and registered
                commercial courier, we are explicitly permitted to offer this
                specialized service on behalf of U.S. citizens who require
                Hand-Carry Expedited Passport processing through authorized
                channels.
              </p>
              <p className="font-inter text-sm sm:text-base lg:text-[16px] text-white">
                At Chicago Passport & Visa Expedite, we recognize the need for secure, fast and
                dependable passport solutions. As a leading passport courier in
                the United States, we specialize in expedited passport
                applications for individuals, families, and businesses. Whether
                you&apos;re preparing for a last-minute trip, managing an urgent
                business assignment abroad, or requiring a quick passport
                renewal, we&apos;re here to make the process secure, seamless
                and stress-free.
              </p>
            </div>

            {/* Security message */}
            <h2 className="font-inter text-sm sm:text-base lg:text-[16px] text-white">
              Your safety and security is our top priority.
            </h2>

            {/* Service images */}
            <div
              className="flex flex-nowrap gap-2 xs:gap-3 sm:gap-4 items-center 
                overflow-x-auto scrollbar-none
                -mx-3 px-3 sm:mx-0 sm:px-0 
                py-2 sm:py-3 
                rounded-xl 
                bg-white/2"
            >
              {serviceSVGs.map((svg, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-white
                    w-[60px] xs:w-[80px] sm:w-[100px] lg:w-[120px] 
                    h-[36px] xs:h-[48px] sm:h-[60px] lg:h-[72px] 
                    rounded-xl
                    overflow-hidden
                    flex items-center justify-center
                    p-1.5 sm:p-2 lg:p-3"
                >
                  <Image
                    loading="lazy"
                    src={svg.src}
                    alt={svg.alt}
                    width={120}
                    height={100}
                    className={`object-contain max-h-[90%] h-auto ${svg.scale}`}
                    sizes="(max-width: 480px) 60px,
                           (max-width: 640px) 80px,
                           (max-width: 768px) 100px,
                           120px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutJett;
