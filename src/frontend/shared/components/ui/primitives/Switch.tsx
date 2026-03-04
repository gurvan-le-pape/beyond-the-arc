// src/frontend/shared/components/ui/primitives/Switch.tsx
import React, { forwardRef } from "react";

import { cn } from "@/shared/utils/cn";

export interface SwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Switch component - Toggle UI control
 *
 * Use for binary on/off states like settings, preferences, or feature flags.
 * For action buttons that switch context, use Button component instead.
 *
 * @example
 * <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
 * <Switch checked={showArchived} onCheckedChange={setShowArchived} label="Show archived" size="sm" />
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { checked, onCheckedChange, label, size = "md", className, ...props },
    ref,
  ) => {
    const sizes = {
      sm: {
        track: "h-5 w-9",
        thumb: "h-3.5 w-3.5",
        translate: "translate-x-5",
      },
      md: {
        track: "h-6 w-11",
        thumb: "h-4 w-4",
        translate: "translate-x-6",
      },
      lg: {
        track: "h-8 w-16",
        thumb: "h-6 w-6",
        translate: "translate-x-8",
      },
    };
    const s = sizes[size];

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        className={cn(
          "relative inline-flex items-center rounded-full transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          checked
            ? "bg-primary-600 dark:bg-primary-500"
            : "bg-gray-300 dark:bg-gray-600",
          s.track,
          className,
        )}
        onClick={() => onCheckedChange(!checked)}
        {...props}
      >
        <span
          className={cn(
            "inline-block rounded-full bg-white shadow-sm transition-transform",
            s.thumb,
            checked ? s.translate : "translate-x-1",
          )}
        />
        {label && (
          <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
        )}
      </button>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
