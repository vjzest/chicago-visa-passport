import Faq from "@/components/pages/faq/faq-accordion";
import React from "react";
import { BreadCrumbComponent } from "@/components/globals";

const page = () => {
  const customBreadcrumbs = [
    { label: "Help", link: "/dashboard/help" },
    { label: "Faq", link: null },
  ];
  return (
    <>
      <div className="my-3 flex justify-start">
        <BreadCrumbComponent customBreadcrumbs={customBreadcrumbs} />
      </div>{" "}
      <h1 className="py-4 px-6 font-sans text-xl font-semibold">
        Frequently Asked Questions
      </h1>
      <Faq />
    </>
  );
};

export default page;
