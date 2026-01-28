// "use client";
import React from "react";
import Image from "next/image";
import Girl from "../../../../public/assets/home-what-if passport-is-suspended.jpg";
import { ENV } from "@/lib/env";
import Link from "next/link";

const SuspendedApplicationPage = () => {
  return (
    <section className="w-full py-11 flex items-center justify-center font-inter">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section - Modified for consistent height */}
            <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px]">
              <div className="relative w-full h-full">
                <Image
                  loading="lazy"
                  src={Girl}
                  alt="Person working on laptop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 bg-[#006DCC] p-4 lg:h-[500px] flex flex-col justify-center">
              <div className="max-w-md mx-auto">
                {/* Heading */}
                <h1 className="font-grotesk text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-white mb-4 lg:mb-6 leading-tight">
                  What if my application is suspended?
                </h1>

                {/* Content Container */}
                <div className="space-y-4 font-inter">
                  {/* Main Paragraph */}
                  <p className="font-inter text-xs sm:text-sm text-white/90 leading-relaxed">
                    We understand that a suspended application can be
                    concerning, but rest assured, we&apos;re here to help. Our
                    team is promptly notified by the Department of State if your
                    passport application is suspended or denied for any reason.
                    We will contact you to discuss the reason for the suspension
                    and take all necessary steps to resolve the issue.
                  </p>

                  {/* Highlighted Info */}
                  <p className="font-inter text-xs sm:text-sm text-white/90 leading-relaxed">
                    In most cases, we can address suspensions within{" "}
                    <span className="font-medium text-white">24 hours</span>,
                    often requiring little to no additional documentation.
                  </p>

                  <div className="pt-6">
                    <Link
                      href={"/apply"}
                      className="text-xs inline-block px-6 py-2.5 border-2 border-white text-white font-medium rounded-full hover:bg-white hover:text-[#006DCC] transition-colors duration-300"
                    >
                      Start Your Application
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuspendedApplicationPage;
