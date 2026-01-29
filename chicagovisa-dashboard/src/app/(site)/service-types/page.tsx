"use client";
import React from "react";
import ServiceTypeTable from "@/components/pages/service-type/service-type-table";
import LoadingPage from "@/components/globals/LoadingPage";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useServiceTypes } from "@/components/pages/service-type/useServiceTypes";

const ServiceTypesPage = () => {
  const {
    loading,
    showArchived,
    setShowArchived,
    selectedFilter,
    setSelectedFilter,
    selectedOrigin,
    setSelectedOrigin,
    evisaFilter,
    setEvisaFilter,
    open,
    setOpen,
    openOrigin,
    setOpenOrigin,
    openEvisa,
    setOpenEvisa,
    countryPairs,
    uniqueOrigins,
    counts,
    displayList,
    fetchData,
    getPairLabel,
    getOriginLabel,
    getEvisaLabel,
  } = useServiceTypes();

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">Visa Types</h1>
              <p className="text-muted-foreground text-sm">
                Manage your visa service offerings
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full xl:w-auto">

              {/* Origin Filter */}
              <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openOrigin}
                    className={cn(
                      "w-full lg:w-[200px] justify-between",
                      selectedOrigin !== "all" && "border-primary text-primary bg-primary/5"
                    )}
                  >
                    <span className="truncate">{getOriginLabel(selectedOrigin)}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search origin..." />
                    <CommandList>
                      <CommandEmpty>No origin found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedOrigin("all");
                            setOpenOrigin(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedOrigin === "all"
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          All Origins
                        </CommandItem>
                        {uniqueOrigins.map((origin) => (
                          <CommandItem
                            key={origin.code}
                            value={origin.name}
                            onSelect={() => {
                              setSelectedOrigin(origin.code);
                              setSelectedFilter("all"); // Reset Pair filter
                              setOpenOrigin(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedOrigin === origin.code
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {origin.name} ({counts[`origin-${origin.code}`] || 0})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>


              {/* Pair Filter */}
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full lg:w-[250px] justify-between",
                      selectedFilter !== "all" && selectedOrigin === "all" && "border-primary text-primary bg-primary/5"
                    )}
                  >
                    <span className="truncate">{getPairLabel(selectedFilter)}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                  <Command>
                    <CommandInput placeholder="Search country pair..." />
                    <CommandList>
                      <CommandEmpty>No country pair found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedFilter("all");
                            setSelectedOrigin("all"); // Reset Origin filter too if they pick 'All' here
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedFilter === "all"
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          All ({counts["all"]})
                        </CommandItem>
                        {countryPairs.map((pair) => (
                          <CommandItem
                            key={pair._id}
                            value={`${pair.fromCountryName} ${pair.toCountryName} ${pair._id}`}
                            onSelect={() => {
                              setSelectedFilter(pair._id);
                              setSelectedOrigin("all"); // Reset Origin
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedFilter === pair._id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {pair.fromCountryName} → {pair.toCountryName} (
                            {counts[pair._id] || 0})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* E-Visa Filter */}
              <Popover open={openEvisa} onOpenChange={setOpenEvisa}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openEvisa}
                    className={cn(
                      "w-full lg:w-[150px] justify-between",
                      evisaFilter !== "all" && "border-primary text-primary bg-primary/5"
                    )}
                  >
                    <span className="truncate">{getEvisaLabel(evisaFilter)}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[150px] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setEvisaFilter("all");
                            setOpenEvisa(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              evisaFilter === "all" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          All ({counts["all"]})
                        </CommandItem>
                        <CommandItem
                          value="evisa"
                          onSelect={() => {
                            setEvisaFilter("evisa");
                            setOpenEvisa(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              evisaFilter === "evisa" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          E-Visa ({counts["evisa"] || 0})
                        </CommandItem>
                        <CommandItem
                          value="standard"
                          onSelect={() => {
                            setEvisaFilter("standard");
                            setOpenEvisa(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              evisaFilter === "standard" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          Standard ({counts["standard"] || 0})
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Link href={"/service-types/add-service-type"}>
                <Button size="sm" className="whitespace-nowrap">Add Visa Type</Button>
              </Link>
            </div>
          </div>

          <div className="bg-background rounded-lg  shadow-sm">
            <ServiceTypeTable
              refetch={fetchData}
              serviceTypes={displayList}
              showArchived={showArchived}
              setShowArchived={setShowArchived}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTypesPage;
