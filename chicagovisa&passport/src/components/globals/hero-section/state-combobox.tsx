"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { US_STATES } from "@/data/countries";

interface StateComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function StateCombobox({
  value,
  onValueChange,
  placeholder = "Select state...",
  label,
}: StateComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedState = US_STATES.find((state) => state.code === value);

  const handleSelect = React.useCallback(
    (stateCode: string) => {
      onValueChange(stateCode);
      setOpen(false);
    },
    [onValueChange]
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full justify-between flex items-center border rounded-md px-3 py-2 text-sm h-10 bg-white hover:bg-gray-50",
              !value && "text-gray-400"
            )}
          >
            {selectedState ? (
              <span className="truncate">{selectedState.name}</span>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 bg-white" align="start">
          <Command>
            <CommandInput placeholder="Search state..." />
            <CommandList>
              <CommandEmpty>No state found.</CommandEmpty>
              <CommandGroup>
                {US_STATES.map((state) => (
                  <CommandItem
                    key={state.code}
                    value={state.name}
                    onSelect={() => handleSelect(state.code)}
                    onClick={() => handleSelect(state.code)}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleSelect(state.code);
                    }}
                    className="cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center w-full pointer-events-none">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          state.code === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {state.name}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
