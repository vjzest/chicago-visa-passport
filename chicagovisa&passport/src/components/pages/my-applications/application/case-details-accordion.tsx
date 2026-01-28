import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Eye, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

const CaseDetailsAccordion = ({
  caseDetails,
  isCanceled,
  isRefunded,
}: {
  caseDetails: any;
  isCanceled: boolean;
  isRefunded: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Accordion
      type="single"
      collapsible
      className="border-2 border-slate-200 rounded-md mb-4"
    >
      <AccordionItem value="details">
        <AccordionTrigger
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-3 px-5 hover:no-underline bg-white rounded-md"
        >
          <div className="text-lg flex items-center gap-2 font-medium ">
            <span className="hidden md:block"> Application for</span>
            <span className="font-semibold text-deep-blue">{`${caseDetails?.applicantInfo?.firstName} ${caseDetails?.applicantInfo?.middleName ?? ""} ${caseDetails?.applicantInfo?.lastName}`}</span>
            {isOpen ? (
              <span className="text-slate-500 text-sm">Click to collapse</span>
            ) : (
              <span className="text-slate-500 text-sm">
                Click to view details
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div
            className={`${isCanceled || isRefunded ? "pointer-events-none opacity-50" : ""}`}
          >
            <div className="flex flex-col justify-evenly gap-12 p-4 text-base md:flex-row">
              <div className="">
                <div className="mt-1 flex items-center justify-between gap-16">
                  <span className="text-sm font-semibold md:text-base">
                    Case No:
                  </span>{" "}
                  <span className="my-1 rounded-sm border bg-violet-50 px-2 py-1 text-sm uppercase md:text-base">
                    {caseDetails?.caseNo}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-16">
                  <span className="text-sm font-semibold md:text-base">
                    Service Type:
                  </span>{" "}
                  <span className="my-1 rounded-sm border bg-violet-50 px-2 py-1 text-sm md:text-base">
                    {caseDetails?.caseInfo?.serviceType?.serviceType}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-16">
                  <span className="text-sm font-semibold md:text-base">
                    Speed of Service:
                  </span>{" "}
                  <span className="my-1 rounded-sm border bg-violet-50 px-2 py-1 text-sm md:text-base">
                    {caseDetails?.caseInfo?.serviceLevel?.serviceLevel}
                  </span>
                </div>
              </div>
              <div className="min-h-[50%] border-2 border-primary"></div>
              <div>
                <div className="mt-1 flex items-center justify-between gap-16">
                  <span className="text-sm font-semibold md:text-base">
                    Case Manager:
                  </span>{" "}
                  <span className="my-1 rounded-sm border bg-violet-50 px-2 py-1 text-sm md:text-base">{`${caseDetails?.caseInfo?.caseManager?.firstName} ${caseDetails.caseInfo.caseManager?.lastName}`}</span>
                </div>

                <div className="mt-1 flex items-center justify-between gap-16">
                  <span className="text-sm font-semibold md:text-base">
                    Submitted on:
                  </span>{" "}
                  <span className="my-1 rounded-sm border bg-violet-50 px-2 py-1 text-sm md:text-base">
                    {new Date(caseDetails?.submissionDate).toLocaleDateString(
                      "en-us",
                      {
                        month: "long",
                        year: "numeric",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-16">
                  <span className="text-sm font-semibold md:text-base">
                    Visa details review:
                  </span>{" "}
                  <span className="my-1 rounded-sm border bg-violet-50 px-2 py-1 text-sm capitalize md:text-base">
                    {caseDetails?.applicationReviewStatus}
                  </span>
                </div>
                <div className="mt-4 flex w-full flex-col justify-center gap-2">
                  {caseDetails?.applicationReviewStatus !== "pending" && (
                    <Link
                      className="mx-auto"
                      href={`/dashboard/my-applications/${caseDetails?._id}/passport-application-preview`}
                    >
                      <Button variant={"outline"} className="w-64 self-center">
                        <Eye size={"1.3rem"} className={"mr-2"} />
                        Preview passport details
                      </Button>
                    </Link>
                  )}
                  <Link
                    className="mx-auto"
                    href={`/dashboard/my-applications/${caseDetails?._id}/invoice`}
                  >
                    <Button variant={"outline"} className="w-64 self-center">
                      <Receipt size={"1.3rem"} className={"mr-2"} />
                      View Invoice details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CaseDetailsAccordion;
