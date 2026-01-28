import CustomDateInput from "@/components/globals/date-text-input";
import { Label } from "@/components/ui/label";
import { useCaseStore } from "@/store/use-case-store";
import React from "react";

const DepartureDateField = () => {
  const isDepartureDateRequired = useCaseStore(
    (state) => state.isDepartureDateRequired
  );
  const setGeneralFormData = useCaseStore((state) => state.setGeneralFormData);
  const generalFormData = useCaseStore((state) => state.generalFormData);

  const handleDepartureDateChange = (date: string) => {
    setGeneralFormData({
      ...generalFormData,
      departureDate: date,
    });
  };
  return isDepartureDateRequired ? (
    <div id="departureDateField" className="w-[20rem] my-8 flex flex-col gap-2">
      <Label>
        Departure Date <span className="text-red-500">*</span>{" "}
      </Label>
      <CustomDateInput
        onChange={(e) => handleDepartureDateChange(e.target.value)}
        value={generalFormData?.departureDate || ""}
      />
    </div>
  ) : null;
};

export default DepartureDateField;
