// src/frontend/shared/components/primitives/Switch.tsx
import React, { forwardRef } from "react";

import { cn } from "@/shared/utils";

export interface SwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Switch — binary toggle control.
 *
 * Use for on/off settings and preferences. For context-switching actions
 * (e.g. toggling between two views) use Button instead.
 *
 * The label renders inside the <button> so clicking it also activates the
 * switch — this is intentional and correct for this pattern.
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
        translate: "translate-x-4",
      },
      md: {
        track: "h-6 w-11",
        thumb: "h-4 w-4",
        translate: "translate-x-6",
      },
      lg: {
        track: "h-8 w-16",
        thumb: "h-6 w-6",
        translate: "translate-x-9",
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
          "relative inline-flex shrink-0 items-center rounded-full transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary",
          "focus:ring-offset-2 ring-offset-surface",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary" : "bg-divide",
          s.track,
          className,
        )}
        onClick={() => onCheckedChange(!checked)}
        {...props}
      >
        <span
          className={cn(
            "inline-block rounded-full bg-surface-raised shadow-sm transition-transform",
            s.thumb,
            checked ? s.translate : "translate-x-1",
          )}
        />
        {label && (
          <span className="ml-3 text-sm font-medium text-text-emphasis">
            {label}
          </span>
        )}
      </button>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;
