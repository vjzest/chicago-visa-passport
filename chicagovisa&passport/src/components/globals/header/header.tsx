"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IMGS } from "@/lib/constants"; // Assuming IMGS contains the logo paths
import { Clock, Loader, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import useCheckToken from "@/hooks/use-check-token";
import useFetchStoreData from "@/hooks/use-fetch-store-data";
import axiosInstance from "@/lib/config/axios";
const logo = "/landing/assets/logo.svg";
const Header = () => {
  useFetchStoreData();
  const activeSection = usePathname();
  const { isLoggedIn } = useCheckToken([activeSection]);
  const [contactDetails, setContactDetails] = useState({
    phone: "",
    email: "",
  });
  const pathname = usePathname();
  const fetchContactInfo = async () => {
    try {
      const { data } = await axiosInstance.get("/common/contact-info");
      setContactDetails(data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchContactInfo();
  }, []);
  return (
    <header className="sticky h-fit top-0 z-20 grid w-full grid-cols-4 items-center justify-between border-b-4 border-light-blue bg-white px-4 pb-2 shadow md:pl-10">
      {/* Left Logo Section */}

      {/* Center Description Section */}
      <div className="col-span-1 flex flex-col items-start text-center h-fit text-gray-800">
        <Link
          href={"/"}
          className="flex items-center text-2xl font-extrabold text-primary/90 "
        >
          <Image
            height={100}
            width={100}
            alt="logo"
            className="block h-fit max-h-16 max-w-16 size-16 md:hidden"
            src={logo}
          />
          <Image
            height={200}
            width={200}
            alt="logo"
            className="md:-ml-4 hidden max-h-16 h-fit w-[17rem] md:block"
            src={logo}
          />
          {/* Chicago Visa */}
        </Link>
        {/* <span className="hidden text-sm font-semibold text-blue-900 md:block">
          SECURE ONLINE VISA EXPEDITING SYSTEM
        </span> */}
      </div>

      <div className="col-span-3 flex flex-col gap-3">
        {/* Top info mini bar */}
        <div className="hidden md:flex justify-between items-center w-full text-white bg-deep-blue px-6 py-1 rounded-b-md">
          <div className="flex-col items-center  font-medium flex">
            <p>
              Private U.S. Based Company Registered With The Department Of State
              To Expedite Visa
            </p>
          </div>
          <div className="mt-1 hidden items-center space-x-2 md:flex">
            <div>
              <Clock size={"1.2rem"} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-center text-base font-semibold">
                9:00 AM to 6:00 PM EST{" "}
              </span>
              <span className="font-medium text-slate-200">
                Monday - Friday
              </span>
            </div>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="grid grid-cols-3 col-span-3 w-full">
          <div className="col-span-2 flex justify-center items-center gap-2">
            <div className=" text-light-blue">
              <Phone size={"1.5rem"} />
            </div>
            <a href={`tel:${contactDetails?.phone}`}>
              <span className="text-xl font-semibold text-slate-700">
                {contactDetails?.phone || <Loader className="animate-spin" />}
              </span>
            </a>
          </div>
          {pathname.includes("/login") ? (
            <>
              <div className={"flex justify-end items-center gap-2"}>
                <span className="hidden text-base text-slate-500 md:block">
                  {" "}
                  Don&#39;t have an account?
                </span>

                <Link href="/apply">
                  <Button variant="gooeyRight">Apply</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className={"flex justify-end items-center gap-2"}>
                {!isLoggedIn && (
                  <span className="hidden text-base text-slate-500 md:block">
                    {" "}
                    Already a client?
                  </span>
                )}
                {!isLoggedIn ? (
                  <Link href={pathname.includes("us-passport") ? "/us-passport/login" : "/login"}>
                    <Button size={"sm"} variant="gooeyRight">
                      Login
                    </Button>
                  </Link>
                ) : (
                  <Link href={pathname.includes("us-passport") ? "/us-passport/dashboard" : "/dashboard/my-applications"}>
                    <Button variant="gooeyRight">Client Portal</Button>
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
