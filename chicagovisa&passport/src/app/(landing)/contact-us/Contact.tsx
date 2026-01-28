"use client";

import ImagePassport from "@/components/landing/sections/ImagePassport";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useHomepageContent } from "@/hooks/use-homepage-content";

export default function Contact() {
  const content = useHomepageContent();
  const texts = content.contactPage;
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/contact-us") {
      const headerDiv = document.querySelector("body header > div");
      if (headerDiv) {
        headerDiv.classList.add("bg-[#F8F9FD]");
        headerDiv.classList.remove("bg-brand-light");
      }
    }

    return () => {
      const headerDiv = document.querySelector("body header > div");
      if (headerDiv) {
        headerDiv.classList.remove("bg-[#F8F9FD]");
        headerDiv.classList.add("bg-brand-light");
      }
    };
  }, [pathname]);

  return (
    <>
      <section
        id="contact"
        className="pb-[107px] bg-[#F8F9FD] max-[767px]:pb-[60px]"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <div>
              <h1>{texts.header.heading}</h1>
              <div
                className="max-w-[441px] my-[33px] max-[767px]:my-[20px] rich-text"
                dangerouslySetInnerHTML={{ __html: texts.header.paragraph }}
              />
              <ul className="flex flex-col pl-0 gap-[20px] max-[767px]:gap-[12px]">
                {texts.contactInfo.map((item: any, index: number) => (
                  <li
                    key={index}
                    className="flex items-center gap-[15px] text-[14px] list-none"
                  >
                    <img src={item.icon.src} alt={item.icon.alt} />
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-[#4E5063] hover:text-[#BE1E2D]"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="max-w-[207px] text-[#4E5063]">
                        {item.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="max-[767px]:mt-[15px]">
              <form>
                <div className="mb-[20px] max-[767px]:mb-[15px]">
                  <label
                    htmlFor="name"
                    className="text-[14px] font-[500] mb-[6px] block"
                  >
                    {texts.form.labels.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="bg-white rounded-[10px] h-[52px] text-[14px] pl-[20px] w-full border border-[#E7ECF0] shadow-none outline-none"
                  />
                </div>
                <div className="mb-[20px] max-[767px]:mb-[15px]">
                  <label
                    htmlFor="email"
                    className="text-[14px] font-[500] mb-[6px] block"
                  >
                    {texts.form.labels.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="bg-white rounded-[10px] h-[52px] text-[14px] pl-[20px] w-full border border-[#E7ECF0] shadow-none outline-none"
                  />
                </div>
                <div className="mb-[20px] max-[767px]:mb-[15px]">
                  <label
                    htmlFor="phone"
                    className="text-[14px] font-[500] mb-[6px] block"
                  >
                    {texts.form.labels.phone}
                  </label>
                  <input
                    type="text"
                    id="phone"
                    required
                    className="bg-white rounded-[10px] h-[52px] text-[14px] pl-[20px] w-full border border-[#E7ECF0] shadow-none outline-none"
                  />
                </div>
                <div className="mb-[20px] max-[767px]:mb-[15px]">
                  <label
                    htmlFor="message"
                    className="text-[14px] font-[500] mb-[6px] block"
                  >
                    {texts.form.labels.message}
                  </label>
                  <textarea
                    id="message"
                    required
                    className="bg-white rounded-[10px] h-[139px] text-[14px] pt-[20px] pl-[20px] w-full border border-[#E7ECF0] shadow-none outline-none resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="inline-block bg-[#be1e2d] border border-[#be1e2d] text-white  font-medium rounded-[10px] shadow-[0_20px_20px_rgba(0,0,0,0.25)] py-[12px] px-[31px] text-[18px] hover:bg-transparent hover:text-[#1c1c1c] max-lg:text-[16px] max-sm:text-[14px] px-[59px] transition-all duration-200 cursor-pointer"
                >
                  {texts.form.buttonText}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ImagePassport />
    </>
  );
}