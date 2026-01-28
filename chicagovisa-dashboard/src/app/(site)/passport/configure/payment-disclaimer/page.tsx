"use client";
import React from "react";

import DisclaimerForm from "@/components/passport/pages/payment-disclaimer/disclaimer-form";

const Page = () => {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">
        Configure Payment Disclaimer
      </h1>
      <div className="flex w-full flex-col justify-evenly gap-8 md:flex-row">
        <DisclaimerForm />
      </div>
    </>
  );
};

export default Page;
