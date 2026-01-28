"use client";
import Link from "next/link";
import { useHomepageContent } from "@/hooks/use-homepage-content";
export default function PopularVisas() {
  const content = useHomepageContent();
  const texts = content.popularVisasSection;

  return (
    <section
      id="popular_visas"
      className="bg-[#122241] pt-[50px] pb-[80px] max-sm:pb-[50px]"
    >
      <div className="container text-center">
        <h2 className="text-white mb-[10px]">{texts.header.heading}</h2>
        <p className="text-white mb-[30px] md:mb-[54px]">
          {texts.header.subheading}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-[20px] md:gap-[30px]">
          {texts.visas.map((visa: any, index: number) => (
            <Link href={visa.url} key={index}>
              <div className="visa-card relative">
                <div
                  className="
      absolute bottom-0 left-0 w-full h-[145px] z-[1]
      rounded-b-[20px]
      bg-[linear-gradient(to_top,rgba(0,0,0,1),rgba(0,0,0,0))]
    "
                ></div>
                <img
                  src={visa.image?.src || visa.imageSrc}
                  alt={visa.title}
                  className="
      w-full object-cover rounded-[20px]
      aspect-[3/4]
      max-sm:aspect-[3/3]
    "
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== visa.imageSrc) {
                      target.src = visa.imageSrc;
                    }
                  }}
                />

                <div className="visa-info absolute left-[17px] bottom-[20px] z-[2]">
                  <h3 className="text-white mb-0 max-lg:text-[20px]">
                    {visa.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}