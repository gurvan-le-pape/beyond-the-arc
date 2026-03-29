// src/frontend/shared/components/ui/forms/Input.tsx
import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

/**
 * Input component for consistent text input styling
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      type = "text",
      ...props
    },
    ref,
  ) => {
    const inputId =
      id || `input-${label?.toLowerCase().replaceAll(/\s+/g, "-")}`;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-text-emphasis dark:text-text-emphasis-dark mb-2"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted dark:text-text-muted-dark">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              "w-full px-4 py-2.5 rounded-input",
              "border border-divide-light dark:border-divide-dark",
              "bg-surface-raised dark:bg-surface-raised-dark",
              "text-text-heading dark:text-text-heading-dark",
              "placeholder:text-text-muted dark:placeholder:text-text-muted-dark",
              "focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-200",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-error focus:ring-error focus:border-error",
              className,
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-muted dark:text-text-muted-dark">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-sm text-text-body dark:text-text-body-dark"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
