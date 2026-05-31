// src/frontend/shared/components/primitives/StatPill.tsx
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/shared/utils";

export interface StatPillProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
}

/**
 * StatPill — a vertically stacked stat display with a value and an overline label.
 *
 * @example
 * <StatPill label="PTS" value="21.4" />
 * <StatPill label="REB" value="7.4" className="text-primary" />
 */
export const StatPill = forwardRef<HTMLDivElement, StatPillProps>(
  ({ label, value, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center gap-0.5", className)}
        {...props}
      >
        <span className="text-base font-semibold text-text-emphasis">
          {value}
        </span>
        <span className="text-[10px] font-bold tracking-widest uppercase text-text-muted">
          {label}
        </span>
      </div>
    );
  },
);

StatPill.displayName = "StatPill";
