// src/frontend/shared/components/ui/primitives/Badge.tsx
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
        default:
          "border-transparent bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        primary:
          "border-transparent bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400",
        secondary:
          "border-transparent bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400",
        success:
          "border-transparent bg-success-light/20 text-success-dark dark:bg-success-dark/20 dark:text-success-light",
        error:
          "border-transparent bg-error-light/20 text-error-dark dark:bg-error-dark/20 dark:text-error-light",
        warning:
          "border-transparent bg-warning-light/20 text-warning-dark dark:bg-warning-dark/20 dark:text-warning-light",
        info: "border-transparent bg-info-light/20 text-info-dark dark:bg-info-dark/20 dark:text-info-light",
        outline:
          "border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
        // Team-specific
        male: "border-transparent bg-team-male-light/10 text-team-male-dark dark:bg-team-male-light/20 dark:text-team-male-light",
        female:
          "border-transparent bg-team-female-light/10 text-team-female-dark dark:bg-team-female-light/20 dark:text-team-female-light",
        // Competition level-specific
        national:
          "border-transparent bg-national-DEFAULT text-white dark:bg-national-light",
        regional:
          "border-transparent bg-regional-DEFAULT text-white dark:bg-regional-light",
        departmental:
          "border-transparent bg-departmental-DEFAULT text-gray-900 dark:bg-departmental-light dark:text-gray-900",
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
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge component for labels, categories, statuses
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="male">Men's Team</Badge>
 */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";
