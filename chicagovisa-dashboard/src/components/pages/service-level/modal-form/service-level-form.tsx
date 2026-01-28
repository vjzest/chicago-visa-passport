"use client";
import React from "react";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useServiceLevelForm } from "./use-service-level-form";
import Step1BasicInfo from "./step-1-basic-info";
import Step2VisaTypes from "./step-2-visa-types";

interface ServiceLevelFormProps {
  submitFunction: (data: any) => Promise<void>;
  initialData?: any; // Relaxed type for convenience
}

const ServiceLevelForm: React.FC<ServiceLevelFormProps> = React.memo(
  ({ submitFunction, initialData }) => {
    const {
      form,
      control,
      isSubmitting,
      handleSubmit,
      currentStep,
      isTransitioning,
      handleNext,
      handleBack,
      merchantAccounts,
      serviceTypes,
      countryPairs,
      selectedServiceTypes,
      formatServiceLevelInput,
      formatTimeInput,
      getServiceTypeLabel,
      handleServiceTypeChange,
    } = useServiceLevelForm({ submitFunction, initialData });

    return (
      <div className="mx-auto rounded-md p-2">
        <div className="flex items-center justify-between">
          <h2 className="mb-3 text-center text-2xl font-semibold">
            Service Level Form
          </h2>
          <StepIndicator currentStep={currentStep} />
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="">
            {/* Step 1: Basic Information */}
            <Step1BasicInfo
              control={control}
              formatServiceLevelInput={formatServiceLevelInput}
              formatTimeInput={formatTimeInput}
              merchantAccounts={merchantAccounts}
              handleNext={handleNext}
              isTransitioning={isTransitioning}
              currentStep={currentStep}
            />

            {/* Step 2: Country Pairs & Visa Types */}
            <Step2VisaTypes
              control={control}
              serviceTypes={serviceTypes}
              countryPairs={countryPairs}
              selectedServiceTypes={selectedServiceTypes}
              handleServiceTypeChange={handleServiceTypeChange}
              getServiceTypeLabel={getServiceTypeLabel}
              handleBack={handleBack}
              isSubmitting={isSubmitting}
              isTransitioning={isTransitioning}
              currentStep={currentStep}
            />
          </form>
        </Form>
      </div>
    );
  }
);

// Sub-components
interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => (
  <div className="mb-6 flex items-center justify-center gap-4">
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
        currentStep === 1
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      )}
    >
      1
    </div>
    <div className="h-0.5 w-12 bg-muted" />
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
        currentStep === 2
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      )}
    >
      2
    </div>
  </div>
);

ServiceLevelForm.displayName = "ServiceLevelForm";

export default ServiceLevelForm;
