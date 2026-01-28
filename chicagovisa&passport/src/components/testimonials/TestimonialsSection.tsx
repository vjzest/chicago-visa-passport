"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Swiper as SwiperCore } from "swiper";
import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  author: string;
  // position: string;
  // company: string;
  text: string;
  rating: number;
}

interface StarRatingProps {
  rating: number;
  size?: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    author: "Terry M",
    // position: "Position",
    // company: "Company name",
    text: "Received my passport just now. You guys are great! You have a very satisfied customer here.Your streamlined process made it simple, and you did it very quickly! Your follow up and attention to detail was awesome. Thanks a bunch for all the help.",
    rating: 5,
  },
  {
    id: 2,
    author: "Georgia",
    // position: "Position",
    // company: "Company name",
    text: "I had an excellent experience with your services. In fact, my contact there even went out of her way to fill out some of the information for me when my computer would not let me input it. She was always there with a quick response to any questions I had. I would certainly use your services again and will continue to recommend you to friends and family. Thanks again for all of your assistance!",
    rating: 4.5,
  },
  {
    id: 3,
    author: "Lou R",
    // position: "Position",
    // company: "Company name",
    text: "Thank you, Chicago Passport & Visa Expedite! My experience with your company was entirely positive. The bottom line is that I received my passport in time for my business meeting without investing significant time or effort on my part. The staff at your office were courteous, helpful, and ensured the process went smoothly. I highly recommend your service to anyone needing an expedited passport",
    rating: 5,
  },
  {
    id: 4,
    author: "P Benton",
    // position: "Position",
    // company: "Company name",
    text: "GOOD JOB I have returned after Europe trip and appreciate you work in getting me my passport.",
    rating: 4.5,
  },
  {
    id: 5,
    author: "Rick",
    // position: "Position",
    // company: "Company name",
    text: "You and your company performed magnificently. I received my passport in time for my business trip and all went well. Thank you for making it possible",
    rating: 5,
  },
  {
    id: 6,
    author: "Shadi S",
    // position: "Position",
    // company: "Company name",
    text: "You guys are very professional and quick – like a jet! Appreciate the fact that you have a client portal with all the information organized in one place.",
    rating: 5,
  },
  {
    id: 7,
    author: "Maureen and Bill",
    // position: "Position",
    // company: "Company name",
    text: "We did receive our passports and were thrilled at the thorough service we received.  When we realized that our passports would expire within a week's time, we panicked!  But when we learned of your service and spoke with a representative, our fears were relieved.  Working with you, Chicago Passport & Visa Expedite, was wonderful.  You answered all my questions and walked me through the documents.The next time we travel, we will think of YOU... with a smile!",
    rating: 5,
  },
  {
    id: 8,
    author: "Ron",
    // position: "Position",
    // company: "Company name",
    text: "You came through as promised.  My Passport arrived within 4 days and I'm thrilled with the professionalism and speed of delivery your company provided.",
    rating: 4.5,
  },
  {
    id: 9,
    author: "Janice",
    // position: "Position",
    // company: "Company name",
    text: "My passport was on my desk when I returned from vacation last week and yes, I am very pleased with your services.  However, for some reason, with our new computer conversion I cannot open the attachments.Thanks for walking me through the process and it was much quicker than I expected",
    rating: 5,
  },
  {
    id: 10,
    author: "LB",
    // position: "Position",
    // company: "Company name",
    text: "Awesome service.  I signed up for the 5-7 business days service and was returned in 6 workdays from the day I Fed-Ex’d it out.  I needed it right away for an upcoming trip, as I discovered I had lost my passport, so this saved me a lot of time and waiting in line.  Highly recommended.",
    rating: 5,
  },
  {
    id: 11,
    author: "William",
    // position: "Position",
    // company: "Company name",
    text: "Thanks for a job well done with no hassles. I first questioned if it would be best to go to the U.S. Postal Service for renewal of my passport, but I know now that I chose the best way by using the fast service of Chicago Passport & Visa Expedite. It was safe and secure and best of all timely just as I had been promised.  Thanks again for the professional job.",
    rating: 4.5,
  },
  {
    id: 12,
    author: "Dr. Walsh",
    // position: "Position",
    // company: "Company name",
    text: "Thank you very much for your services. My passport has arrived appropriately in time. Your company services are perfectly great and I and my company I run will be using your services from now on.",
    rating: 5,
  },
];

const StarRating = ({ rating, size = 16 }: StarRatingProps) => {
  return (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, index) => {
        const isHalfStar = index + 0.5 === rating;
        const isFullStar = index < Math.floor(rating);

        return (
          <div key={index} className="relative bg-[#0CB685] p-1 rounded-md">
            {/* Base star (empty or full) */}
            <Star
              size={size}
              className={`${
                isFullStar ? "fill-white text-white" : "text-green-200/50"
              }`}
            />

            {/* Half star overlay */}
            {isHalfStar && (
              <div className="absolute inset-0 overflow-hidden w-[50%] p-1">
                <Star size={size} className="fill-white text-white" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
const TestimonialsSection = () => {
  const swiperRef = useRef<{ swiper: SwiperCore }>(null);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 bg-[#F5F5F5]">
      <div className="mx-auto max-w-[1440px] py-8 sm:py-10 lg:py-12">
        {/* Header */}
        <div className="max-w-2xl mb-8 sm:mb-10 text-center sm:text-left">
          <h2 className="font-grotesk text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-tight font-semibold text-gray-900 mb-3 sm:mb-4">
            Authentic Experiences,
            <br className="hidden sm:block" />
            Unmatched Results
          </h2>
          <p className="font-inter text-[#666666] text-sm sm:text-base">
            See what our clients say about us.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
            }}
            breakpoints={{
              540: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="!pb-14"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="flex h-full">
                <div className="font-inter tracking-wide bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg flex flex-col min-h-[260px] sm:min-h-[300px] lg:min-h-[390px]">
                  <div className="text-[#EE473F]">
                    <StarRating rating={testimonial.rating} size={14} />
                  </div>
                  <blockquote className="flex-grow my-3 sm:my-4">
                    <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                      &quot;{testimonial.text}&quot;
                    </p>
                  </blockquote>
                  <div className="flex items-center mt-3 sm:mt-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-400">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-gray-900 text-xs sm:text-sm font-semibold">
                        {testimonial.author}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination Dots */}
          <div className="swiper-pagination flex justify-center mt-4"></div>
        </div>

        {/* Arrow Buttons */}
        <div className="mt-6 sm:mt-8 mb-3 flex justify-center sm:justify-between gap-4 sm:gap-0">
          <button
            onClick={() => swiperRef.current?.swiper.slidePrev()}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center transition-all hover:border-gray-400 hover:shadow-sm active:scale-95"
            aria-label="Previous slide"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
            >
              <path
                d="M20 12H4m0 0l6-6m-6 6l6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => swiperRef.current?.swiper.slideNext()}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center transition-all hover:border-gray-400 hover:shadow-sm active:scale-95"
            aria-label="Next slide"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
            >
              <path
                d="M4 12h16m0 0l-6-6m6 6l-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
