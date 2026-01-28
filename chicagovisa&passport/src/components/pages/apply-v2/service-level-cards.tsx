import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useCaseStore } from "@/store/use-case-store";
import React from "react";

const ServiceLevelCards = ({
  services,
  disabled = false,
}: {
  services: {
    value: string;
    title: string;
    description: string;
    price: number;
    time: string;
    nonRefundableFee: number;
  }[];
  govFee: number | "";
  disabled?: boolean;
}) => {
  return (
    <div
      className={`${disabled ? "!opacity-60 bg-gray-50 !cursor-not-allowed" : ""}`}
    >
      <h2
        className={`mb-1 mt-2 scroll-mt-5 text-xl font-semibold $`}
        id="serviceLevelSelectCard"
      >
        Select How Quickly Do You Need Your Passport:{" "}
        {disabled && (
          <span className="italic text-red-600 text-sm">
            (Select a passport type first)
          </span>
        )}
      </h2>
      <span>
        Expedited passport processing begins once the required documents are
        received.
      </span>
      <div className="bg-slate-50T flex w-full flex-col gap-2 rounded-md pb-4 pt-1 md:w-3/4">
        {services?.length === 0 &&
          new Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="w-full md:h-12 h-16" />
            ))}
        {services
          ?.sort((a, b) => {
            const priceA =
              Number(a?.price) + (Number(a?.nonRefundableFee) || 0);
            const priceB =
              Number(b?.price + "") + (Number(b?.nonRefundableFee) || 0);
            return priceB - priceA;
          })
          .map((service) => (
            <IndividualCard
              service={service}
              key={service.title}
              disabled={disabled}
            />
          ))}
      </div>
    </div>
  );
};

const IndividualCard = ({
  service,
  disabled = false,
}: {
  service: {
    value: string;
    title: string;
    time: string;
    description: string;
    price: number;
    nonRefundableFee: number;
  };
  disabled?: boolean;
}) => {
  const { generalFormData, setGeneralFormData } = useCaseStore(
    (state) => state
  );

  // Handler function for both checkbox and card click
  const handleServiceSelection = () => {
    if (disabled) return;

    if (generalFormData?.serviceLevel === service.value) {
      setGeneralFormData({ ...generalFormData, serviceLevel: null });
    } else {
      setGeneralFormData({
        ...generalFormData,
        serviceLevel: service.value,
      });
    }
  };

  return (
    <Card
      className={`flex items-center px-4 ${!disabled ? "cursor-pointer md:cursor-default" : ""}`}
      onClick={(e) => {
        // Only trigger the click handler on mobile/tablet views
        // We're using a simple width-based check for this
        if (window.innerWidth < 768 && !disabled) {
          e.preventDefault();
          handleServiceSelection();
        }
      }}
    >
      <Checkbox
        id={service.value}
        disabled={disabled}
        checked={generalFormData?.serviceLevel === service.value}
        onCheckedChange={handleServiceSelection}
        className="size-7 rounded-full"
      />
      <div className="grid w-full grid-cols-[1fr_1fr] md:grid-cols-[2fr_2fr_1fr] items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor={service.value}
            className="text-base font-medium cursor-pointer"
          >
            {service.title}
          </label>
        </div>

        <span className="hidden md:block text-base text-slate-500">
          {service?.time}
        </span>
        <div className="flex items-center gap-6 justify-end">
          <span className="text-lg font-semibold whitespace-nowrap">
            ${Number(service?.price) + (Number(service?.nonRefundableFee) || 0)}{" "}
            <span className="text-sm font-medium italic text-slate-500">
              + Gov fee
            </span>
            <span className="text-lg text-slate-500">*</span>
          </span>
        </div>
        <span className="block md:hidden whitespace-nowrap col-span-2 text-sm text-slate-500">
          {service?.time}
        </span>
      </div>
    </Card>
  );
};

export default ServiceLevelCards;
