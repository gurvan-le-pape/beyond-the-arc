// src/frontend/shared/components/forms/DebouncedInput.tsx
"use client";

import { useEffect, useRef, useState } from "react";

import { Input, type InputProps } from "./Input";

export interface DebouncedInputProps extends Omit<InputProps, "onChange"> {
  onChange: (value: string) => void;
  debounceMs?: number;
}

export const DebouncedInput = ({
  value: externalValue,
  onChange,
  debounceMs = 400,
  ref,
  ...props
}: DebouncedInputProps) => {
  const [localValue, setLocalValue] = useState(externalValue ?? "");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync local value when external value changes (e.g. filter reset)
  useEffect(() => {
    setLocalValue(externalValue ?? "");
  }, [externalValue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChange(newValue), debounceMs);
  };

  // When variant="search" and onClear is provided, clear both local state
  // and the external value immediately (no debounce on clear — it's instant).
  const handleClear = props.onClear
    ? () => {
        setLocalValue("");
        clearTimeout(timeoutRef.current);
        onChange("");
        props.onClear?.();
      }
    : undefined;

  return (
    <Input
      ref={ref}
      {...props}
      value={localValue}
      onChange={handleChange}
      onClear={handleClear}
    />
  );
};
