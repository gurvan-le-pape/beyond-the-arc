// src/frontend/shared/components/primitives/Badge.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";

import { cn } from "@/shared/utils";

/**
 * Badge variants for team categories, statuses, etc.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-button border text-xs font-semibold transition-colors duration-200 focus-ring",
  {
    variants: {
      variant: {
        default: "border-transparent bg-surface-subtle text-text-heading",
        primary: "border-transparent bg-tint-primary text-ink-primary",
        secondary: "border-transparent bg-tint-secondary text-ink-secondary",
        success: "border-transparent bg-tint-success text-ink-success",
        error: "border-transparent bg-tint-error text-ink-error",
        warning: "border-transparent bg-tint-warning text-ink-warning",
        info: "border-transparent bg-tint-info text-ink-info",
        outline: "border-divide text-text-emphasis",
        // Team-specific
        male: "border-transparent bg-tint-male text-ink-male",
        female: "border-transparent bg-tint-female text-ink-female",
        // Domain entity-specific
        players: "border-transparent bg-tint-players text-ink-players",
        teams: "border-transparent bg-tint-teams text-ink-teams",
        matches: "border-transparent bg-tint-matches text-ink-matches",
        // Competition level-specific (standalone, on neutral surface)
        national: "border-transparent bg-tint-national text-ink-national",
        regional: "border-transparent bg-tint-regional text-ink-regional",
        departmental:
          "border-transparent bg-tint-departmental text-ink-departmental",
        // Competition level-specific, on a card header filled with the
        // level's colour, where the plain variant would vanish into the fill:
        // the plain variant's ink and tint swapped, so its contrast is the
        // same pair the roles already guarantee.
        "national-on-header":
          "border-transparent bg-ink-national text-tint-national",
        "regional-on-header":
          "border-transparent bg-ink-regional text-tint-regional",
        "departmental-on-header":
          "border-transparent bg-ink-departmental text-tint-departmental",
        category: "border-transparent bg-tint-category text-ink-category",
        division: "border-transparent bg-tint-division text-ink-division",
        pool: "border-transparent bg-tint-pool text-ink-pool",

        "position-g":
          "border-transparent bg-tint-position-g text-ink-position-g",
        "position-f":
          "border-transparent bg-tint-position-f text-ink-position-f",
        "position-c":
          "border-transparent bg-tint-position-c text-ink-position-c",
      },
      size: {
        sm: "px-2 py-0.5",
        md: "px-2.5 py-0.5",
        lg: "px-3 py-1",
        /**
         * overline — for label-style badges that use uppercase tracking.
         * Overrides font-semibold with font-bold and adds uppercase + wide tracking.
         * Use when the badge reads as a section label rather than a status pill.
         *
         * @example
         * <Badge variant="primary" size="overline">Players</Badge>
         */
        overline: "px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  ref?: React.Ref<HTMLSpanElement>;
}

/**
 * Badge component for labels, categories, statuses
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="male">Men's Team</Badge>
 * <Badge variant="primary" size="overline">Players</Badge>
 */
export const Badge = ({
  className,
  variant,
  size,
  ref,
  ...props
}: BadgeProps) => {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
};
