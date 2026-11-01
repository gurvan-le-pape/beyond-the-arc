// src/frontend/shared/components/feedback/EmptyState.tsx
import { type HTMLAttributes, type ReactNode } from "react";

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
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * EmptyState component for when there's no data to display
 * Can be used with or without icon, description, and action button
 */
export const EmptyState = ({
  icon,
  title,
  message,
  description,
  action,
  className,
  ref,
  ...props
}: EmptyStateProps) => {
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
      {icon && <div className="mb-4 text-text-muted">{icon}</div>}

      <Text variant="h3" as="p" className="mb-2">
        {title}
      </Text>

      {descriptionText && (
        <Text variant="caption" as="p" className="mb-6 max-w-md">
          {descriptionText}
        </Text>
      )}

      {action && (
        <Button onPress={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
};

/**
 * Simple text-only empty state (for backward compatibility)
 */
