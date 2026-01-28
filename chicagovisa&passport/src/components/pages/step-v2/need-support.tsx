import { IMGS } from "@/lib/constants";
import { Phone } from "lucide-react";
import Image from "next/image";
import React from "react";

const NeedSupport = () => {
  return (
    <div className="flex  flex-col md:flex-row items-center border shadow-lg rounded-md overflow-hidden bg-white mt-5 text-base">
      {/* Left Image */}
      <Image
        src={IMGS.LadyGivingPassport}
        width={600}
        height={400}
        alt="lady giving passport"
        className="object-cover w-full md:w-1/2 h-full"
      />

      {/* Right Text + Phone */}
      <div className="flex flex-col justify-center items-center md:items-start p-6 w-full md:w-1/2 gap-4">
        <h2 className="font-semibold text-primary text-lg md:text-xl">
          HAVE QUESTIONS OR NEED SUPPORT?
        </h2>
        <div className="flex items-center gap-3">
          <div className="bg-light-blue text-white rounded-full p-3">
            <Phone size={20} />
          </div>
          <a
            href="tel:2024749999"
            className="font-semibold text-xl text-primary"
          >
            202-474-9999
          </a>
        </div>
      </div>
    </div>
  );
};

export default NeedSupport;
