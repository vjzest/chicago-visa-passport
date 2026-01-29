"use client";

import { Button } from "@/components/ui/button";
import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type IFilter = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  fullName: string;
  caseId: string;
  phone: string;
  email: string;
  lastFourOfCC: string;
  applicantName: string;
};

// Default empty filter values
const defaultFilterValues: IFilter = {
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  fullName: "",
  caseId: "",
  phone: "",
  email: "",
  lastFourOfCC: "",
  applicantName: "",
};

const STORAGE_KEY = "advanced-search-filter";

const AdvancedSearch = ({
  searchFunction,
  clearFunction,
}: {
  searchFunction: (filter: IFilter) => Promise<void>;
  clearFunction: () => void;
}) => {
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Function to get saved filter values from local storage
  function getSavedFilterValues(): IFilter | null {
    if (typeof window === "undefined") return null;
    const savedFilter = localStorage.getItem(STORAGE_KEY);
    return savedFilter ? JSON.parse(savedFilter) : null;
  }

  // Initialize form with saved values or defaults
  const { register, handleSubmit, reset, setValue, watch, getValues, ...form } =
    useForm<IFilter>({
      defaultValues: getSavedFilterValues() || defaultFilterValues,
    });

  // Get all current form values
  const formValues = watch();

  // Save form values whenever they change
  useEffect(() => {
    if (initialLoadComplete) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
    }
  }, [formValues, initialLoadComplete]);

  // Check if there are any saved values and perform initial search if needed
  useEffect(() => {
    const savedValues = getSavedFilterValues();

    if (savedValues) {
      // Check if we have any non-empty values to determine if we should search
      const hasValues = Object.values(savedValues).some(
        (value) => value !== null && value !== undefined && value !== ""
      );

      // Check if advanced section should be open
      const hasAdvancedValues =
        savedValues.email ||
        savedValues.lastFourOfCC ||
        savedValues.applicantName;

      setOpenAdvanced(!!hasAdvancedValues);

      // Auto-trigger search if we have values
      if (hasValues) {
        // Use setTimeout to ensure this runs after component is fully mounted
        setTimeout(() => {
          searchFunction(savedValues);
        }, 100);
      }
    }

    // Mark initial load as complete so we can start tracking changes
    setInitialLoadComplete(true);
  }, []);

  const handleClear = () => {
    // Clear form and local storage
    reset(defaultFilterValues);
    localStorage.removeItem(STORAGE_KEY);
    // Call the provided clear function
    clearFunction();
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    type: "text" | "number"
  ) => {
    const input = event.currentTarget;

    // Allow special keys like Backspace, Delete, Arrow keys, Tab, etc.
    if (
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
        event.key
      )
    ) {
      return; // Allow these keys without preventing the default action
    }

    if (type === "text") {
      // Prevent characters that are not letters or spaces
      if (!/[a-zA-Z ]/.test(event.key)) {
        event.preventDefault();
      } else if (
        event.key === " " &&
        (input.selectionStart === 0 ||
          input.value[input.selectionStart! - 1] === " ")
      ) {
        // Prevent consecutive spaces or spaces at the start
        event.preventDefault();
      }
    } else if (type === "number" && !/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(async (values) => {
          // Save values before search
          localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
          await searchFunction(values);
        })}
        className="flex w-full flex-col gap-2"
      >
        <div className="my-2 flex justify-between whitespace-nowrap gap-4 md:overflow-hidden overflow-x-auto">
          <div className="flex flex-col md:gap-2">
            <label htmlFor="startDate">Start Date</label>
            <input
              {...register("startDate")}
              id="startDate"
              type="date"
              max={
                new Date(
                  new Date().toLocaleString("en-US", {
                    timeZone: "America/New_York",
                  })
                )
                  .toISOString()
                  .split("T")[0]
              }
              className="rounded-sm border-2 p-2 outline-none"
            />
          </div>
          <div className="flex flex-col md:gap-2">
            <label htmlFor="startTime">Start Time</label>
            <input
              {...register("startTime")}
              id="startTime"
              type="time"
              className="rounded-sm border-2 p-2 outline-none"
            />
          </div>
          <div className="flex flex-col md:gap-2">
            <label htmlFor="endDate">End Date</label>
            <input
              {...register("endDate")}
              id="endDate"
              type="date"
              max={
                new Date(
                  new Date().toLocaleString("en-US", {
                    timeZone: "America/New_York",
                  })
                )
                  .toISOString()
                  .split("T")[0]
              }
              className="rounded-sm border-2 p-2 outline-none"
            />
          </div>
          <div className="flex flex-col md:gap-2">
            <label htmlFor="endTime">End Time</label>
            <input
              {...register("endTime")}
              id="endTime"
              type="time"
              className="rounded-sm border-2 p-2 outline-none"
            />
          </div>

          <div className="flex flex-col md:gap-2">
            <label htmlFor="caseId">Case No.</label>
            <input
              {...register("caseId")}
              id="caseId"
              placeholder="Enter Case No."
              type="text"
              className="w-52 rounded-sm uppercase border-2 p-2 outline-none"
              maxLength={9}
            />
          </div>
          <div className="flex flex-col md:gap-2">
            <label htmlFor="phone">Phone</label>
            <input
              {...register("phone")}
              id="phone"
              placeholder="Enter Phone"
              type="text"
              className="w-64 rounded-sm border-2 p-2 outline-none"
              onKeyDown={(e) => handleKeyPress(e, "number")}
              maxLength={10}
            />
          </div>
        </div>

        {openAdvanced && (
          <div className="flex md:w-1/3 flex-col gap-2">
            <div className="flex items-center justify-between md:gap-4">
              <label htmlFor="email">Email</label>
              <input
                {...register("email")}
                id="email"
                placeholder="Enter Email"
                type="text"
                className="md:w-64 rounded-sm border-2 p-2 outline-none"
                maxLength={100}
              />
            </div>

            <div className="flex items-center justify-between md:gap-4">
              <label htmlFor="lastFourOfCC">Last 4 of CC number</label>
              <input
                {...register("lastFourOfCC")}
                id="lastFourOfCC"
                placeholder="Enter Last 4 of CC number"
                type="text"
                className="md:w-64 w-52 rounded-sm border-2 p-2 outline-none"
                onKeyDown={(e) => handleKeyPress(e, "number")}
                maxLength={4}
              />
            </div>

            <div className="flex items-center justify-between md:gap-4">
              <label htmlFor="applicantName">Applicant name</label>
              <input
                {...register("applicantName")}
                id="applicantName"
                placeholder="Enter Applicant name"
                type="text"
                className="md:w-64 w-52 rounded-sm border-2 p-2 outline-none"
                onKeyDown={(e) => handleKeyPress(e, "text")}
                maxLength={50}
              />
            </div>
          </div>
        )}
        <div className="flex w-full justify-between">
          <button
            type="button"
            onClick={() => {
              setOpenAdvanced((prev) => !prev);
              if (openAdvanced) {
                setValue("email", "");
                setValue("lastFourOfCC", "");
                setValue("applicantName", "");
                // Save the updated values to localStorage
                const currentValues = watch();
                localStorage.setItem(
                  STORAGE_KEY,
                  JSON.stringify({
                    ...currentValues,
                    email: "",
                    lastFourOfCC: "",
                    applicantName: "",
                  })
                );
              }
            }}
            className="my-2 mr-auto font-semibold text-blue-500"
          >
            {openAdvanced
              ? "Hide Advanced Search Options"
              : "Show Advanced Search Options"}
          </button>
          <div className="flex gap-2">
            <Button
              onClick={handleClear}
              variant={"outline"}
              size={"sm"}
              className="font-medium"
            >
              Clear
            </Button>
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              size={"sm"}
              className="font-medium"
            >
              Search
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AdvancedSearch;
