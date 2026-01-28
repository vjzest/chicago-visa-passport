"use client";
import { Card } from "@/components/ui/card";
import { useDataStore } from "@/store/use-data-store";
import { Mail, Phone, X } from "lucide-react";
import Link from "next/link";
import React from "react";

const CaseBlocked = ({ caseNo }: { caseNo: string }) => {
  const contactInfo = useDataStore((state) => state.storeContactInfo);
  return (
    <Card className="w-full my-[30vh] flex flex-col items-center gap-8 md:w-[40vw] mx-auto p-8 rounded-lgs">
      <X className="text-red-500 size-[5rem]" />
      <h3 className="text-2xl font-semibold text-light-blue">
        Access blocked for <span className="font-bold">{caseNo}</span>
      </h3>
      <p className="text-deep-blue font-medium text-base text-center break-words">
        Your access to this case is blocked. Please reach out to our customer
        care to know more and resolve the issue.
      </p>
      <div className="flex flex-col gap-2 items-start -mt-2">
        <div className=" flex gap-2 items-center">
          <Mail size={"1.2rem"} className="col-span-1 text-deep-blue" />
          <span className="col-span-3 text-base font-medium text-slate-700">
            <a
              href={`mailto:${contactInfo.email}?subject=${caseNo}: Requesting resolution for case block`}
            >
              {contactInfo.email}
            </a>
          </span>
        </div>
        <div className=" flex gap-2 items-center">
          <Phone size={"1.2rem"} className="col-span-1 text-deep-blue" />
          <span className="col-span-3 text-base font-medium text-slate-700">
            <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
          </span>
        </div>
      </div>
    </Card>
  );
};

export default CaseBlocked;
