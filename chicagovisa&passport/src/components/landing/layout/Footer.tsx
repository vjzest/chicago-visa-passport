"use client";
import Link from "next/link";
import Image from "next/image";
import { useHomepageContent } from "@/hooks/use-homepage-content";

const footerConfig = {
  images: {
    logo: { src: "/landing/assets/footer-logo.svg", alt: "Footer Logo" },
    smallLogo: {
      src: "/landing/assets/footer-small-logo.svg",
      alt: "Small Logo",
    },
    glow: "/landing/assets/footer-glow.png",
    social: {
      facebook: { src: "/landing/assets/facebook-icon.svg", alt: "Facebook" },
      instagram: {
        src: "/landing/assets/instagram-icon.svg",
        alt: "Instagram",
      },
    },
    contact: {
      email: { src: "/landing/assets/email-icon.svg", alt: "Email" },
      phone: { src: "/landing/assets/phone-icon.svg", alt: "Phone" },
      location: { src: "/landing/assets/location-icon.svg", alt: "Location" },
    },
  },
  socialLinks: [
    {
      key: "facebook",
      url: "https://www.facebook.com/ChicagoPassportServices",
    },
    {
      key: "instagram",
      url: "https://www.instagram.com/chicagopassportvisaservices/",
    },
  ] as const,
  quickLinks: [
    { key: "home", path: "/" },
    { key: "usPassport", path: "/us-passport" },
    { key: "visas", path: "/visas" },
    { key: "eVisas", path: "/e-visas" },
    { key: "ukEtaVisa", path: "/uk-eta-vise" },
    { key: "blog", path: "/blog" },
  ] as const,
  contactDetails: [
    { key: "email", href: "mailto:info@chicagopassport-visa.com" },
    { key: "phone", href: "tel:(312) 925-3278" },
    // ERROR FIXED HERE by adding 'href: undefined'
    { key: "location", href: undefined },
  ] as const,
  legalLinks: [
    { key: "privacy", path: "/terms/privacy-policy" },
    { key: "terms", path: "/terms/terms-conditions" },
    { key: "refund", path: "/terms/refund-policy" },
  ] as const,
};

export default function Footer() {
  const content = useHomepageContent();
  const texts = content.footerSection;
  const config = footerConfig;

  return (
    <footer className="overflow-hidden bg-[#122241] relative pt-[64px] pb-[50px] rounded-t-[100px] max-lg:rounded-t-[50px] max-sm:rounded-t-[30px]">
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-full h-full bg-no-repeat bg-bottom bg-contain opacity-50"
        style={{ backgroundImage: `url(${config.images.glow})` }}
      ></div>
      <div className="container relative z-[9]">
        <div className="grid grid-cols-12 gap-[20px]">
          {/* About */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <div>
              <Link href="/">
                <Image
                  src={config.images.logo.src}
                  alt={config.images.logo.alt}
                  width={172}
                  height={60}
                />
              </Link>
              <div
                className="text-white opacity-80 mt-[20px] mb-[30px] leading-relaxed rich-text"
                dangerouslySetInnerHTML={{ __html: texts.about.description }}
              />
              <div className="flex items-center gap-[20px]">
                {config.socialLinks.map((social: any) => (
                  <a
                    key={social.key}
                    href={social.url}
                    target="_blank"
                    className="w-[48px] h-[48px] rounded-full border border-[#182a4d] flex justify-center items-center hover:bg-[#be1e2d] hover:border-[#be1e2d] transition-all duration-300"
                  >
                    <Image
                      src={config.images.social[social.key as keyof typeof config.images.social].src}
                      alt={config.images.social[social.key as keyof typeof config.images.social].alt}
                      width={24}
                      height={24}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <h4 className="text-white text-[20px] font-semibold">{texts.workingHours.title}</h4>
            <div className="bg-[#be1e2d] h-[3px] w-[42px] my-[15px]"></div>
            <div className="flex flex-col gap-[24px]">
              {texts.workingHours.hours.map((line: any, index: number) => (
                <p key={index} className="text-white text-[14px]">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-12 md:col-span-4 lg:col-span-2">
            <h4 className="text-white text-[20px] font-semibold">{texts.quickLinks.title}</h4>
            <div className="bg-[#be1e2d] h-[3px] w-[42px] my-[15px]"></div>
            <div className="flex flex-col gap-[24px]">
              {config.quickLinks.map((link: any) => (
                <Link
                  key={link.key}
                  className="text-white opacity-80 hover:text-[#be1e2d] transition-all duration-300"
                  href={link.path}
                >
                  {texts.quickLinks[link.key as keyof typeof texts.quickLinks]}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-12 md:col-span-8 lg:col-span-4">
            <h4 className="text-white text-[20px] font-semibold">{texts.contact.title}</h4>
            <div className="bg-[#be1e2d] h-[3px] w-[42px] my-[15px]"></div>
            <div className="flex flex-col gap-[20px]">
              {config.contactDetails.map((detail: any) =>
                detail.href ? (
                  <a key={detail.key} href={detail.href} className="border border-[#182a4d] rounded-[10px] flex items-center p-[15px] hover:border-[#be1e2d] transition-all duration-300 group">
                    <Image
                      src={config.images.contact[detail.key as keyof typeof config.images.contact].src}
                      alt={config.images.contact[detail.key as keyof typeof config.images.contact].alt}
                      width={19}
                      height={19}
                    />
                    <div className="h-[32px] w-[1px] bg-[#182a4d] mx-[12px]"></div>
                    <p className="text-white text-[14px] leading-tight">
                      {texts.contact[detail.key as keyof typeof texts.contact]}
                    </p>
                  </a>
                ) : (
                  <div key={detail.key} className="border border-[#182a4d] rounded-[10px] flex items-center p-[15px]">
                    <Image
                      src={config.images.contact[detail.key as keyof typeof config.images.contact].src}
                      alt={config.images.contact[detail.key as keyof typeof config.images.contact].alt}
                      width={19}
                      height={19}
                    />
                    <div className="h-[32px] w-[1px] bg-[#182a4d] mx-[12px]"></div>
                    <p className="text-white text-[14px] leading-tight">
                      {texts.contact[detail.key as keyof typeof texts.contact]}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="h-[1px] bg-[#182a4d] my-[36px]"></div>
        <div className="flex items-center justify-between flex-wrap gap-[20px]">
          <p className="text-white opacity-60 text-[14px]">
            {texts.bottomBar.copyright.split("©")[0]}©
            <Image
              src={config.images.smallLogo.src}
              alt={config.images.smallLogo.alt}
              className="inline-block w-[20px] mx-[5px]"
              width={55}
              height={60}
            />
            {texts.bottomBar.copyright.split("©")[1]}
          </p>
          <div className="flex items-center gap-[20px]">
            {config.legalLinks.map((link: any) => (
              <Link key={link.key} href={link.path} className="text-white opacity-60 hover:opacity-100 transition-all text-[14px]">
                {texts.bottomBar[link.key as keyof typeof texts.bottomBar]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}