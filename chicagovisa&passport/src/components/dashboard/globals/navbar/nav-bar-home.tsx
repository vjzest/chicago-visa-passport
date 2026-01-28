"use client";
import React, { useState } from "react";
import { Menu, X, ChevronDown, ChevronUp, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../../../public/assets/jett-logo.png";
import { ENV } from "@/lib/env";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPassportDropdownOpen, setIsPassportDropdownOpen] = useState(false);
  const [desktopPassportOpen, setDesktopPassportOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    {
      href: "#",
      label: "Passport Services",
      subLinks: [
        { href: "/home/new-adult-passport", label: "New Passport" },
        { href: "/home/passport-renewal", label: "Passport Renewal" },
        { href: "/home/child-passport-services", label: "Child Passport" },
        { href: "/home/passport-name-change", label: "Name Change" },
        { href: "/home/lost-stolen-passport", label: "Lost Passport" },
        { href: "/home/damaged-passport", label: "Damaged Passport" },
        { href: "/home/passport-card", label: "Passport Card" },
      ],
    },
    { href: "/home/faqs", label: "FAQ's" },
    { href: "/home/about", label: "About" },
    { href: "/home/contact", label: "Contact Us" },
  ];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".passport-dropdown")) {
        setDesktopPassportOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className="z-50 sticky top-0 w-full bg-white font-inter">
      {/* Top Bar */}

      <div className="w-full bg-custom-yellow text-white font-inter">
        {/* Desktop Version */}
        <div className="hidden sm:flex mx-auto px-4 py-1 items-center md:justify-center lg:justify-end w-full">
          <div className="flex flex-wrap items-center justify-center md:gap-2 lg:gap-2 text-[14px]">
            <span className="font-medium whitespace-nowrap">
              Monday - Friday
            </span>
            <span className="font-medium whitespace-nowrap">
              9:00 am - 6:00 pm EST
            </span>
            <span className="mx-2 text-white">|</span>
            <span className="font-medium whitespace-nowrap">
              Saturday & Sunday
            </span>
            <span className="font-medium whitespace-nowrap">(Closed)</span>

            {/* Phone Number - Visible only on tablets (md) */}
            <div className="hidden md:flex lg:hidden items-center">
              <span className="mx-2 text-white flex-shrink-0 flex items-center">
                |
              </span>
              <a
                href="tel:2024749999"
                className="flex items-center gap-1 text-[12px] text-white hover:underline cursor-pointer"
              >
                <Phone className="w-3 h-3 text-white" />
                <span className="font-medium text-white">(202) 474-9999</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Look */}
        <div className="sm:hidden flex flex-col py-2 px-4 items-center justify-center">
          {/* First Line */}
          <div className="flex items-center gap-1 text-[12px]">
            <span className="font-medium">Monday - Friday</span>
            <span className="font-medium">9:00 am - 6:00 pm EST</span>
          </div>

          {/* Second Line - Single Line Alignment */}
          <div className="flex items-center justify-center gap-1 text-[12px] mt-1 whitespace-nowrap">
            <span className="font-medium">Saturday & Sunday</span>
            <span className="font-medium">(Closed)</span>
            <span className="mx-2 text-white flex-shrink-0 flex items-center">
              |
            </span>
            <a
              href="tel:2024749999"
              className="flex items-center gap-1 text-[12px] text-white hover:underline cursor-pointer"
            >
              <Phone className="w-3 h-3 text-white" />
              <span className="font-medium text-white">202-474-9999</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-gray-50 py-2 shadow-sm">
        <div className="mx-auto px-4 md:px-10">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center transition-transform">
              <div className="relative w-40 h-9 sm:w-52 sm:h-11 md:w-64 md:h-14">
                <Image
                  src={Logo}
                  alt="Chicago Passport & Visa Expedite Logo"
                  fill
                  className="object-contain"
                  priority={false}
                  sizes="(max-width: 768px) 160px, (max-width: 1024px) 208px, 256px"
                  quality={95}
                />
              </div>
            </Link>

            <div className="flex gap-4 md:gap-8">
              {/* Desktop Navigation */}
              <nav className="hidden xl:flex items-center space-x-8">
                {navLinks.map((link) =>
                  link.subLinks ? (
                    <div
                      className="relative passport-dropdown group"
                      key={link.href}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDesktopPassportOpen(!desktopPassportOpen);
                        }}
                        className="text-[#222222] text-[15px] font-medium flex items-center gap-1"
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            desktopPassportOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute -left-3 top-full pt-6 w-64 transition-all duration-200">
                        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                          <div className="py-2">
                            {link.subLinks.map((subLink) => (
                              <Link
                                key={subLink.href}
                                href={subLink.href}
                                className="block px-4 py-2 text-sm font-medium text-[#222222] hover:bg-gray-50"
                              >
                                {subLink.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-[#222222] text-[15px] font-medium hover:text-[#006DCC]"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>

              {/* Contact and CTA Buttons */}
              <div className="hidden xl:flex items-center space-x-4">
                <a
                  href="tel:202-474-9999"
                  className="border border-[#006DCC] bg-white hover:bg-[#144066] hover:text-white text-[#006DCC] hover:border-[#144066] rounded-full text-sm p-3 flex items-center justify-center gap-2"
                >
                  <Phone size={16} className="flex-shrink-0" />
                  202-474-9999
                </a>

                <Link
                  href={"/login"}
                  className="bg-[#006DCC] hover:bg-[#144066] text-white rounded-full text-sm p-3"
                >
                  Track Your Order
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="xl:hidden p-2 text-[#144066]"
                id="menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">
                  {isMobileMenuOpen ? "Close menu" : "Open menu"}
                </span>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`xl:hidden fixed inset-0 z-50 bg-white transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mx-auto px-4 py-2 h-full overflow-y-auto">
          {/* Header with Logo and Close Button */}
          <div className="flex justify-between items-center border-b pb-2">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src={Logo}
                alt="Chicago Passport & Visa Expedite Logo"
                width={120}
                height={40}
                className="h-15 w-auto"
                priority
              />
            </Link>
            <button
              className="p-2 text-[#222222]"
              id="cancel-button" // Fixed typo in ID
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu" // Added descriptive label for screen readers
            >
              <X size={24} aria-hidden="true" />{" "}
              {/* Hide icon from screen readers since we have aria-label */}
            </button>
          </div>

          <nav className="flex flex-col space-y-1 mt-4">
            {navLinks.map((link) => (
              <div key={link.href} className="w-full">
                {link.subLinks ? (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setIsPassportDropdownOpen(!isPassportDropdownOpen)
                      }
                      className="text-[#222222] text-base w-full text-left flex justify-between items-center px-4 py-2"
                    >
                      {link.label}
                      {isPassportDropdownOpen ? (
                        <ChevronUp size={20} className="text-[#222222]" />
                      ) : (
                        <ChevronDown size={20} className="text-[#222222]" />
                      )}
                    </button>
                    <div
                      className={`${
                        isPassportDropdownOpen
                          ? "max-h-screen opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden transition-all duration-300 ease-in-out space-y-2 mt-2`}
                    >
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                          className="block px-6 py-2 text-sm text-[#222222] hover:text-[#006DCC]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-4 py-2 text-[#222222] hover:text-[#006DCC]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="mt-8 p-4 space-y-4 border-t w-full">
              <Link
                href="tel:202-474-9999"
                className="w-full text-center border border-[#006DCC] text-[#006DCC] px-6 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-[#144066] hover:text-white hover:border-[#144066]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone size={18} />
                202-474-9999
              </Link>
              <Link
                href={"/login"}
                className="block w-full text-center text-white bg-[#006DCC] hover:bg-[#144066] rounded-full text-sm p-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Track Your Order
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
