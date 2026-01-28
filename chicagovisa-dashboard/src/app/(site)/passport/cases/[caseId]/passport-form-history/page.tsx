"use client";
import axiosInstance from "@/services/axios/axios";
import React, { useEffect, useState } from "react";

import { cn, getFormattedDateAndTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import BreadCrumbComponent from "@/components/passport/globals/breadcrumb";
import Link from "next/link";
import { useAccess } from "@/hooks/use-access";
import { useRouter } from "next/navigation";
import { RestrictedAccessRoute } from "@/components/passport/globals/Auth/restricted-access-route";

const NoteBox: React.FC<{
  content: {
    _id: string;
    note: string;
    createdAt: string;
  };
}> = ({ content }) => {
  const { formattedDate, formattedTime } = getFormattedDateAndTime(
    content?.createdAt
  );

  // If the note is an empty string, don't render anything
  if (content.note === "") {
    return null;
  }

  return (
    <div
      className={cn(
        "mb-2 rounded-md  border border-gray-200  p-2 shadow transition-shadow duration-200 hover:shadow-md"
      )}
    >
      <div className="mb-1 flex justify-between text-xs text-gray-500">
        <span className="font-medium">
          {formattedDate} - {formattedTime}
        </span>
      </div>
      <div className="mb-2">
        <div className="min-h-10 overflow-hidden rounded bg-white p-2 text-sm leading-tight text-gray-800 shadow-inner">
          <span>{content.note}</span>
        </div>
      </div>
    </div>
  );
};

const Page = ({ params: { caseId } }: { params: { caseId: string } }) => {
  const router = useRouter();
  const access = useAccess();
  const [customBreadcrumbs, setBreadCrumbs] = useState([
    { label: "Dashboard", link: "/search" },
    { label: "Cases", link: null },
  ]);
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const fetchCasedetails = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/cases/caseId/" + caseId,
        {
          cache: false,
        }
      );
      setBreadCrumbs([
        {
          label: data?.data?.caseData?.caseNo,
          link: `/cases/${caseId}`,
        },
        {
          label: "Review Passport Application",
          link: `/cases/${caseId}/review-passport-application`,
        },
        {
          label: "Passport form history",
          link: null,
        },
      ]);
      if (!data.success) throw new Error(data.message);
      setCaseDetails(data?.data?.caseData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (access && !access.editCaseDetails.refundAndVoid) {
      router.replace("/access-denied");
    }
  }, [access, router]);
  useEffect(() => {
    fetchCasedetails();
  }, []);

  return (
    <RestrictedAccessRoute
      section="viewCaseDetails"
      action={"passportApplicationInformation"}
    >
      {caseDetails ? (
        <>
          <BreadCrumbComponent customBreadcrumbs={customBreadcrumbs} />
          <div>
            <Link
              href={
                customBreadcrumbs[customBreadcrumbs?.length - 2]?.link || ""
              }
              className="mb-1 flex items-center gap-2 font-semibold text-primary "
            >
              <ArrowLeft size={"1rem"} /> Go Back
            </Link>
          </div>
          <h1 className="mb-2 text-2xl font-semibold">Passport form history</h1>

          <div className="flex flex-col gap-2">
            {caseDetails.passportFormLogs.map((item: any) => (
              <NoteBox key={item._id} content={item} />
            ))}
          </div>
        </>
      ) : (
        <LoadingPage />
      )}
    </RestrictedAccessRoute>
  );
};

export default Page;
