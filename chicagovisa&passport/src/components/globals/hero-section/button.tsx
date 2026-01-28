import Link from "next/link";
import React from "react";
import { ENV } from "@/lib/env";

const Button = () => {
  const passportTypes = [
    {
      title: "New Passport",
      link: `${ENV.APPLY_URL}/apply?service-type=new-adult-passport`,
    },
    {
      title: "Passport Renewal",
      link: `${ENV.APPLY_URL}/apply?service-type=passport-renewal`,
    },
    {
      title: "Child Passport",
      link: `${ENV.APPLY_URL}/apply?service-type=child-passport`,
    },
    {
      title: "Name Change",
      link: `${ENV.APPLY_URL}/apply?service-type=passport-name-change`,
    },
    {
      title: "Lost Passport",
      link: `${ENV.APPLY_URL}/apply?service-type=lost/stolen-passport`,
    },
    {
      title: "Passport Card",
      link: `${ENV.APPLY_URL}/apply?service-type=passport-card`,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-16">
      {passportTypes.map((type) => (
        <Link key={type.title} href={type.link} className="w-full !z-10">
          <button className="w-full text-[11.5px] md:text-[12.5px] font-inter bg-[#006DCC] text-white rounded-xl transition-colors px-2 py-2.5 sm:px-4 sm:py-3 hover:bg-[#144066] flex items-center justify-between">
            <span className="text-left mr-1">{type.title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 min-w-[16px] flex-shrink-0 transition-all"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </Link>
      ))}
    </div>
  );
};

export default Button;
