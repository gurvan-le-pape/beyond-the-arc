// src/frontend/shared/components/primitives/Badge.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

/**
 * Badge variants for team categories, statuses, etc.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-button border text-xs font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-surface-subtle text-text-heading",
        primary: "border-transparent bg-primary-subtle text-primary-strong",
        secondary: "border-transparent bg-secondary-100 text-secondary-800",
        success: "border-transparent bg-success-subtle text-success-strong",
        error: "border-transparent bg-error-subtle text-error-strong",
        warning: "border-transparent bg-warning-subtle text-warning-strong",
        info: "border-transparent bg-info-subtle text-info-strong",
        outline: "border-divide text-text-emphasis",
        // Team-specific
        male: "border-transparent bg-team-male-subtle text-team-male-strong",
        female:
          "border-transparent bg-team-female-subtle text-team-female-strong",
        // Competition level-specific
        national: "border-transparent bg-national-subtle text-national-strong",
        regional: "border-transparent bg-regional-subtle text-regional-strong",
        departmental:
          "border-transparent bg-departmental-subtle text-departmental-strong",
      },
      size: {
        sm: "px-2 py-0.5",
        md: "px-2.5 py-0.5",
        lg: "px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, // was HTMLDivElement — div is block, invalid inline
    VariantProps<typeof badgeVariants> {}

/**
 * Badge component for labels, categories, statuses
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="male">Men's Team</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>( // was HTMLDivElement
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span // was <div>
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";
