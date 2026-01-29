"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Control } from "react-hook-form";
import { type ServiceTypeWithCountryPair } from "./use-service-level-form";

interface CountryPair {
  _id: string;
  fromCountryName: string;
  toCountryName: string;
  fromCountryCode: string;
  toCountryCode: string;
}

interface Step2VisaTypesProps {
  control: Control<any>;
  serviceTypes: ServiceTypeWithCountryPair[];
  countryPairs: CountryPair[];
  selectedServiceTypes: string[];
  handleServiceTypeChange: (
    typeId: string,
    checked: boolean,
    currentValues: string[]
  ) => string[];
  getServiceTypeLabel: (type: ServiceTypeWithCountryPair) => string;
  handleBack: () => void;
  isSubmitting: boolean;
  isTransitioning: boolean;
  currentStep: number;
}

const Step2VisaTypes: React.FC<Step2VisaTypesProps> = ({
  control,
  serviceTypes,
  countryPairs,
  selectedServiceTypes,
  handleServiceTypeChange,
  getServiceTypeLabel,
  handleBack,
  isSubmitting,
  isTransitioning,
  currentStep,
}) => {
  // Local state for Step 2 UI
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCountryPairId, setActiveCountryPairId] = useState<string | null>(
    null
  );

  // Compute counts for badges
  const selectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    selectedServiceTypes?.forEach((typeId) => {
      const type = serviceTypes.find((t) => t._id === typeId);
      if (type?.countryPair?._id) {
        counts[type.countryPair._id] = (counts[type.countryPair._id] || 0) + 1;
      }
    });
    return counts;
  }, [selectedServiceTypes, serviceTypes]);

  // Filter country pairs based on search
  const filteredCountryPairs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return countryPairs.filter(
      (cp) =>
        cp.fromCountryName.toLowerCase().includes(query) ||
        cp.toCountryName.toLowerCase().includes(query) ||
        cp.fromCountryCode.toLowerCase().includes(query) ||
        cp.toCountryCode.toLowerCase().includes(query)
    );
  }, [countryPairs, searchQuery]);

  // Auto-select "ALL" initially
  React.useEffect(() => {
    if (!activeCountryPairId && filteredCountryPairs.length > 0) {
      setActiveCountryPairId("ALL");
    }
  }, [filteredCountryPairs, activeCountryPairId]);

  // Get visa types for active country pair or "ALL"
  const activeVisaTypes = useMemo(() => {
    let filtered: ServiceTypeWithCountryPair[] = [];
    if (activeCountryPairId === "ALL") {
      filtered = serviceTypes;
    } else {
      filtered = serviceTypes.filter(
        (type) => type.countryPair?._id === activeCountryPairId
      );
    }

    // Sort: Selected first
    return filtered.sort((a, b) => {
      const isASelected = selectedServiceTypes?.includes(a._id) ? 1 : 0;
      const isBSelected = selectedServiceTypes?.includes(b._id) ? 1 : 0;
      return isBSelected - isASelected;
    });
  }, [serviceTypes, activeCountryPairId, selectedServiceTypes]);

  const activeCountryPair = countryPairs.find(
    (cp) => cp._id === activeCountryPairId
  );

  return (
    <div
      className={cn(
        "transition-all duration-150 ease-in-out",
        isTransitioning && "opacity-0",
        currentStep === 2 ? "block" : "hidden"
      )}
    >
      <div className="mb-4 text-center text-sm text-muted-foreground">
        Step 2: Select Visa Types
      </div>

      <div className="flex h-[500px] flex-col overflow-hidden rounded-md border md:flex-row">
        {/* Left Sidebar: Country Pairs */}
        <div className="flex flex-col border-b bg-muted/20 md:w-1/3 md:border-b-0 md:border-r">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search countries..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="px-2 pb-2">
              {/* "All" Option */}
              <div
                onClick={() => setActiveCountryPairId("ALL")}
                className={cn(
                  "mb-1 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  activeCountryPairId === "ALL"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground"
                )}
              >
                <span>All</span>
                {selectedServiceTypes?.length > 0 && (
                  <Badge variant={activeCountryPairId === "ALL" ? "secondary" : "default"} className="ml-2 h-5 px-1.5 text-xs">
                    {selectedServiceTypes.length}
                  </Badge>
                )}
              </div>

              {filteredCountryPairs.map((cp) => {
                const count = selectedCounts[cp._id] || 0;
                const isActive = activeCountryPairId === cp._id;
                return (
                  <div
                    key={cp._id}
                    onClick={() => setActiveCountryPairId(cp._id)}
                    className={cn(
                      "group mb-1 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-foreground",
                      !isActive && count > 0 && "bg-muted/50"
                    )}
                    title={`${cp.fromCountryName} → ${cp.toCountryName}`}
                  >
                    <span className="truncate">
                      {cp.fromCountryCode} → {cp.toCountryCode}
                    </span>
                    {count > 0 && (
                      <Badge
                        variant={isActive ? "secondary" : "default"}
                        className="ml-2 h-5 px-1.5 text-xs"
                      >
                        {count}
                      </Badge>
                    )}
                  </div>
                );
              })}
              {filteredCountryPairs.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No country pairs found.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Content: Visa Types */}
        <div className="flex flex-1 flex-col bg-background">
          <div className="border-b px-4 py-3">
            <h3 className="font-semibold">
              {activeCountryPairId === "ALL" ? "All Visa Types" :
                activeCountryPair
                  ? `${activeCountryPair.fromCountryName} to ${activeCountryPair.toCountryName}`
                  : "Select Pair"}
            </h3>
            <p className="text-xs text-muted-foreground">
              Select available visa types below
            </p>
          </div>
          <ScrollArea className="flex-1 p-4">
            <FormField
              control={control}
              name="serviceTypes"
              render={({ field }) => (
                <div className="grid grid-cols-1 gap-3">
                  {activeVisaTypes.length > 0 ? (
                    activeVisaTypes.map((type) => {
                      const isSelected = (field.value || []).includes(type._id);
                      // Abbreviation generation: First letter of each word
                      const abbr = type.serviceType.split(' ').map(w => w[0]).join('').toUpperCase();

                      return (
                        <div
                          key={type._id}
                          className={cn(
                            "flex items-center space-x-3 rounded-md border p-1 transition-colors hover:bg-muted/50",
                            isSelected && "border-primary/50 bg-primary/5"
                          )}
                        >
                          <Checkbox
                            id={`st-${type._id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              const newValues = handleServiceTypeChange(
                                type._id,
                                !!checked,
                                field.value
                              );
                              field.onChange(newValues);
                            }}
                          />
                          <div className="grid gap-1.5 leading-none w-full">
                            <Label
                              htmlFor={`st-${type._id}`}
                              className="cursor-pointer font-medium flex justify-between w-full"
                            >
                              <div>
                                {type.serviceType} <span className="text-muted-foreground">({abbr})</span>
                              </div>
                              {activeCountryPairId === "ALL" && (
                                <p className="text-xs text-muted-foreground">
                                  {getServiceTypeLabel(type)}
                                </p>
                              )}
                            </Label>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
                      <p>No visa types available.</p>
                    </div>
                  )}
                </div>
              )}
            />
          </ScrollArea>
        </div>
      </div>

      {selectedServiceTypes?.length > 0 && (
        <div className="mt-4 rounded-md border bg-muted/50 p-3">
          <p className="text-center text-sm font-medium">
            Total Selected: {selectedServiceTypes.length} visa type(s)
          </p>
        </div>
      )}

      <div className="mt-4 flex justify-center gap-3">
        <Button type="button" variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default Step2VisaTypes;
