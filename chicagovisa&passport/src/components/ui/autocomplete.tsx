import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

interface AutoCompleteProps {
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  placeholder: string;
  value: string;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  options,
  onValueChange,
  placeholder,
  value,
}) => {
  const [open, setOpen] = useState(false);

  if (!Array.isArray(options)) {
    console.error("Options is not an array:", options);
    return null; // or return a fallback UI
  }

  return (
    <Command>
      <CommandInput
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
      />
      <CommandGroup>
        {options.map((option) => (
          <CommandItem
            key={option.value}
            onSelect={() => onValueChange(option.value)}
          >
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
};

export default AutoComplete;
