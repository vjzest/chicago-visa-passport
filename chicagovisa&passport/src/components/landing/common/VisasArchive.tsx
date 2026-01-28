"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BtnAll from "./BtnAll";
import Map from "@/components/landing/sections/Map";

const otherBg = "/landing/assets/other-bg.png";

interface VisaData {
  id: string | number;
  slug: string;
  image?: string;
  hero_image?: string;
  country: string;
}

interface VisasArchiveProps {
  title: string;
  description: string;
  data: VisaData[];
}

export default function VisasArchive({ title, description, data }: VisasArchiveProps) {
  const pathname = usePathname();

  let slug = "/visas";

  if (pathname === "/e-visas") {
    slug = "/e-visas";
  }
  return (
    <>
      <section
        id="visas-section-all"
        className="bg-gradient-to-b from-[#E1F1FD] to-[rgba(225,241,253,0)] pb-[65px] max-[767px]:pb-[50px]"
      >
        <div className="container mx-auto px-4">
          <h1 className="max-w-[748px] text-center mx-auto">{title}</h1>
          <p className="font-medium max-w-[520px] text-center mx-auto  mt-[12px] mb-[54px] text-[#1C1C1C]  max-[1024px]:mb-[45px] max-[767px]:mb-[30px]">
            {description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-[20px]">
            {data.map((visa) => (
              <Link href={`/${slug}/${visa.slug}`} key={visa.id} className="block">
                <div
                  className="
              city-col-all relative flex rounded-[20px] h-full min-h-[297px] bg-cover bg-center max-[1024px]:min-h-[200px] max-[767px]:min-h-[280px]"
                  style={{
                    backgroundImage: `url(${visa.image || visa.hero_image})`,
                  }}
                >
                  <div className="city-col-all__content mt-auto ml-[17px] mb-[20px] z-10">
                    <h3 className="text-white m-0 relative z-10">
                      {visa.country}
                    </h3>
                  </div>

                  <div className=" absolute bottom-0 left-0 w-full h-[145px] z-[1] rounded-b-[20px] bg-gradient-to-t from-black to-[rgba(0,0,0,0)]" />
                </div>
              </Link>
            ))}

            <div
              className="other-div-all col-span-1 md:col-span-2 bg-[#122241] rounded-[20px] flex flex-col justify-end items-start p-[39px_42px] bg-no-repeat bg-top bg-contain max-[1024px]:p-[30px_25px] max-[767px]:p-[30px_20px]"
              style={{ backgroundImage: `url(${otherBg})` }}
            >
              <h3
                className="text-white font-semibold text-[42px] max-w-[329px] mb-[17px] max-[1024px]:text-[32px] max-[767px]:text-[28px] max-[767px]:mb-[15px]
          "
              >
                Other Countries Visa
              </h3>
              <BtnAll
                text="Contact Us for More"
                path="/contact-us"
                className="hover:text-white"
              />
            </div>
          </div>
        </div>
      </section>

      <Map />
    </>
  );
}
