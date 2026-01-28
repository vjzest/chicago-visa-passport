import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ENV } from "@/lib/env";

const PassportServices = () => {
  return (
    <section className="bg-[#006DCC] px-4 w-full py-14 mt-16">
      <div className="mx-auto px-2 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image Container */}
          <div className="order-1 md:order-last">
            <Card className="overflow-hidden rounded-xl shadow-xl border-none">
              {/* Mobile Image (< 640px) */}
              <div className="block sm:hidden relative aspect-[4/3]">
                <Image
                  src="/assets/home-get-your-passport-fast.webp"
                  alt="Passport application process"
                  fill
                  className="object-contain"
                  sizes="100vw"
                  loading="lazy"
                  quality={85}
                />
              </div>

              {/* Tablet Image (640px - 1024px) */}
              <div className="hidden sm:block md:hidden relative aspect-[16/9]">
                <Image
                  loading="lazy"
                  src="/assets/home-get-your-passport-fast.webp"
                  alt="Passport application process"
                  fill
                  className="object-contain"
                  sizes="90vw"
                  quality={85}
                />
              </div>

              {/* Desktop Image (> 1024px) */}
              <div className="hidden md:block relative aspect-[4/3]">
                <Image
                  loading="lazy"
                  src="/assets/home-get-your-passport-fast.webp"
                  alt="Passport application process"
                  fill
                  className="object-cover"
                  sizes="45vw"
                  quality={90}
                />
              </div>
            </Card>
          </div>

          {/* Content Container */}
          <div className="text-center md:text-left space-y-6">
            <h1 className="font-grotesk text-3xl md:text-4xl font-bold text-white leading-tight">
              Get Your Passport Fast!
            </h1>

            <p className="text-base font-inter md:text-lg text-white/90 max-w-md">
              Contact Chicago Passport & Visa Expedite today for fast and reliable passport
              services tailored to your needs.
            </p>
            <Link href={"/apply"}>
              <Button
                suppressHydrationWarning={true}
                className="mt-5 w-full px-4 py-2.5 text-sm
           sm:w-auto sm:px-5 sm:py-3 sm:text-base
           text-blue-900
          bg-white
          hover:bg-blue-900 hover:text-white
           rounded-full
         "
              >
                Start Your Application
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PassportServices;
