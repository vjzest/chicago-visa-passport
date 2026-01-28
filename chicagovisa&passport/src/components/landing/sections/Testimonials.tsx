"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


import { useHomepageContent } from "@/hooks/use-homepage-content";



export default function TestimonialsSlider() {
  const content = useHomepageContent();
  const texts = content.testimonialsSection;

  return (
    <section
      id="testimonials_section"
      className="py-[61px] pb-[40px] overflow-hidden max-sm:py-[50px]"
    >
      <h2 className="max-w-[722px] mx-auto text-center max-sm:mx-[20px]">
        {/* 3. Render the heading from the JSON file. */}
        {texts.header.headingLines[0]} <br />
        {texts.header.headingLines[1]} <br />
        {texts.header.headingLines[2]}
      </h2>

      <div className="swiper-custom-wrapper mx-[-200px] max-sm:mx-0 max-sm:px-[20px]">
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={30}
          slidesPerView={5}
          loop={true}
          centeredSlides={true}
          speed={700}
          pagination={{ clickable: true }}
          onBeforeInit={(swiper) => {
            if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
              swiper.params.navigation.prevEl = document.querySelector(".swiper-button-prev-custom") as HTMLElement;
              swiper.params.navigation.nextEl = document.querySelector(".swiper-button-next-custom") as HTMLElement;
            }
          }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1200: { slidesPerView: 5, spaceBetween: 40 },
          }}
        >
          {/* 4. Map over the 'reviews' array from our JSON content. */}
          {texts.reviews.map((item: any, index: number) => (
            <SwiperSlide
              key={index}
              className="py-[50px] max-sm:py-[40px] max-sm:pb-[30px]"
            >
              <div
                className="testimonials-card bg-white rounded-[10px] p-[28px] px-[22px] transition-all duration-200 swiper-slide-active:shadow-[0_20px_40px_rgba(0,0,0,0.15)] max-sm:swiper-slide-active:shadow-[0_10px_25px_rgba(0,0,0,0.15)]"
              >
                <div className="stars">
                  {/* 5. Image 'src' and 'alt' are now sourced from the JSON file. */}
                  <img
                    src={
                      item.stars === 4
                        ? texts.images.stars4.src
                        : texts.images.stars5.src
                    }
                    alt={
                      item.stars === 4
                        ? texts.images.stars4.alt
                        : texts.images.stars5.alt
                    }
                  />
                </div>
                <p className="italic my-[20px]">{item.text}</p>
                <div className="border-t border-[#d3d3e5] pt-[20px] flex items-center">
                  <div className="flex-1">
                    <h5 className="text-[16px] mb-[2px]">{item.name}</h5>
                    <span className="text-[14px] text-[#4e5063]"></span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="slider-nav flex justify-center gap-[12px] mt-[10px]">
        {/* The SVG icons for navigation remain in the component as they are part of the structure. */}
        <button className="cursor-pointer swiper-button-prev-custom w-[60px] h-[60px] rounded-full flex items-center justify-center bg-transparent border-none transition-all duration-200 hover:bg-[#122241] [&:hover_svg_path]:fill-white">
          <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
            <path d="M1.05429 4.16733...Z" fill="black" />
          </svg>
        </button>
        <button className="cursor-pointer swiper-button-next-custom w-[60px] h-[60px] rounded-full flex items-center justify-center bg-transparent border-none transition-all duration-200 hover:bg-[#122241] [&:hover_svg_path]:fill-white">
          <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
            <path d="M13.5746 4.97134...Z" fill="black" />
          </svg>
        </button>
      </div>
    </section>
  );
}