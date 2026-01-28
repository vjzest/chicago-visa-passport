"use client";
import { ENV } from "@/lib/env";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

const AboutLeftSection = ({ title }: { title: string }) => {
  return (
    <div className="flex-1 flex flex-col justify-start md:justify-center -mt-2 sm:-mt-4 md:-mt-8">
      <div className="max-w-[540px] w-full">
        {/* Logo Section */}
        <div className="relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-4 sm:mb-6 lg:mb-8">
          {/* Holder SVG */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/assets/Holder.svg"
              alt="Holder background"
              width={80}
              height={80}
              className="w-full h-full"
            />
          </div>
          {/* Jett Logo with hover animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 transform -translate-y-4 hover:-translate-y-8"
              style={{
                transitionProperty: "transform",
                transitionDuration: "500ms",
                transitionTimingFunction: "ease-in-out",
                willChange: "transform",
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transitionDuration = "800ms";
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transitionDuration = "500ms";
              }}
            >
              <div className="relative">
                <Image
                  src="/assets/red.svg"
                  alt="Chicago Passport & Visa Expedite"
                  width={32}
                  height={32}
                  className="w-full h-full"
                  priority
                />
                <Image
                  src="/assets/Star.svg"
                  alt="Star logo"
                  width={8}
                  height={8}
                  className="w-[7px] xs:w-[8px] sm:w-[9px] h-[7px] xs:h-[8px] sm:h-[9px] absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4 font-grotesk">
          <h2 className="text-white/80 text-sm xs:text-base lg:text-lg">
            About Chicago Passport & Visa Expedite
          </h2>
          <h1 className="text-white text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            {title}
          </h1>
          {/* Button */}
          <div className="pt-2 sm:pt-3 lg:pt-4 font-inter">
            <Link href={"/apply"}>
              <Button
                suppressHydrationWarning={true}
                className="inline-flex items-center gap-2 bg-white text-[#006DCC] px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-[#005bb1] hover:text-white transition-colors h-auto"
              >
                Start Your Application
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutLeftSection;
