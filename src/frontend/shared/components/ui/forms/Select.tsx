// src/frontend/shared/components/ui/forms/Select.tsx
import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

/**
 * Select component for consistent dropdown styling
 */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, children, ...props }, ref) => {
    const selectId =
      id || `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="block text-body-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}

        {/* Select */}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full px-4 py-2.5 rounded-input",
            "border border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-800",
            "text-body text-gray-900 dark:text-gray-100",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-200",
            error &&
              "border-error-DEFAULT focus:ring-error-DEFAULT focus:border-error-DEFAULT",
            className,
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? `${selectId}-error`
              : helperText
              ? `${selectId}-helper`
              : undefined
          }
          {...props}
        >
          {children}
        </select>

        {/* Error message */}
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-2 text-body-sm text-error-DEFAULT dark:text-error-light"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p
            id={`${selectId}-helper`}
            className="mt-2 text-body-sm text-gray-600 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
