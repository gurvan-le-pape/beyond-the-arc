// src/frontend/shared/components/ui/forms/DebouncedInput.tsx
"use client";

import { forwardRef, useEffect, useRef, useState } from "react";

import { Input, type InputProps } from "./Input";

/**
 * DebouncedInput component
 * Maintains local state for immediate UI updates while debouncing the actual value change
 * Preserves focus during typing
 */
export interface DebouncedInputProps
  extends Omit<InputProps, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export const DebouncedInput = forwardRef<HTMLInputElement, DebouncedInputProps>(
  ({ value: initialValue, onChange, debounceMs = 400, ...props }, ref) => {
    // Local state for the input value (updates immediately)
    const [localValue, setLocalValue] = useState(initialValue);

    // Keep track of the timeout
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Update local value when external value changes (e.g., on reset)
    useEffect(() => {
      setLocalValue(initialValue);
    }, [initialValue]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Update local state immediately (no lag in typing)
      setLocalValue(newValue);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to update the actual value
      timeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounceMs);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <Input ref={ref} {...props} value={localValue} onChange={handleChange} />
    );
  },
);

DebouncedInput.displayName = "DebouncedInput";
