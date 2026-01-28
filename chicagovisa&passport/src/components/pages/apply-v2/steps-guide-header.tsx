import { Button } from "@/components/ui/button";
import { useCaseStore } from "@/store/use-case-store";
import React, { Dispatch } from "react";
import { toast } from "sonner";
import { validateData } from "../step-v2/application-form-section";
import axiosInstance from "@/lib/config/axios";
import { Check, ChevronRight } from "lucide-react";
import { IMGS } from "@/lib/constants";
import Image from "next/image";

const StepsGuideHeader = ({
  currentStep,
  setCurrentStep,
  forms,
  setTriggerSubmit,
}: {
  currentStep: IApplySteps;
  setCurrentStep: (step: IApplySteps) => void;
  forms: any;
  setTriggerSubmit: Dispatch<React.SetStateAction<number | null>>;
}) => {
  const stepValue: number =
    currentStep === "application" ? 1 : currentStep === "shipping" ? 2 : 3;

  const { generalFormData, formData } = useCaseStore((state) => state);
  return (
    <div
      id="steps-guide-header"
      className="mx-auto md:mb-12 mb-0 mt-3 flex w-4/5 items-center justify-around p-5"
    >
      <Button
        className={`relative size-12 min-h-12 min-w-12 border-2 border-dashed p-2 text-lg font-semibold ${currentStep === "shipping" ? "bg-green-500" : ""}`}
        onClick={() => setCurrentStep("application")}
        disabled={currentStep === "order-confirmation"}
      >
        {currentStep === "application" ? (
          "1"
        ) : (
          <Check size={"1.5rem"} className="absolute" />
        )}
        <span className="absolute hidden md:block top-14 text-[.60rem] leading-4 text-slate-500 md:text-base">
          Passport type,
          <br />
          Speed of Service, Applicant and <br /> Contact information
        </span>
        <span className="absolute md:hidden block top-14 text-[.60rem] leading-4 text-slate-500 md:text-base">
          Speed / <br /> Applicant Info.
        </span>
      </Button>
      <div
        className={`h-0 relative w-full border-2 border-dashed ${stepValue > 1 ? "border-primary" : ""}`}
      >
        {stepValue === 1 && (
          <Image
            height={20}
            width={20}
            src={IMGS.ChevronRight}
            alt="jet passport right chevron"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-10"
          />
        )}
      </div>
      <Button
        className="relative size-12 min-h-12 min-w-12 border-2 border-dashed p-2 text-lg font-semibold"
        variant={currentStep === "shipping" ? "primary" : "outline"}
        disabled={currentStep === "order-confirmation"}
        onClick={async () => {
          if (!generalFormData?.serviceType) {
            return toast.error("Please select Service Type first", {
              position: "top-center",
            });
          } else if (!generalFormData?.serviceLevel) {
            return toast.error("Please select Speed of Service first", {
              position: "top-center",
            });
          } else {
            setTriggerSubmit(0);

            const validation = validateData(forms, formData, 1);
            // if (!validation) setCurrentStep("shipping");
            if (validation) {
              toast.error("Please complete the current step.", {
                position: "top-center",
              });
              document.getElementById("applicationInfoDiv")?.scrollIntoView({
                behavior: "smooth",
                inline: "start",
              });
              return;
            }
          }

          try {
            await axiosInstance.post("/common/check-email-used", {
              email: formData?.contactInformation?.email1,
              token: localStorage.getItem("user_token"),
            });
            setCurrentStep("shipping");
            document.getElementById("steps-guide-header")?.scrollIntoView({
              behavior: "smooth",
              inline: "start",
            });
          } catch (error: any) {
            if (error?.status === 409) {
              toast.error("This primary email is already registered.", {
                description:
                  "Please login to continue or use a different email address.",
                position: "top-center",
              });
            } else {
              document.getElementById("steps-guide-header")?.scrollIntoView({
                behavior: "smooth",
                inline: "start",
              });
              setCurrentStep("shipping");
            }
          }
        }}
      >
        2
        <span className="absolute hidden md:block top-14 text-[.60rem] leading-4 text-slate-500 md:text-base">
          Applicant&apos;s Shipping Information <br /> / Payment For Services
        </span>
        <span className="absolute md:hidden block top-14 text-[.60rem] leading-4 text-slate-500 md:text-base">
          Shipping Info.
          <br /> / Payment
        </span>
      </Button>
      <div
        className={`h-0 w-full relative border-2 border-dashed ${stepValue > 2 ? "border-primary" : ""}`}
      >
        {stepValue === 2 && (
          <Image
            height={20}
            width={20}
            src={IMGS.ChevronRight}
            alt="jet passport right chevron"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-10"
          />
        )}
      </div>

      <Button
        className="relative size-12 min-h-12 min-w-12  border-2 border-dashed  p-2 text-lg font-semibold"
        variant={currentStep === "order-confirmation" ? "primary" : "outline"}
        // onClick={() => setCurrentStep("order-confirmation")}
        disabled={currentStep !== "order-confirmation"}
      >
        3
        <span className="absolute hidden md:block top-14 text-wrap text-[.60rem] leading-4 text-slate-500 md:w-80  md:max-w-[20rem] md:text-base">
          Applicant Documentation <br />/ Complete Required Forms
        </span>
        <span className="absolute md:hidden block top-14 text-wrap text-[.60rem] leading-4 text-slate-500 md:w-80  md:max-w-[20rem] md:text-base">
          <span className="whitespace-nowrap">Applicant Docs.</span> <br />
          <span className="whitespace-nowrap">/ Required Forms </span>
        </span>
      </Button>
    </div>
  );
};

export default StepsGuideHeader;
