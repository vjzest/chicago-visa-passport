import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterLinks {
  [key: string]: FooterSection;
}

const footerLinks: FooterLinks = {
  company: {
    title: "Company",
    links: [
      { name: "About Us", href: "/home/about" },
      { name: "Contact Us", href: "/home/contact" },
      { name: "FAQ", href: "/home/faqs" },
    ],
  },
  passportServices: {
    title: "Passport Services",
    links: [
      { name: "New Passport", href: "/home/new-adult-passport" },
      { name: "Passport Renewal", href: "/home/passport-renewal" },
      { name: "Child Passport", href: "/home/child-passport-services" },
      { name: "Name Change", href: "/home/passport-name-change" },
      { name: "Lost Passport", href: "/home/lost-stolen-passport" },
      { name: "Damaged Passport", href: "/home/damaged-passport" },
      { name: "Passport Card", href: "/home/passport-card" },
    ],
  },
  helpCenter: {
    title: "Resources",
    links: [{ name: "Blogs", href: "/home/blogs" }],
  },
};

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-nav-bg pt-12 pb-6 border-t">
      <div className="mx-auto px-6 md:px-10">
        {/* Top Section - Split Responsively */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10">
          {/* Left Side - Logo & Description */}
          <div className="w-full text-center lg:text-left">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/footer.png"
                alt="Chicago Passport & Visa Expedite"
                width={300}
                height={48}
                className="w-[200px] md:w-[250px] lg:w-[300px] h-auto object-contain mb-4"
                priority
              />
            </Link>
            <p className="text-[#144066] font-inter text-sm md:text-base font-normal leading-6 max-w-[400px] mx-auto lg:mx-0">
              Passport services shouldn&apos;t be stressful. Let us help you get
              where you need to go with ease.
            </p>
          </div>

          {/* Right Side - Footer Links */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center md:text-left">
              {Object.values(footerLinks).map((section) => (
                <div key={section.title} className="space-y-3">
                  <h3 className="text-black font-inter text-base font-semibold">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-[#144066] hover:text-blue-800 transition duration-200 text-sm md:text-[13px]"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-t-blue-600 pt-6">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4 text-center lg:text-left">
            {/* Copyright Section */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-blue-900 font-inter text-xs sm:text-sm">
                Copyright By{" "}
                <span
                  className="align-middle text-xl relative"
                  style={{ top: "0px" }}
                >
                  ©
                </span>
              </span>
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/assets/footer.png"
                  alt="Chicago Passport & Visa Expedite"
                  width={160}
                  height={28}
                  className="w-[140px] md:w-[160px] h-auto object-contain"
                  priority
                />
              </Link>
              <span className="text-blue-900 font-inter text-sm">
                2025. All rights reserved.
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-3 text-sm text-[#144066]">
              <Link
                href="/home/privacy-policy"
                className="hover:text-blue-800 transition duration-200 underline"
              >
                Privacy Policy
              </Link>
              <span className="text-[#144066] hidden md:inline">|</span>
              <Link
                href="/home/terms-conditions"
                className="hover:text-blue-800 transition duration-200 underline"
              >
                Terms & Conditions
              </Link>
              <span className="text-[#144066] hidden md:inline">|</span>
              <Link
                href="/home/refund"
                className="hover:text-blue-800 transition duration-200 underline"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
