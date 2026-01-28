"use client";
import { IMGS } from "@/lib/constants";
import Image from "next/image";
import React, { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);
  return (
    <div className="my-[20vh] flex flex-col gap-4 items-center md:w-1/2 mx-auto">
      <Image
        src={IMGS.PaymentFailedLady}
        height={500}
        width={500}
        alt="payment-failed"
        className="w-[16rem] "
      />
      <span className="text-xl text-center font-semibold text-deep-blue uppercase">
        Sorry. Your payment failed too many times.
      </span>
      <span className="text-slate-500 text-base text-wrap text-center font-medium">
        Dont worry, we have saved all your details and our expert will reach out
        to you to help you complete your order. Thank you.
      </span>
      <span className="text-slate-500 text-base text-wrap text-center">
        Please do not try to resubmit your application.
      </span>
    </div>
  );
};

export default Page;
