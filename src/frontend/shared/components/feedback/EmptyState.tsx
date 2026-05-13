// src/frontend/shared/components/feedback/EmptyState.tsx
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/utils";

import { Button } from "../primitives/Button";
import { Text } from "../typography";

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  message?: string; // kept for backward compatibility — prefer description
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * EmptyState component for when there's no data to display
 * Can be used with or without icon, description, and action button
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, message, description, action, className, ...props }, ref) => {
    const descriptionText = description || message;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4 text-center",
          className,
        )}
        aria-live="polite"
        {...props}
      >
        {/* Icon */}
        {icon && <div className="mb-4 text-text-muted">{icon}</div>}

        {/* Title */}
        <Text variant="h3" className="mb-2">
          {title}
        </Text>

        {/* Description */}
        {descriptionText && (
          <Text variant="caption" as="p" className="mb-6 max-w-md">
            {descriptionText}
          </Text>
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
  readonly message: string;
}

export function SimpleEmptyState({ message }: SimpleEmptyStateProps) {
  return (
    <div className="py-8 text-center">
      <Text variant="body" as="p">
        {message}
      </Text>
    </div>
  );
}
