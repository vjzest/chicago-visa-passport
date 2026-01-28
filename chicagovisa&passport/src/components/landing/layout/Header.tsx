"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { generalFetchApi } from "@/lib/endpoints/endpoint";
import { getCountryName } from "@/data/countries";
import { useCaseStore } from "@/store/use-case-store";
import { useHomepageContent } from "@/hooks/use-homepage-content";
import useFetchStoreData from "@/hooks/use-fetch-store-data";

interface ToCountryOption {
  toCountryCode: string;
  toCountryName: string;
}

const NAV_LINK_CLASSES = "text-[14px] md:text-[14px] lg:text-[15px] xl:text-[16px] flex items-center gap-[4px] transition-all hover:opacity-70";

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    className={`w-[12px] h-[12px] ml-[6px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
      clipRule="evenodd"
    />
  </svg>
);

const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const eraseCookie = (name: string) => {
  document.cookie = name + "=; Max-Age=0; path=/;";
};

export default function Header({ initialToCountries = [] }: { initialToCountries?: ToCountryOption[] }) {
  useFetchStoreData();
  const content = useHomepageContent();
  const texts = content.headerSection;
  const { generalFormData, setGeneralFormData } = useCaseStore();
  const [isActive, setIsActive] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const [visasOpen, setVisasOpen] = useState(false);
  const [eVisasOpen, setEVisasOpen] = useState(false);
  const [toCountries, setToCountries] = useState<ToCountryOption[]>(initialToCountries);

  const isMobile = () => typeof window !== "undefined" && window.innerWidth < 1024;

  useEffect(() => {
    // Only fetch if initial list is empty
    if (toCountries.length > 0) return;

    const fetchToCountries = async () => {
      try {
        const response = await generalFetchApi.getEnabledToCountries("US");
        if (response?.success && response?.data) {
          setToCountries(response.data);
        }
      } catch (error) {
        console.error("Error fetching to countries:", error);
      }
    };
    fetchToCountries();
  }, []);

  useEffect(() => {
    const match = document.cookie.match(/googtrans=([^;]+)/);
    if (match && match[1].includes("/es")) {
      setCurrentLang("ES");
    }
  }, []);

  const handleMenu = () => {
    setIsActive((prev) => !prev);
  };

  const closeMenu = () => {
    setIsActive(false);
    setVisasOpen(false);
    setEVisasOpen(false);
  };

  const toggleLanguage = () => {
    if (currentLang === "EN") {
      setCookie("googtrans", "/en/es", 1);
      setCurrentLang("ES");
    } else {
      eraseCookie("googtrans");
      setCurrentLang("EN");
    }
    window.location.reload();
  };

  useEffect(() => {
    const body = document.body;
    if (isActive && window.innerWidth < 1024) {
      body.classList.add("active");
    } else {
      body.classList.remove("active");
    }
    const handleResize = () => {
      if (isActive && window.innerWidth < 1024) {
        body.classList.add("active");
      } else {
        body.classList.remove("active");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      body.classList.remove("active");
    };
  }, [isActive]);

  return (
    <header className="bg-[#E1F1FD]">
      <div className="bg-brand-light pb-[40px] lg:pb-[50px]">
        <div className="bg-primary">
          <div className="container">
            <div className="hidden lg:grid items-center justify-between grid-cols-2">
              <p className="py-[18px] text-[14px] text-white">
                {texts.topBar.announcement}
              </p>
              <div className="flex justify-end gap-[30px]">
                <a
                  href={texts.topBar.contact.phone.href}
                  className="text-[14px] text-white flex gap-[8px] items-center hover:opacity-[0.7]"
                >
                  <Image src={texts.topBar.contact.phone.icon.src} alt={texts.topBar.contact.phone.icon.alt} width={18} height={18} />
                  {texts.topBar.contact.phone.text}
                </a>
                <a
                  href={texts.topBar.contact.email.href}
                  className="text-[14px] text-white flex gap-[8px] items-center hover:opacity-[0.7]"
                >
                  <Image src={texts.topBar.contact.email.icon.src} alt={texts.topBar.contact.email.icon.alt} width={19} height={14} />
                  {texts.topBar.contact.email.text}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="flex items-center gap-[10px] pt-[20px]">
            <div className="max-w-[auto] lg:max-w-[126px]">
              <Link href="/">
                <Image src={texts.mainNav.logo.src} alt={texts.mainNav.logo.alt} className="w-[120px] md:w-auto" width={126} height={44} />
              </Link>
            </div>

            <div className="flex-1">
              <div
                className={`flex items-center gap-[20px] lg:gap-[30px] justify-start lg:justify-center fixed lg:static top-[85px] left-[0] bg-brand-light lg:bg-transparent w-full h-[calc(100vh-85px)] lg:h-auto z-50 flex-col lg:flex-row transition-all duration-200 border-t border-[rgba(18,34,65,0.1)] lg:border-none items-start pl-[20px] lg:pl-0 pt-[30px] lg:pt-0 ${isActive ? "opacity-100 pointer-events-auto" : "opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto"
                  }`}
              >
                <Link onClick={closeMenu} href="/us-passport" className={NAV_LINK_CLASSES}>
                  {texts.mainNav.links.usPassport}
                </Link>

                <div className="relative w-full lg:w-auto" onMouseEnter={() => !isMobile() && setVisasOpen(true)} onMouseLeave={() => !isMobile() && setVisasOpen(false)}>
                  <Link href="/visas" className={NAV_LINK_CLASSES} onClick={(e) => { if (isMobile()) { if (!visasOpen) { e.preventDefault(); setVisasOpen(true); setEVisasOpen(false); } else { closeMenu(); } } else { closeMenu(); } }}>
                    {texts.mainNav.links.visas}
                    <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVisasOpen((p) => !p); setEVisasOpen(false); }}>
                      <Chevron open={visasOpen} />
                    </span>
                  </Link>
                  <div className={`lg:absolute mt-[5px] md:mt-[0px] bg-white rounded-xl shadow-lg w-[calc(100%-20px)] lg:min-w-[220px] lg:w-auto overflow-hidden transition-all duration-300 py-[0px] lg:py-[7px] ${visasOpen ? "opacity-100 pointer-events-auto max-h-[500px]" : "opacity-0 pointer-events-none max-h-0"} lg:max-h-none`}>
                    {toCountries.map((country) => (
                      <Link key={country.toCountryCode} href={`/visas/${getCountryName(country.toCountryCode)?.toLowerCase()}`} onClick={() => { closeMenu(); setGeneralFormData({ ...generalFormData, citizenOf: "US", residingIn: generalFormData?.residingIn || "IL", travelingTo: country.toCountryCode, }); }} className="block px-4 py-2 text-[14px] hover:bg-gray-100">
                        {country.toCountryName}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="relative w-full lg:w-auto" onMouseEnter={() => !isMobile() && setEVisasOpen(true)} onMouseLeave={() => !isMobile() && setEVisasOpen(false)}>
                  <Link href="/e-visas" className={NAV_LINK_CLASSES} onClick={(e) => { if (isMobile()) { if (!eVisasOpen) { e.preventDefault(); setEVisasOpen(true); setVisasOpen(false); } else { closeMenu(); } } else { closeMenu(); } }}>
                    {texts.mainNav.links.eVisas}
                    <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEVisasOpen((p) => !p); setVisasOpen(false); }}>
                      <Chevron open={eVisasOpen} />
                    </span>
                  </Link>
                  <div className={`lg:absolute mt-[5px] md:mt-[0px] bg-white rounded-xl shadow-lg w-[calc(100%-20px)] lg:min-w-[220px] lg:w-auto overflow-hidden transition-all duration-300 py-[0px] lg:py-[7px] ${eVisasOpen ? "opacity-100 pointer-events-auto max-h-[500px]" : "opacity-0 pointer-events-none max-h-0"} lg:max-h-none`}>
                    {toCountries.map((country) => (
                      <Link key={country.toCountryCode} href={`/e-visas/${getCountryName(country.toCountryCode)?.toLowerCase()}-evisa`} onClick={() => { closeMenu(); setGeneralFormData({ ...generalFormData, citizenOf: "US", residingIn: generalFormData?.residingIn || "IL", travelingTo: country.toCountryCode, }); }} className="block px-4 py-2 text-[14px] hover:bg-gray-100">
                        {country.toCountryName}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link onClick={closeMenu} href="/uk-eta-vise" className={NAV_LINK_CLASSES}>
                  {texts.mainNav.links.ukEtaVisa}
                </Link>
                <Link onClick={closeMenu} href="/visa-process" className={NAV_LINK_CLASSES}>
                  {texts.mainNav.links.process}
                </Link>
                <Link onClick={closeMenu} href="/contact-us" className={NAV_LINK_CLASSES}>
                  {texts.mainNav.links.contact}
                </Link>
              </div>

              <div onClick={handleMenu} className="flex lg:hidden flex-col gap-[5px] items-end">
                <span className={`bg-[#1C1C1C] w-[30px] h-[1px] transition-all duration-200 ${isActive ? "rotate-45" : ""}`} />
                <span className={`bg-[#1C1C1C] w-[30px] h-[1px] transition-all duration-200 ${isActive ? "-rotate-45 -mt-[6px]" : ""}`} />
              </div>
            </div>

            <div className="max-w-[auto] lg:max-w-[126px] flex items-center gap-[5px] lg:gap-[10px] justify-end lg:justify-start">
              <div className="w-[45px] h-[45px] lg:w-[52px] lg:h-[52px] flex justify-center items-center border border-[#D0DDEA] rounded-full hover:opacity-70 cursor-pointer">
                <Image src={texts.mainNav.accountIcon.src} alt={texts.mainNav.accountIcon.alt} className="w-[20px] lg:w-[auto]" width={23} height={23} />
              </div>
              <button className="w-[45px] h-[45px] lg:w-[52px] lg:h-[52px] flex justify-center items-center border border-[#D0DDEA] rounded-full cursor-pointer hover:opacity-70" onClick={toggleLanguage}>
                {currentLang}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}