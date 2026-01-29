"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axiosInstance from "@/services/axios/axios";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type IStatus = {
  _id: string;
  title: string;
  level: number;
};

type IProcessingLocation = {
  _id: string;
  locationName: string;
};

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
  statuses: string[];
  processingLocations: string[];
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [processingLocations, setProcessingLocations] = useState<
    IProcessingLocation[]
  >([]);
  const [selectedProcessingLocations, setSelectedProcessingLocations] =
    useState<string[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const { register, handleSubmit, reset, setValue, watch } = useForm<IFilter>({
    defaultValues: {
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
      statuses: [],
      processingLocations: [],
    },
  });

  const fetchStatusesAndLocations = async () => {
    try {
      const [statusesResponse, locationsResponse] = await Promise.all([
        axiosInstance.get("/admin/statuses?onlyAllowed=true"),
        axiosInstance.get("/admin/shippings?onlyAllowed=true"),
      ]);
      if (!statusesResponse.data.data) throw new Error("No status data found");
      if (!locationsResponse.data.data)
        throw new Error("No location data found");

      const filteredStatuses = statusesResponse.data.data.filter(
        (status: IStatus) => status.level === 1
      );

      setStatuses(filteredStatuses);

      // Only set default selected statuses if we don't have URL params for them
      if (!searchParams.has("statuses")) {
        setSelectedStatuses(filteredStatuses.map((el: any) => el._id));
      }

      setProcessingLocations(locationsResponse.data.data);

      // Only set default selected locations if we don't have URL params for them
      if (!searchParams.has("processingLocations")) {
        setSelectedProcessingLocations(
          locationsResponse?.data?.data?.map((el: any) => el._id)
        );
      }

      // After fetching statuses and locations, populate form from URL if needed
      populateFormFromUrl();
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch statuses and processing locations");
    }
  };

  const populateFormFromUrl = () => {
    // Basic fields
    if (searchParams.has("startDate"))
      setValue("startDate", searchParams.get("startDate") || "");
    if (searchParams.has("endDate"))
      setValue("endDate", searchParams.get("endDate") || "");
    if (searchParams.has("startTime"))
      setValue("startTime", searchParams.get("startTime") || "");
    if (searchParams.has("endTime"))
      setValue("endTime", searchParams.get("endTime") || "");
    if (searchParams.has("caseId"))
      setValue("caseId", searchParams.get("caseId") || "");
    if (searchParams.has("phone"))
      setValue("phone", searchParams.get("phone") || "");
    if (searchParams.has("email"))
      setValue("email", searchParams.get("email") || "");
    if (searchParams.has("lastFourOfCC"))
      setValue("lastFourOfCC", searchParams.get("lastFourOfCC") || "");
    if (searchParams.has("applicantName"))
      setValue("applicantName", searchParams.get("applicantName") || "");

    // Arrays
    if (searchParams.has("statuses")) {
      const statusValues = searchParams.getAll("statuses");
      setSelectedStatuses(statusValues);
      setValue("statuses", statusValues);
    }

    if (searchParams.has("processingLocations")) {
      const locationValues = searchParams.getAll("processingLocations");
      setSelectedProcessingLocations(locationValues);
      setValue("processingLocations", locationValues);
    }

    setInitialLoad(false);
  };

  const handleStatusChange = (statusId: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleProcessingLocationChange = (locationId: string) => {
    setSelectedProcessingLocations((prev) =>
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId]
    );
  };

  const handleSelectAll = (type: "statuses" | "locations") => {
    if (type === "statuses") {
      setSelectedStatuses(statuses.map((status) => status._id));
    } else {
      setSelectedProcessingLocations(
        processingLocations.map((location) => location._id)
      );
    }
  };

  const handleDeselectAll = (type: "statuses" | "locations") => {
    if (type === "statuses") {
      setSelectedStatuses([]);
    } else {
      setSelectedProcessingLocations([]);
    }
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

  const handleClearFilters = () => {
    reset();
    setSelectedProcessingLocations(processingLocations.map((el) => el._id));
    setSelectedStatuses(statuses.map((el) => el._id));

    // Clear URL params by redirecting to the base search page
    router.push("/search");
  };

  const searchFunction = async (filters: IFilter) => {
    if (
      selectedStatuses.length === 0 ||
      selectedProcessingLocations.length === 0
    ) {
      toast.error(
        "Please select at least one status and one processing location"
      );
      return;
    }

    setLoading(true);

    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();

      // Add basic filters
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      if (filters.startTime) queryParams.append("startTime", filters.startTime);
      if (filters.endTime) queryParams.append("endTime", filters.endTime);
      if (filters.caseId) queryParams.append("caseId", filters.caseId);
      if (filters.phone) queryParams.append("phone", filters.phone);
      if (filters.email) queryParams.append("email", filters.email);
      if (filters.lastFourOfCC)
        queryParams.append("lastFourOfCC", filters.lastFourOfCC);
      if (filters.applicantName)
        queryParams.append("applicantName", filters.applicantName);

      // Add arrays
      selectedStatuses.forEach((status) => {
        queryParams.append("statuses", status);
      });

      selectedProcessingLocations.forEach((location) => {
        queryParams.append("processingLocations", location);
      });

      // Navigate to results page with query params
      router.push(`/search-results?${queryParams.toString()}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to process search");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusesAndLocations();
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      setValue("statuses", selectedStatuses);
      setValue("processingLocations", selectedProcessingLocations);
    }
  }, [selectedStatuses, selectedProcessingLocations, setValue, initialLoad]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-base md:text-2xl font-semibold">
          Search all cases
        </h1>
        {(Object.values(watch()).some((val) => val.length > 0) ||
          selectedProcessingLocations.length < processingLocations.length ||
          selectedStatuses.length < statuses.length) && (
          <div className="flex gap-2">
            <Button
              size={"sm"}
              onClick={handleClearFilters}
              variant={"outline"}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-6 md:px-32 mt-8">
        <form
          onSubmit={handleSubmit(searchFunction)}
          className="md:grid md:grid-cols-4 flex flex-col gap-6 w-full"
        >
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
              className="rounded-sm border-2 p-2 outline-none"
              onKeyDown={(e) => handleKeyPress(e, "number")}
              maxLength={10}
            />
          </div>

          <div className="flex flex-col md:gap-2">
            <label htmlFor="">Applicant name</label>
            <input
              {...register("applicantName")}
              placeholder="Enter Applicant name"
              type="text"
              className="rounded-sm border-2 p-2 outline-none"
            />
          </div>
          <div className="flex flex-col md:gap-2">
            <label htmlFor="email">Email</label>
            <input
              {...register("email")}
              id="email"
              placeholder="Enter Email"
              type="text"
              className="rounded-sm border-2 p-2 outline-none"
              maxLength={100}
            />
          </div>

          <div className="flex flex-col md:gap-2">
            <label htmlFor="lastFourOfCC">Last 4 of CC number</label>
            <input
              {...register("lastFourOfCC")}
              id="lastFourOfCC"
              placeholder="Enter Last 4 of CC number"
              type="text"
              className="rounded-sm border-2 p-2 outline-none"
              onKeyDown={(e) => handleKeyPress(e, "number")}
              maxLength={4}
            />
          </div>

          <div className="col-span-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="status">
                <AccordionTrigger className="flex w-full items-center justify-end">
                  <span className="flex font-semibold text-base md:text-lg mr-auto">
                    Search by Status
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-blue-600 mb-3 hover:text-blue-400 col-span-3 w-fit justify-end"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectedStatuses.length === statuses.length
                        ? handleDeselectAll("statuses")
                        : handleSelectAll("statuses");
                    }}
                    size="sm"
                  >
                    {selectedStatuses.length === statuses.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                  <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                    {statuses.map((status) => (
                      <div
                        key={status._id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={status._id}
                          checked={selectedStatuses.includes(status._id)}
                          onCheckedChange={() => handleStatusChange(status._id)}
                        />
                        <label
                          htmlFor={status._id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {status.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="col-span-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="processing-locations">
                <AccordionTrigger className="flex w-full items-center justify-end">
                  <span className="flex font-semibold text-base md:text-lg mr-auto">
                    Search by Processing Location{" "}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <Button
                    variant="ghost"
                    type="button"
                    className="text-blue-600 mb-3 hover:text-blue-400 col-span-3 w-fit justify-end"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectedProcessingLocations.length ===
                      processingLocations.length
                        ? handleDeselectAll("locations")
                        : handleSelectAll("locations");
                    }}
                    size="sm"
                  >
                    {selectedProcessingLocations.length ===
                    processingLocations.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                  <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                    {processingLocations.map((location) => (
                      <div
                        key={location._id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={location._id}
                          checked={selectedProcessingLocations.includes(
                            location._id
                          )}
                          onCheckedChange={() =>
                            handleProcessingLocationChange(location._id)
                          }
                        />
                        <label
                          htmlFor={location._id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {location.locationName}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="w-full col-span-4 flex justify-end">
            <Button
              disabled={
                loading ||
                selectedStatuses.length === 0 ||
                selectedProcessingLocations.length === 0
              }
              type="submit"
              size={"sm"}
              className="font-medium w-1/4 self-end"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Search"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
