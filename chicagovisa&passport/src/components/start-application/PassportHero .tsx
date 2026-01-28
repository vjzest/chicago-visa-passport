"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PassportHeroProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  trustBadgeText?: string;
  onStartApplication?: () => void;
}

export const PassportHero: React.FC<PassportHeroProps> = ({
  title = "Get Your U.S. Passport In As ",
  subtitle = " Little As 3 Days",
  buttonText = "Get Started",
  onStartApplication,
}) => {
  const router = useRouter();

  const handleStartApplication = () => {
    if (onStartApplication) {
      onStartApplication();
    } else {
      router.push("/application/start");
    }
  };

  return (
    <div className="mx-auto w-full font-grotesk">
      <div className="relative min-h-[200px] w-full overflow-hidden border border-blue-200/20 bg-blue-900">
        {/* Background Images */}
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <Image
              src="/assets/home-get-your-passport.jpg"
              alt="Woman with passport card"
              fill
              className="object-cover w-full h-full opacity-90"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
              priority
            />
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-500/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-[200px] sm:min-h-[240px] md:min-h-[280px]">
          <div className="flex w-full flex-col justify-center p-4 sm:p-6 md:p-8 mx-auto max-w-7xl">
            <div className="w-full md:max-w-[80%] lg:max-w-[60%]">
              <h1 className="font-grotesk text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold leading-tight text-white">
                {title}
                <span className="block mt-1 sm:mt-2">{subtitle}</span>
              </h1>

              <div className="mt-4 sm:mt-5 md:mt-6 font-inter">
                <Button
                suppressHydrationWarning={true}
                  className="group bg-white hover:bg-blue-900 flex items-center gap-2 rounded-full 
                    px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base 
                    font-medium text-blue-800 border border-white 
                    hover:text-white transition-colors duration-300"
                  onClick={handleStartApplication}
                >
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Card-like border shine */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
      </div>
    </div>
  );
};
