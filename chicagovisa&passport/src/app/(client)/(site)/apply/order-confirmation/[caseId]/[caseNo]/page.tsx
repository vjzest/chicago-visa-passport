"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { IMGS } from "@/lib/constants";
import Image from "next/image";
import axiosInstance from "@/lib/config/axios";
import LoadingPage from "@/components/globals/loading/loading-page";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/store/use-auth-store";
import { ArrowRight } from "lucide-react";
import OrderConfirmationV2 from "@/components/pages/order/order-confirm-v2";

export default function Page({
  params: { caseId, caseNo },
}: {
  params: { caseId: string; caseNo: string };
}) {
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [pageExpired, setPageExpired] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const { isLoggedIn } = useAuthStore((state) => state);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const fetchCaseDetails = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/common/cases/${caseId}/${caseNo}`
      );
      if (!data?.success) throw new Error(data?.message);
      const creationDate = new Date(data?.data?.case?.submissionDate);
      if (!creationDate) return;
      const currentDate = new Date();
      if (currentDate.getTime() - creationDate.getTime() > 20 * 60 * 1000) {
        setPageExpired(true);
      } else {
        setCaseDetails(data?.data?.case);
        const caseData = data?.data?.case;
        const total = Object.values(
          caseData.caseInfo.invoiceInformation as {
            service: string;
            price: number;
          }[]
        ).reduce((acc: number, curr: { service: string; price: number }) => {
          return (acc += curr.price);
        }, 0);
        setTotalAmount(total);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchCaseDetails();
    const tokenFromStorage = localStorage.getItem("user_token");
    if (tokenFromStorage) setAccessToken(tokenFromStorage);
  }, []);

  return caseDetails ? (
    <div className="flex flex-col w-full items-center justify-center bg-[#F2F2F7]">
      {/* Hero section with confirmation */}
      <div className="w-11/12 md:w-11/12 lg:w-10/12 xl:w-9/12 mt-16 rounded-lg overflow-hidden shadow-lg">
        <OrderConfirmationV2
          ipAddress={caseDetails?.ipAddress}
          applicantName={
            caseDetails?.applicantInfo?.firstName +
            " " +
            (caseDetails?.applicantInfo?.middleName ?? "") +
            " " +
            caseDetails?.applicantInfo?.lastName
          }
          processingTime={caseDetails?.caseInfo?.serviceLevel?.time}
          orderNumber={caseDetails?.caseNo}
          serviceType={caseDetails?.caseInfo?.serviceType?.serviceType}
          serviceLevel={caseDetails?.caseInfo?.serviceLevel?.serviceLevel}
          totalAmount={totalAmount}
        />
      </div>

      {/* Next steps */}
      <div className="flex flex-col items-center  p-3 sm:p-5 justify-center mt-10 w-full md:w-[85%]">
        <h2 className="text-lg md:text-2xl font-bold mb-2 text-primary">
          {`Here's what comes next`}
        </h2>
        <p className="text-base md:text-lg text-primary font-semibold mb-6 text-center max-w-2xl">
          {isLoggedIn
            ? "Please continue to your Client Portal and complete the steps below"
            : "Please login to the Client Portal to complete the steps below"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-6 w-full">
          {/* Client Portal */}
          <Card className="flex items-start gap-4 p-6 shadow-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Client Portal</h3>
              <p className="text-sm text-gray-700">
                Access the Client Portal. Then go to &apos;My applications&apos;
                and click on &apos;Get started&apos;. Fill all the necessary
                questions provided to you.
              </p>
              <Link
                href={accessToken ? "/dashboard/my-applications" : "/login"}
              >
                <Button className="mt-4">
                  {accessToken ? "Start now" : "Login now"} <ArrowRight />
                </Button>
              </Link>
            </div>
            <Image
              alt="Form illustration"
              src={IMGS.OrderConfirmPageClientPortal}
              width={200}
              height={200}
              className="w-28 h-36 object-cover"
            />
          </Card>

          {/* Start Later */}
          <Card className="flex items-start gap-4 p-6 shadow-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Start Later</h3>
              <p className="text-sm text-gray-700">
                You can also start the application later. Access the Client
                Portal from the website by clicking on &apos;Login&apos; and
                entering the credentials we sent to your email.
              </p>
            </div>
            <Image
              alt="Clock illustration"
              src={IMGS.OrderConfirmPageStartLaterPortal}
              width={200}
              height={200}
              className="w-28 h-36 object-cover"
            />
          </Card>
        </div>

        {/* Note Card */}
        <Card className="w-full mt-6 p-6 bg-[#B31942] text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                NOTE: Do you need help, or you want us to call you?
              </h3>
              <p className="text-sm mb-4">
                Please click on the button below to request a callback from your
                passport / visa specialist{" "}
                <span className="font-semibold">Maricruz Suarez</span> during
                our normal business hours.
              </p>
            </div>
            <div className="flex flex-col  max-md:w-full items-end gap-2">
              <div className="text-right text-sm">
                <div>Monday - Friday</div>
                <div>9:00 am - 6:00 pm EST</div>
                <div>Saturday & Sunday (Closed)</div>
              </div>
              <Button
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Request a call back
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ) : pageExpired ? (
    <div className="mx-auto flex flex-col items-center justify-center gap-8">
      <Image
        className="w-4/5 md:w-[30vw]"
        src={IMGS.LinkBroken}
        width={500}
        height={500}
        alt="link-broken"
      />
      <h2 className="text-xl font-medium text-slate-500">
        Sorry, this page has expired
      </h2>
      <Link href={"/login"}>
        <Button variant={"outline"}>Go to Client Portal</Button>
      </Link>
    </div>
  ) : (
    <LoadingPage />
  );
}
