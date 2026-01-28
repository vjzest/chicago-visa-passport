"use client";
import React, { useEffect, useState } from "react";
import { CaseTable } from "@/components/pages/my-applications/cases-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/lib/config/axios";
// import { cases, cases } from "@/lib/mock-data/dummy";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import DynamicUserDetail from "@/components/globals/dynamic-user-detail";
import LoadingPage from "@/components/globals/loading/loading-page";
import { useCaseStore } from "@/store/use-case-store";
import { useRouter } from "next/navigation";

const Page = () => {
  const [cases, setCases] = useState([]);
  const [hasntStarted, setHasntStarted] = useState(false);
  const router = useRouter();
  const fetchCase = async () => {
    try {
      const response = await axiosInstance.get("/user/case");
      if (!response?.data?.success)
        toast.error("Something happened while getting applications");
      if (response?.data?.data) {
        const sortedCase = response?.data?.data?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setCases(sortedCase || response?.data?.data);
        console.log('rrrr ', response?.data?.data, sortedCase)
        let pendingStart = false;
        response.data?.data.forEach((item: any) => {
          if (!item?.hasStartedPassportForm) {
            pendingStart = true;
          }
        });
        setHasntStarted(pendingStart);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchCase();
  }, []);
  console.log('casess ', cases)
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="text-xl font-medium text-deep-blue">
          Hello,{" "}
          <DynamicUserDetail property="firstName" className="font-bold" />!
        </span>
        <span className="text-base text-slate-500 break-words md:w-3/4">
          {hasntStarted
            ? "Please click 'Get Started' below to begin your Visa application form. After that, follow the listed steps to gather the required forms and instructions. The prompts will guide you through the process and show you the next steps."
            : "View and take necessary actions on your applications from below"}
        </span>
      </div>

      <Card className="w-full mt-4">
        <div className="flex items-center w-full justify-between px-6 pt-4">
          <h1 className="text-xl text-slate-600 font-semibold">
            My Applications
          </h1>
          <div className="flex flex-col items-end gap-2">
            <span className="text-slate-600 font-medium">
              Apply for Family, Kids or Friends here
            </span>
            <Button
              onClick={() => {
                useCaseStore.setState({
                  formData: {},
                  generalFormData: {},
                });
                router.push("/apply");
              }}
              className="flex gap-1"
            >
              Add More Applicants <PlusCircle />{" "}
            </Button>
          </div>
        </div>
        <CardContent>
          {cases.length > 0 ? <CaseTable data={cases} /> : <LoadingPage />}
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
