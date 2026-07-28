// src/frontend/shared/components/primitives/Badge.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";

import { cn } from "@/shared/utils";

/**
 * Badge variants for team categories, statuses, etc.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-button border text-xs font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-surface-subtle text-text-heading",
        // `primary-ghost`, not `primary-subtle`. Every semantic ramp here is a
        // three-step (subtle / DEFAULT / strong) whose `-subtle` is a pale
        // tint, but the brand ramp has eleven steps and its `-subtle` is the
        // fourth — a mid tone (#6d86c0). `primary-strong` on it is 2.75:1 in
        // light, 3.50:1 in dark and 3.01:1 in high-contrast. `ghost` is the
        // brand ramp's actual tint step, and the pairing is 8.23 / 5.23 /
        // 12.08.
        primary: "border-transparent bg-primary-ghost text-primary-strong",
        secondary: "border-transparent bg-secondary-faint text-secondary-deep",
        success: "border-transparent bg-success-subtle text-success-strong",
        error: "border-transparent bg-error-subtle text-error-strong",
        warning: "border-transparent bg-warning-subtle text-warning-strong",
        info: "border-transparent bg-info-subtle text-info-strong",
        outline: "border-divide text-text-emphasis",
        // Team-specific
        male: "border-transparent bg-team-male-subtle text-team-male-strong",
        female:
          "border-transparent bg-team-female-subtle text-team-female-strong",
        // Domain entity-specific
        players: "border-transparent bg-players-subtle text-players-strong",
        teams: "border-transparent bg-teams-subtle text-teams-strong",
        matches: "border-transparent bg-matches-subtle text-matches-strong",
        // Competition level-specific (standalone, on neutral surface)
        national: "border-transparent bg-national-subtle text-national-strong",
        regional: "border-transparent bg-regional-subtle text-regional-strong",
        departmental:
          "border-transparent bg-departmental-subtle text-departmental-strong",
        // Competition level-specific (on a `bg-{level}-subtle` card header,
        // where the plain level variant would be invisible — same fill).
        //
        // Each one is exactly its plain variant with foreground and background
        // swapped, which makes it AA by construction: contrast is symmetric,
        // so these read 9.27 / 8.41 / 8.38 in light and 7.66 / 7.52 / 7.45 in
        // dark, the same numbers as `national` / `regional` / `departmental`.
        // Filling with the mid `bg-{level}` instead — as these used to — put a
        // pale tint on a mid tone: 3.63, 2.21 and 1.85 in light. And because
        // the fill is now `-strong` while the header is `-subtle`, the chip
        // separates from the header by that same ratio.
        "national-on-header":
          "border-transparent bg-national-strong text-national-subtle",
        "regional-on-header":
          "border-transparent bg-regional-strong text-regional-subtle",
        "departmental-on-header":
          "border-transparent bg-departmental-strong text-departmental-subtle",
        // Player comparison. Transparent fill, so both the text and the ring
        // are measured against whatever surface the badge is mounted on — and
        // `primary` is 2.84:1 on the dark theme's `surface-raised`, failing the
        // 4.5:1 text floor and the 3:1 non-text floor at once. `primary-bold`
        // is the first step that clears both on every surface in every theme
        // (worst case 6.18:1).
        vs: "border-2 border-primary-bold text-primary-bold font-black tracking-widest",

        category: "border-transparent bg-category-subtle text-category-strong",
        division: "border-transparent bg-division-subtle text-division-strong",
        pool: "border-transparent bg-pool-subtle text-pool-strong",

        "position-g":
          "border-transparent bg-position-g-subtle text-position-g-strong",
        "position-f":
          "border-transparent bg-position-f-subtle text-position-f-strong",
        "position-c":
          "border-transparent bg-position-c-subtle text-position-c-strong",
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
