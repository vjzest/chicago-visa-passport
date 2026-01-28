import React, { Dispatch } from "react";
import { Button } from "@/components/ui/button";
import { useCaseStore } from "@/store/use-case-store";
import { toast } from "sonner";
import { validateData } from "../step-v2/application-form-section";
import axiosInstance from "@/lib/config/axios";
import { ArrowRight, Edit, Package, FileText } from "lucide-react";

interface StepsNavigationProps {
  currentStep: IApplySteps;
  setCurrentStep: (step: IApplySteps) => void;
  forms: any;
  setTriggerSubmit: Dispatch<React.SetStateAction<number | null>>;
}

const StepsNavigation: React.FC<StepsNavigationProps> = ({
  currentStep,
  setCurrentStep,
  forms,
  setTriggerSubmit,
}) => {
  const { generalFormData, formData } = useCaseStore((state) => state);

  const steps = [
    {
      id: "application" as IApplySteps,
      number: 1,
      title: "Visa type, Applicant and Contact information",
      shortTitle: "Speed / Applicant Info.",
      icon: <Edit className="w-5 h-5" />,
    },
    {
      id: "shipping" as IApplySteps,
      number: 2,
      title:
        "Speed of service, Applicant's Shipping Information / Payment For Services",
      shortTitle: "Shipping Info. / Payment",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: "order-confirmation" as IApplySteps,
      number: 3,
      title: "Applicant Documentation / Complete Required Forms",
      shortTitle: "Applicant Docs. / Required Forms",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  const getStepStatus = (stepId: IApplySteps, stepNumber: number) => {
    if (currentStep === stepId) return "in_progress";

    const currentStepNumber =
      currentStep === "application" ? 1 : currentStep === "shipping" ? 2 : 3;

    if (stepNumber < currentStepNumber) return "completed";
    return "pending";
  };

  const handleStepClick = async (stepId: IApplySteps, stepNumber: number) => {
    if (
      stepId === "order-confirmation" &&
      currentStep !== "order-confirmation"
    ) {
      return; // Don't allow clicking on step 3 unless it's active
    }

    if (stepId === "shipping" && currentStep === "application") {
      // Validate before moving to shipping
      if (!generalFormData?.serviceType) {
        return toast.error("Please select Service Type first", {
          position: "top-center",
        });
      } else {
        setTriggerSubmit(0);

        const validation = validateData(forms, formData, 1);
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
        setCurrentStep(stepId);
      } catch (error: any) {
        if (error?.status === 409) {
          toast.error("This primary email is already registered.", {
            description:
              "Please login to continue or use a different email address.",
            position: "top-center",
          });
        } else {
          setCurrentStep(stepId);
        }
      }
    } else {
      setCurrentStep(stepId);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === "application") {
      await handleStepClick("shipping", 2);
    } else if (currentStep === "shipping") {
      // Validate service level is selected before proceeding to step 3
      if (!generalFormData?.serviceLevel) {
        return toast.error("Please select a Speed of Service", {
          position: "top-center",
        });
      }
      // Add other shipping validation logic here if needed
      setCurrentStep("order-confirmation");
    }
  };

  const getNextStepInfo = () => {
    if (currentStep === "application") {
      return {
        title: "Next Step",
        description:
          "Speed of service, Applicant's Shipping Information / Payment For Services",
      };
    }
    return null;
  };

  return (
    <div className="bg-white p-6  border border-gray-200 lg:h-screen sticky top-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-sm font-semibold  uppercase tracking-wide mb-1 text-primary  ">
          Follow these 3 simple steps to Start processing your Visa
        </h2>
      </div>

      {/* Steps */}
      <div className="space-y-6 mb-8">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, step.number);
          const isClickable =
            step.id === "application" ||
            (step.id === "shipping" &&
              (status === "in_progress" || status === "completed")) ||
            (step.id === "order-confirmation" && status === "in_progress");

          return (
            <div key={step.id} className="relative">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-300 -mb-6"></div>
              )}

              {/* Step content */}
              <div className="flex items-start gap-4">
                {/* Step icon/number */}
                <button
                  onClick={() =>
                    isClickable && handleStepClick(step.id, step.number)
                  }
                  disabled={!isClickable}
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                    ${
                      status === "completed"
                        ? "bg-green-500 border-green-500 text-white"
                        : status === "in_progress"
                          ? "bg-primary border-primary text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                    }
                    ${isClickable ? "cursor-pointer hover:shadow-md" : "cursor-default"}
                  `}
                >
                  {status === "completed" ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </button>

                {/* Step details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      Step {step.number}
                    </span>
                  </div>

                  <h4 className="text-sm font-medium text-gray-900 mb-2 leading-tight">
                    {step.title}
                  </h4>

                  <div
                    className={`px-3 py-1 text-xs font-medium rounded-full border inline-block
                    ${
                      status === "completed"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : status === "in_progress"
                          ? "bg-primary/10 text-primary border-primary"
                          : status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {status === "completed"
                      ? "Completed"
                      : status === "in_progress"
                        ? "In Progress"
                        : "Pending"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Step Button */}
      {getNextStepInfo() && (
        <div className="border-t border-gray-200 pt-6">
          <Button
            onClick={handleNextStep}
            className="w-full hover:bg-primary/80 font-medium py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <span>{getNextStepInfo()?.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2 leading-tight">
            {getNextStepInfo()?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default StepsNavigation;
