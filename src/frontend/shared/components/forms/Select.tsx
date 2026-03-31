// src/frontend/shared/components/forms/Select.tsx
import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

import { Text } from "../typography";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, children, ...props }, ref) => {
    const selectId =
      id || `select-${label?.toLowerCase().replaceAll(/\s+/g, "-")}`;

    let ariaDescribedBy: string | undefined;
    if (error) {
      ariaDescribedBy = `${selectId}-error`;
    } else if (helperText) {
      ariaDescribedBy = `${selectId}-helper`;
    }

    return (
      <div className="w-full">
        {label && (
          <Text
            variant="label"
            as="label"
            htmlFor={selectId}
            className="mb-2 block"
          >
            {label}
          </Text>
        )}

        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full px-4 py-2.5 rounded-input",
            "border border-divide-light dark:border-divide-dark",
            "bg-surface-raised dark:bg-surface-raised-dark",
            // text-body was not a valid Tailwind class — removed.
            // text-text-heading already sets the color correctly.
            "text-text-heading dark:text-text-heading-dark",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-200",
            // error-DEFAULT is a Tailwind internal suffix, never use it in
            // class strings. The config defines `error` as the default stop,
            // so `border-error` and `text-error` are the correct classes.
            error && "border-error focus:ring-error focus:border-error",
            className,
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={ariaDescribedBy}
          {...props}
        >
          {children}
        </select>

        {error && (
          <Text
            variant="caption"
            as="p"
            id={`${selectId}-error`}
            className="mt-2 text-error dark:text-error-light"
            role="alert"
          >
            {error}
          </Text>
        )}

        {helperText && !error && (
          <Text
            variant="caption"
            as="p"
            id={`${selectId}-helper`}
            className="mt-2"
          >
            {helperText}
          </Text>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
