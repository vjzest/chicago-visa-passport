import React from "react";
import Privacy from "@/components/pages/home/Privacy";
import type { Metadata } from "next";
import Link from "next/link";
import { ENV } from "@/lib/env";

export const metadata: Metadata = {
  title: "Privacy Policy - Chicago Passport & Visa Expedite",
  description: "Learn more about Chicago Passport & Visa Expedite",
};

const page = () => {
  return (
    <div>
      <div className="relative h-[50vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[#F2F9FF]"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-[40px] font-grotesk font-semibold mb-6 leading-tight text-[#144066]">
            Privacy Policy
          </h1>
          <Link
            href={"/apply"}
            suppressHydrationWarning={true}
            className="ml-5 rounded-lg w-fit bg-[#006DCC] hover:bg-[#144066] text-white px-8 py-4 transition-colors duration-300 flex items-center gap-2 group text-sm md:text-base rounded-xl"
          >
            Start Application
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </Link>
        </div>
      </div>
      <Privacy />
    </div>
  );
};

export default page;
