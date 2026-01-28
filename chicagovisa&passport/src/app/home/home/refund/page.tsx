import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ENV } from "@/lib/env";
import Refund from "@/components/pages/home/Refund";
export const metadata: Metadata = {
  title: "Refund - Chicago Passport & Visa Expedite",
  description: "Learn more about Chicago Passport & Visa Expedite",
};

const page = () => {
  return (
    <div>
      <div className="relative h-[50vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[#F2F9FF]"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-[40px] font-grotesk font-semibold mb-6 leading-tight text-[#144066]">
            Refund
          </h1>
          <Link
            href={"/apply"}
            suppressHydrationWarning={true}
            className="ml-5 rounded-xl w-fit bg-[#006DCC] hover:bg-[#144066] text-white px-8 py-4 transition-colors duration-300 flex items-center gap-2 group text-sm md:text-base"
          >
            Start Application
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </Link>
        </div>
      </div>
      <Refund />
    </div>
  );
};

export default page;
