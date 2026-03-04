// src/frontend/shared/components/ui/forms/SearchInput.tsx
import { forwardRef } from "react";

import { Input, type InputProps } from "./Input";

/**
 * SearchInput component - specialized Input for search/filter functionality
 * Includes a search icon by default
 */
export interface SearchInputProps
  extends Omit<InputProps, "leftIcon" | "type"> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        leftIcon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        rightIcon={
          value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";
