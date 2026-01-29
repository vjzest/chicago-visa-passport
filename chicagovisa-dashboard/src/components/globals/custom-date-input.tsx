import React, { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";

interface CustomDateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomDateInput: React.FC<CustomDateInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize input value from form value
  useEffect(() => {
    // Only update local state if the form value is different
    if (value && value !== inputValue) {
      // Validate if it's in mm/dd/yyyy format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        setInputValue(value);
      }
    } else if (!value && inputValue) {
      // Clear local state if form value is cleared
      setInputValue("");
    }
  }, [value, inputValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;

    // Early return if max length reached
    if (rawInput.length > 10) return;

    // Allow only numbers and slashes
    if (!/^[\d/]*$/.test(rawInput)) return;

    // Handle formatting
    let formattedValue = rawInput;

    // Auto-insert slashes if needed
    if (
      // Add slash after MM if not present
      (rawInput.length === 2 && !rawInput.includes("/")) ||
      // User typed a digit after MM without slash
      (rawInput.length === 3 && rawInput.indexOf("/") === -1)
    ) {
      formattedValue = rawInput.slice(0, 2) + "/" + rawInput.slice(2);
    } else if (
      // Add slash after DD if not present
      (rawInput.length === 5 &&
        rawInput.indexOf("/") === 2 &&
        rawInput.lastIndexOf("/") === 2) ||
      // User typed a digit after DD without slash
      (rawInput.length === 6 &&
        rawInput.indexOf("/") === 2 &&
        rawInput.lastIndexOf("/") === 2)
    ) {
      formattedValue = rawInput.slice(0, 5) + "/" + rawInput.slice(5);
    }

    // Prevent more than 2 slashes
    const slashCount = (formattedValue.match(/\//g) || []).length;
    if (slashCount > 2) return;

    // Update local state
    setInputValue(formattedValue);

    // Update form value only when we have a complete valid date
    const isComplete = /^\d{2}\/\d{2}\/\d{4}$/.test(formattedValue);

    // Always pass the current formatted value to the form
    // This ensures incomplete values are tracked too
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: isComplete ? formattedValue : formattedValue,
      },
    };

    onChange(newEvent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace specifically
    if (e.key === "Backspace") {
      const input = e.currentTarget;
      const cursorPos = input.selectionStart || 0;
      const selectionEnd = input.selectionEnd || 0;
      const hasSelection = cursorPos !== selectionEnd;

      // If there's text selected, handle selection deletion
      if (hasSelection) {
        e.preventDefault();

        // Create new value with the selected text removed
        const newValue =
          inputValue.substring(0, cursorPos) +
          inputValue.substring(selectionEnd);

        // Update state
        setInputValue(newValue);

        // Update form value
        const newEvent = {
          target: {
            name: input.name,
            value: newValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(newEvent);

        // Restore cursor at the start of selection
        if (inputRef.current) {
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.selectionStart = cursorPos;
              inputRef.current.selectionEnd = cursorPos;
            }
          }, 0);
        }

        return;
      }

      // If no selection, handle single character deletion (existing code)
      if (cursorPos > 0) {
        e.preventDefault(); // Prevent default backspace behavior

        // Handle backspace at different positions
        let newValue = inputValue;
        let newCursorPos = cursorPos - 1;

        // If cursor is right after a slash, remove both the slash and the character before it
        if (inputValue[cursorPos - 1] === "/" && cursorPos > 1) {
          newValue =
            inputValue.substring(0, cursorPos - 2) +
            inputValue.substring(cursorPos);
          newCursorPos = cursorPos - 2;
        } else {
          // Normal character deletion
          newValue =
            inputValue.substring(0, cursorPos - 1) +
            inputValue.substring(cursorPos);
          newCursorPos = cursorPos - 1;
        }

        // Update state
        setInputValue(newValue);

        // Update form value regardless of completeness
        // This ensures we don't lose partial values when backspacing
        const newEvent = {
          target: {
            name: e.currentTarget.name,
            value: newValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(newEvent);

        // Set cursor position safely
        if (inputRef.current) {
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.selectionStart = newCursorPos;
              inputRef.current.selectionEnd = newCursorPos;
            }
          }, 0);
        }
      }
    }
  };

  return (
    <Input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="MM/DD/YYYY"
      maxLength={10}
      {...props}
    />
  );
};

export default CustomDateInput;
