"use client";
import { useMemo, useState } from "react";
import { CustomTable } from "@/components/globals/custom-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ServiceLevelForm from "@/components/pages/service-level/modal-form/service-level-form";
import LoadingPage from "@/components/globals/LoadingPage";
import { Switch } from "@/components/ui/switch";
import { useServiceLevel } from "@/components/pages/service-level/use-service-level";
import { getServiceLevelColumns } from "@/components/pages/service-level/table/service-level-columns";
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

const ServiceLevel = () => {
  const {
    filteredServiceLevels,
    loading,
    open,
    setOpen,
    showArchived,
    setShowArchived,
    selectedServiceType,
    setSelectedServiceType,
    serviceTypeOptions,
    addNewService,
    handleEdit,
    handleToggleActive,
    fetchData,
  } = useServiceLevel();


  const [comboboxOpen, setComboboxOpen] = useState(false);

  const columns = useMemo(
    () =>
      getServiceLevelColumns({
        handleEdit,
        handleToggleActive,
        fetchData,
      }),
    [handleEdit, handleToggleActive, fetchData]
  );

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div>
      <div className="mb-4 flex w-full flex-col justify-between gap-2 md:flex-row md:gap-0">
        <h1 className="text-xl font-semibold md:text-2xl">Service Level</h1>
        <div className="flex items-center gap-4">
          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={comboboxOpen}
                className="w-[200px] justify-between"
              >
                {selectedServiceType === "all"
                  ? "All Service Types"
                  : serviceTypeOptions.find(
                    (option) => option.value === selectedServiceType
                  )?.label ?? "All Service Types"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search service type..." />
                <CommandList>
                  <CommandEmpty>No service type found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        setSelectedServiceType("all");
                        setComboboxOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedServiceType === "all"
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      All Service Types
                    </CommandItem>
                    {serviceTypeOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => {
                          setSelectedServiceType(option.value);
                          setComboboxOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedServiceType === option.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.label}
                        <span className="text-xs text-muted-foreground">
                          {" "}({option.fromCountryCode} {"->"} {option.toCountryCode})
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="max-w-max">Add New Service Level</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full">
              <div className="p-2">
                <ServiceLevelForm submitFunction={addNewService} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <CustomTable
        paginate={false}
        columns={columns}
        data={filteredServiceLevels}
        showColumnFilter={true}
        showSearchBar={true}
        searchKeys={["serviceLevel", "time", "price"]}
      >
        <div className="flex items-center space-x-2 mr-2">
          <Switch
            id="archived-mode"
            checked={showArchived}
            onCheckedChange={setShowArchived}
          />
          <label htmlFor="archived-mode" className="text-sm font-medium">
            Show Archived
          </label>
        </div>
      </CustomTable>
    </div>
  );
};

export default ServiceLevel;
