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
import { countries } from "@/data/countries";

interface CountryComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function CountryCombobox({
  value,
  onValueChange,
  placeholder = "Select country...",
  label,
}: CountryComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedCountry = countries.find((country) => country.code === value);

  const handleSelect = React.useCallback(
    (countryCode: string) => {
      onValueChange(countryCode);
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
            {selectedCountry ? (
              <span className="truncate">{selectedCountry.name}</span>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 bg-white" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.name}
                    onSelect={() => handleSelect(country.code)}
                    onClick={() => handleSelect(country.code)}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleSelect(country.code);
                    }}
                    className="cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center w-full pointer-events-none">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          country.code === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {country.name}
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
