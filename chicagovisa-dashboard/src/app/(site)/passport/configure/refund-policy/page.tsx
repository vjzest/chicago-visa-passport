"use client";
import React from "react";
// import TNCForm from "@/components/passport/pages/terms-and-conditions/tnc-form";

import dynamic from "next/dynamic";

const RefundPolicyForm = dynamic(
  () =>
    import("@/components/passport/pages/terms-and-conditions/refund-policy-form").then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const Page = () => {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Configure Refund Policy</h1>
      <div className="flex w-full flex-col justify-evenly gap-8 md:flex-row">
        <RefundPolicyForm />
      </div>
    </>
  );
};

export default Page;
