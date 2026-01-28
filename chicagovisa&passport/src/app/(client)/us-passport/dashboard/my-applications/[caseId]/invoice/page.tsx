"use client";

import { BreadCrumbComponent } from "@/components/globals";
import LoadingPage from "@/components/globals/loading/loading-page";
import Invoice from "@/components/pages/settings/invoice";
import axiosInstance from "@/lib/config/axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import CaseBlocked from "../case-blocked";

const Page = ({ params: { caseId } }: { params: { caseId: string } }) => {
  const [caseData, setCaseData] = useState<any>(null);
  const [breadCrumbs, setBreadCrumbs] = useState([
    { label: "Case Details", link: "/dashboard/my-applications/" + caseId },
    { label: "Invoice", link: null },
  ]);
  const fetchCaseData = async () => {
    try {
      const { data } = await axiosInstance.get("/user/case/" + caseId, {
        cache: false,
      });
      setCaseData(data.data.caseData);
      setBreadCrumbs([
        {
          label: "My Cases",
          link: "/dashboard/my-applications/",
        },
        {
          label: data.data.caseData.caseNo,
          link: "/dashboard/my-applications/" + caseId,
        },
        { label: "Invoice", link: null },
      ]);
    } catch (error) {
      console.error("Error fetching case data:", error);
      toast.error("Error fetching case data");
    }
  };
  useEffect(() => {
    fetchCaseData();
  }, []);
  if (!caseData) return <LoadingPage />;
  if (caseData?.isAccessible === false) {
    return <CaseBlocked caseNo={caseData?.caseNo} />;
  }
  return (
    <>
      <BreadCrumbComponent customBreadcrumbs={breadCrumbs} />

      <h2 className="font-semibold text-xl md:text-2xl ml-4 mb-4">
        Invoice for case{" "}
        <span className="text-blue-600">{caseData.caseNo}</span>
      </h2>
      <Invoice caseData={caseData} />
    </>
  );
};

export default Page;
