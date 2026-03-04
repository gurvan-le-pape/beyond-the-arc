// src/frontend/shared/components/ui/feedback/EmptyState.tsx
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

import { Button } from "../primitives/Button";

/**
 * EmptyState component for when there's no data to display
 * Can be used with or without icon, description, and action button
 */
interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title?: string;
  message?: string; // Alias for description for backward compatibility
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, message, description, action, className, ...props }, ref) => {
    // Use description or message (for backward compatibility)
    const descriptionText = description || message;
    const titleText = title || "No data available";

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4 text-center",
          className,
        )}
        role="status"
        {...props}
      >
        {/* Icon */}
        {icon && (
          <div className="mb-4 text-gray-400 dark:text-gray-600">{icon}</div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {titleText}
        </h3>

        {/* Description */}
        {descriptionText && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            {descriptionText}
          </p>
        )}

        {/* Action */}
        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </div>
    );
  },
);

EmptyState.displayName = "EmptyState";

/**
 * Simple text-only empty state (for backward compatibility)
 */
interface SimpleEmptyStateProps {
  message: string;
}

export function SimpleEmptyState({ message }: SimpleEmptyStateProps) {
  return (
    <div className="py-8 text-center">
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}
