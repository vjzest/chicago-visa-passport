"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IMGS, NAV_LINKS } from "@/lib/constants";
// import { TypeNavNames } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/**
 * This is header
 * @returns
 */

const Header = () => {
  const activeSection = usePathname();
  const [openNav, setOpenNav] = useState(false);
  return (
    <header
      id="header"
      className="absolute top-0 z-20 flex w-full items-center justify-around"
    >
      <div className="flex items-center gap-2">
        <Image src={IMGS?.Logo} alt="Logo" className="mt-2 md:mt-0" />
        <h1 className="text-lg  font-semibold text-primary">Chicago Passport & Visa Expedite</h1>
      </div>
      <div className="hidden items-center justify-center gap-0 md:flex md:gap-5">
        {NAV_LINKS.map((item) => (
          <Link key={item?.link} replace href={item?.link}>
            <Button
              variant={activeSection === item?.link ? "active-nav" : "ghost"}
            >
              {item?.name}
            </Button>
          </Link>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-5 md:mt-0">
        <Link href="/login">
          <Button
            className="rounded-xl bg-primary px-2 py-1"
            variant={"gooeyRight"}
          >
            Login
          </Button>
        </Link>
        <button
          onClick={() => setOpenNav(true)}
          className="text-deep-light block rounded-full p-1 md:hidden"
        >
          <i className="bx bx-menu text-[3rem]"></i>
        </button>
      </div>
      <AnimatePresence>
        {openNav && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-x-0 top-0 !z-40 flex h-fit w-full flex-col items-center justify-center gap-4 bg-primary p-20 text-white md:hidden"
          >
            <button onClick={() => setOpenNav(false)}>
              <i className="bx bx-arrow-to-top text-[3rem] text-light-gray"></i>
            </button>
            {NAV_LINKS.map((item) => (
              <Link key={item?.link} href={item?.link} replace>
                <Button
                  onClick={() => setOpenNav(false)}
                  className="text-xl"
                  variant={"ghost"}
                >
                  {item?.name}
                </Button>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
