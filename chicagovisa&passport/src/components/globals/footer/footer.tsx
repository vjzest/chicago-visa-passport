"use client";
import { Button } from "@/components/ui/button";
import { IMGS } from "@/lib/constants";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import mailIcon from "@public/icons/mail.svg";
import Link from "next/link";
import axiosInstance from "@/lib/config/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Footer = () => {
  const [contactDetails, setContactDetails] = useState<{
    phone: string;
    email: string;
  } | null>(null);
  const fetchContactDetails = async () => {
    try {
      const { data } = await axiosInstance.get("/common/contact-info");
      if (!data?.success) throw new Error(data?.message);
      setContactDetails(data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
  };
  useEffect(() => {
    fetchContactDetails();
  }, []);
  return (
    <div className="flex flex-col">
      <section className="mt-20 flex flex-col overflow-hidden bg-light-blue px-5 py-16 pb-20 max-md:gap-5 sm:px-20 md:flex-row">
        <div className="flex w-full flex-col gap-5 px-5 sm:px-20">
          <h2 className="text-3xl font-semibold text-white">Need Help?</h2>
          <p className="text-white">
            we are here to help you any time in 24 hours.
          </p>
          <div className="flex w-full flex-col gap-5  lg:w-3/5">
            <a href={`tel:${contactDetails?.phone}`}>
              <Button
                className="flex w-full justify-start gap-5 py-6"
                variant={"outline"}
              >
                <i className="bx bxs-phone ml-16 text-2xl" />
                <span>
                  {contactDetails?.phone || (
                    <Loader2 className="mx-auto ml-10 animate-spin" />
                  )}
                </span>
              </Button>
            </a>
            <a
              href={`mailto:${contactDetails?.email}?subject=Enquiry%20for%20passport%20application`}
            >
              <Button
                className="w-full justify-start gap-5 py-6"
                variant={"outline"}
              >
                <Image className="ml-16" src={mailIcon} alt="Mail" />
                <span>
                  {contactDetails?.email || (
                    <Loader2 className="mx-auto ml-10 animate-spin" />
                  )}
                </span>
              </Button>
            </a>
            {/* <Link
            target="_blank"
            href={"https://maps.app.goo.gl/bZ4ZPPeRXo8EKSfN7"}
          >
            <Button
              className="w-full justify-start gap-5 py-6"
              variant={"outline"}
            >
              <Image className="ml-16" src={locationIcon} alt="Location" />
              <span>+0123 4567 8910</span>
            </Button>
          </Link> */}
          </div>
        </div>
        <div className="relative flex  w-6/12 items-center max-md:mt-5 max-md:w-full">
          <div className="!z-20 mx-auto flex w-72 flex-col gap-5 rounded-lg bg-white p-10  max-md:w-11/12">
            <h3 className="text-center text-base font-semibold">
              Need Help? Contact us
            </h3>
            <div className="flex flex-col items-center justify-center">
              <Image src={IMGS?.Logo} alt="Help" />
              <span className="text-2xl font-semibold">Chicago Passport & Visa Expedite</span>
              <p className="text-center">Customer Support Specialist</p>
            </div>
            {/* <Button className="w-full">Click to chat</Button> */}
          </div>
          {/* <Image
          className="absolute bottom-[-50px] left-1/3 z-0 -translate-x-1/2"
          width={200}
          height={200}
          src={IMGS.DotsWhite}
          alt="Dots"
        /> */}
        </div>
      </section>
      <div className="border-t border-t-blue-600 p-6">
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
  );
};

export default Footer;
