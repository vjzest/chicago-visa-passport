"use client";
import { IContactDetails } from "@/app/(site)/configure/contact-info/page";
import BreadCrumbComponent from "@/components/passport/globals/breadcrumb";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import Invoice from "@/components/passport/pages/cases/invoice";
import axiosInstance from "@/services/axios/axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = ({ params: { caseId } }: { params: { caseId: string } }) => {
  const [caseData, setCaseData] = useState<any>(null);
  const [contactDetails, setContactDetails] = useState<IContactDetails | null>(
    null
  );

  const breadCrumbs = [
    { label: "Case Details", link: "/cases/" + caseId },
    { label: "invoice", link: null },
  ];
  const fetchCaseData = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/cases/caseId/" + caseId);
      setCaseData(data.data.caseData);
    } catch (error) {
      console.error("Error fetching case data:", error);
      toast.error("Error fetching case data");
    }
  };
  const fetchContactDetails = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/configs/contact-info", {
        cache: false,
      });
      if (!data?.success) throw new Error(data?.message);
      setContactDetails(data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    fetchCaseData();
    fetchContactDetails();
  }, []);
  if (!caseData || !contactDetails) return <LoadingPage />;
  return (
    <>
      <BreadCrumbComponent customBreadcrumbs={breadCrumbs} />

      <h2 className="font-semibold text-xl md:text-2xl">
        Invoice for case{" "}
        <span className="text-blue-600">{caseData.caseNo}</span>
      </h2>
      <Invoice caseData={caseData} contactDetails={contactDetails} />
    </>
  );
};

export default Page;
