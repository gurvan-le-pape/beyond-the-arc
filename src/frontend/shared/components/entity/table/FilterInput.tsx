// src/frontend/shared/components/entity/table/FilterInput.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  showPendingIndicator?: boolean; // Optional: show when debouncing
}

/**
 * FilterInput component with built-in debouncing and optional pending indicator
 * Maintains focus while typing and only triggers onChange after user stops typing
 */
export const FilterInput: React.FC<FilterInputProps> = ({
  value,
  onChange,
  placeholder,
  debounceMs = 400,
  showPendingIndicator = false,
}) => {
  const t = useTranslations("common");

  // Local state for immediate UI updates (preserves focus)
  const [localValue, setLocalValue] = useState(value);

  // Track if we're waiting for debounce to complete
  const [isPending, setIsPending] = useState(false);

  // Ref to track the debounce timeout
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Update local value when external value changes (e.g., reset filters)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle input change with debouncing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Update local state immediately (no lag)
    setLocalValue(newValue);

    // Show pending indicator
    setIsPending(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to trigger onChange
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
      setIsPending(false);
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
    <div className="relative w-full">
      <input
        type="text"
        value={localValue || ""}
        onChange={handleChange}
        placeholder={placeholder || t("table.filter")}
        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition text-center min-w-[120px]"
      />

      {/* Optional pending indicator */}
      {showPendingIndicator && isPending && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <svg
            className="animate-spin h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default FilterInput;
