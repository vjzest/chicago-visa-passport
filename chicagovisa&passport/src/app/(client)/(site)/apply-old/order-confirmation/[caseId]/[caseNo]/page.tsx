"use client";

import { Button } from "@/components/ui/button";
import OrderConfirmation from "@/components/pages/order/order-confirm";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { IMGS } from "@/lib/constants";
import Image from "next/image";
import axiosInstance from "@/lib/config/axios";
import LoadingPage from "@/components/globals/loading/loading-page";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/store/use-auth-store";
import { ArrowRight, Loader2, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Page({
  params: { caseId, caseNo },
}: {
  params: { caseId: string; caseNo: string };
}) {
  const [contactDetails, setContactDetails] = useState<{
    phone: string;
    email: string;
  } | null>(null);
  const [cbrLoading, setCbrLoading] = useState(false);
  const [allowCbr, setAllowCbr] = useState(true);
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [openCbrDialog, setOpenCbrDialog] = useState(false);
  const { isLoggedIn } = useAuthStore((state) => state);
  const [note, setNote] = useState("");
  const [pageExpired, setPageExpired] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const fetchCaseDetails = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/common/cases/${caseId}/${caseNo}`
      );
      if (!data?.success) throw new Error(data?.message);
      const creationDate = new Date(data?.data?.case?.submissionDate);
      if (!creationDate) return;
      const currentDate = new Date();
      //check if it is more than 20 minutes from creation
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
    }
  };
  const [accessToken, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    fetchCaseDetails();
    const tokenFromStorage = localStorage.getItem("user_token");
    if (tokenFromStorage) setAccessToken(tokenFromStorage);
  }, []);
  const fetchContactDetails = async () => {
    try {
      const { data } = await axiosInstance.get("/common/contact-info");
      if (!data?.success) throw new Error(data?.message);
      setContactDetails(data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    fetchContactDetails();
  }, []);

  useEffect(() => {
    if (!caseDetails) return;
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "purchase",
      ecommerce: {
        value: totalAmount,
        currency: "USD",
      },
      transaction_id: caseDetails?.caseNo,
    });
  }, [caseDetails, totalAmount]);

  const requestForCallback = async () => {
    setCbrLoading(true);
    try {
      const { data } = await axiosInstance.put(
        "/common/callback-request/" + caseId,
        {
          note,
        }
      );
      if (!data?.success) {
        throw new Error(data?.message);
      }
      setAllowCbr(false);
      toast.success("Callback requested successfully");
      setOpenCbrDialog(false);
    } catch (error) {
      console.log(error);
    } finally {
      setCbrLoading(false);
    }
  };

  return caseDetails ? (
    <div className="flex w-full flex-col items-center justify-center gap-y-5 md:p-6">
      <div className="flex w-full justify-start px-8">
        <h1 className="mb-3 md:mb-6 text-start text-lg md:text-2xl font-semibold">
          Order Status & Client Portal Confirmation
        </h1>
      </div>

      <div className="flex w-full flex-col items-center  rounded-md bg-slate-50 py-3 pb-8  md:w-[90%] md:justify-evenly md:shadow-full">
        <div className="w-[95%]">
          <OrderConfirmation
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

        <div className="flex md:w-4/5 mx-4 md:mx-0 flex-col items-center gap-2">
          <h2 className="mt-4 text-base md:text-xl font-semibold">
            Here&#39;s what comes next
          </h2>
          <h1 className="text-base md:text-xl text-center w-4/5 md:w-full font-semibold">
            {isLoggedIn
              ? "Please continue to your Client Portal and complete the steps below"
              : "Please login to the Client Portal to complete the steps below"}
          </h1>
          <h3 className="mb-4 font-medium md:w-[40vw] text-green-600 w-full text-center">
            Need to apply for additional applicants (family, kids, or friends)?
            Simply log in to your client portal to add them easily by clicking
            on the blue button &quot;Add More Applicants.&quot;
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="flex items-center gap-4 border-2 p-6 shadow-lg">
              <>
                <div>
                  <p className="w-full break-words text-sm md:text-base">
                    Access the Client Portal. Then go to &#39;My
                    applications&#39; and click on &#39;Get started&#39;. Fill
                    all the necessary questions provided to you.
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
                  alt="clock"
                  height={500}
                  width={500}
                  className="size-32 rounded-md object-cover opacity-90"
                  src={IMGS.FormImage}
                />
              </>
            </Card>
            <Card className="flex items-center gap-4 border-2 p-6 shadow-lg">
              <>
                <p className="w-full break-words text-sm md:text-base">
                  {`You can also start the application LATER. Access the Client
                    Portal from the website by clicking on 'Login' from top and
                    entering your credentials we have provided to you by your
                    email.`}
                </p>
                <Image
                  alt="clock"
                  height={500}
                  width={500}
                  className="size-32 rounded-md object-cover opacity-90"
                  src={IMGS.ClockImage}
                />
              </>
            </Card>
          </div>

          <div className="my-4 min-w-full border-2 border-slate-300"></div>
          <Card className="mt-6 flex md:w-4/5 flex-col gap-4 border-2 bg-violet-50 p-6 shadow-lg">
            <h2 className="text-center text-xl font-bold uppercase">SUPPORT</h2>
            <div className="flex gap-4  md:gap-2 flex-col md:flex-row">
              <Card className="flex flex-[2] flex-col items-center justify-center gap-4 border-2 p-4 shadow-lg">
                <span className="text-base md:text-lg font-semibold">
                  <strong className="mr-2 text-red-500">NOTE: </strong>
                  Do you need help or want us to call you?
                </span>
                <span className="text-base">
                  Please click the button below to get a call from your assigned
                  passport specialist{" "}
                  <strong>
                    {caseDetails?.caseInfo?.caseManager?.firstName +
                      " " +
                      caseDetails?.caseInfo?.caseManager?.lastName}
                  </strong>{" "}
                  during our normal business hours.
                </span>
                <Dialog open={openCbrDialog} onOpenChange={setOpenCbrDialog}>
                  <DialogTrigger>
                    <Button disabled={!allowCbr}>Request a callback</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Request Callback</DialogTitle>
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message (optional)
                    </Label>
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      maxLength={300}
                      rows={3}
                      id="message"
                      placeholder="Enter your message here"
                      className="w-full"
                    />
                    <Button
                      disabled={cbrLoading}
                      onClick={requestForCallback}
                      className="w-fit ml-auto"
                    >
                      {cbrLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </DialogContent>
                </Dialog>
              </Card>
              <Card className="flex w-full md:w-fit  flex-1 flex-col items-center gap-3 border-2 bg-white p-3 shadow-lg">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Image
                    height={1000}
                    width={1000}
                    className="size-20"
                    src={IMGS?.Logo}
                    alt="Help"
                  />
                  <span className="text-xl font-semibold">Chicago Passport & Visa Expedite</span>
                  <p className="text-center">Customer Support Specialist</p>
                  <a href={`tel:${contactDetails?.phone}`}>
                    <Button variant={"outline"} size={"sm"}>
                      <Phone className="mr-2" size={"1rem"} />
                      {contactDetails?.phone}
                    </Button>
                  </a>
                  <span className="text-center text-base font-medium">
                    Mon-Fri 9 AM – 6PM EST
                  </span>
                  <span className="text-center text-base font-medium text-red-500">
                    Saturday & Sunday closed
                  </span>
                </div>
              </Card>
            </div>
          </Card>
        </div>
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

// http://localhost:3001/apply/order-confirmation/6703c084dcd17fab24edd549/J48526144
