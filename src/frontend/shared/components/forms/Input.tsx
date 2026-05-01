// src/frontend/shared/components/forms/Input.tsx
import { forwardRef, type InputHTMLAttributes, useId } from "react";

import { cn } from "@/shared/utils/cn";

import { Text } from "../typography";

// ---------------------------------------------------------------------------
// Search icon — only rendered when variant="search"
// ---------------------------------------------------------------------------

function SearchIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Clear button — only rendered when variant="search" + value + onClear
// ---------------------------------------------------------------------------

function ClearButton({
  onClick,
  ariaLabel,
}: {
  readonly onClick: () => void;
  readonly ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer hover:text-text-body dark:hover:text-text-body-dark transition-colors"
      aria-label={ariaLabel}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  // rightIcon accepts interactive elements (e.g. clear button).
  // Decorative-only icons should set pointer-events-none on themselves.
  rightIcon?: React.ReactNode;
  // variant="search" auto-injects the search icon (left) and clear button
  // (right, when value is non-empty and onClear is provided).
  // All other Input props still apply — label, error, helperText, disabled etc.
  variant?: "default" | "search";
  // Only meaningful when variant="search". Passed to the clear button's aria-label.
  // Defaults to "Clear" — override when context requires a specific label.
  onClear?: () => void;
  clearAriaLabel?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = "default",
      onClear,
      clearAriaLabel = "Clear",
      value,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    // Search variant injects its own icons unless the caller explicitly
    // overrides them. Explicit props always win.
    const resolvedLeftIcon =
      leftIcon ?? (variant === "search" ? <SearchIcon /> : undefined);

    const resolvedRightIcon =
      rightIcon ??
      (variant === "search" && value && onClear ? (
        <ClearButton onClick={onClear} ariaLabel={clearAriaLabel} />
      ) : undefined);

    let ariaDescribedBy: string | undefined;
    if (error) {
      ariaDescribedBy = `${inputId}-error`;
    } else if (helperText) {
      ariaDescribedBy = `${inputId}-helper`;
    }

    return (
      <div className="w-full">
        {label && (
          <Text
            variant="label"
            as="label"
            htmlFor={inputId}
            className="mb-2 block"
          >
            {label}
          </Text>
        )}

        <div className="relative">
          {/* Left icon — always decorative, never interactive */}
          {resolvedLeftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted dark:text-text-muted-dark">
              {resolvedLeftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            className={cn(
              "h-9 w-full rounded-input px-4 border text-sm",
              "border border-divide-light dark:border-divide-dark",
              "bg-surface-raised dark:bg-surface-raised-dark",
              "text-text-heading dark:text-text-heading-dark",
              "placeholder:text-text-muted dark:placeholder:text-text-muted-dark",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors duration-200",
              resolvedLeftIcon && "pl-10",
              resolvedRightIcon && "pr-10",
              error && "border-error focus:ring-error focus:border-error",
              className,
            )}
            aria-describedby={ariaDescribedBy}
            aria-invalid={error ? "true" : undefined}
            {...props}
          />

          {/* Right icon — may be interactive. No pointer-events-none here. */}
          {resolvedRightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted dark:text-text-muted-dark">
              {resolvedRightIcon}
            </div>
          )}
        </div>

        {error && (
          <Text
            variant="caption"
            as="p"
            id={`${inputId}-error`}
            className="mt-1.5 text-error"
            role="alert"
          >
            {error}
          </Text>
        )}

        {helperText && !error && (
          <Text
            variant="caption"
            as="p"
            id={`${inputId}-helper`}
            className="mt-1.5"
          >
            {helperText}
          </Text>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
