"use client";
import React from "react";
// import TNCForm from "@/components/passport/pages/terms-and-conditions/tnc-form";

import dynamic from "next/dynamic";

const TNCForm = dynamic(
  () =>
    import("@/components/passport/pages/terms-and-conditions/tnc-form").then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const Page = () => {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Configure T & C</h1>
      <div className="flex w-full flex-col justify-evenly gap-8 md:flex-row">
        <TNCForm />
      </div>
    </>
  );
};

export default Page;
