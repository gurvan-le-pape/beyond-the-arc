// src/frontend/shared/components/ui/feedback/Skeleton.tsx
import { type HTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

/**
 * Skeleton component for loading states
 * Better UX than just a spinner
 */
export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Preset skeleton layouts
 */
export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-card border border-gray-200 dark:border-gray-700">
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export function SkeletonInfoBox() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-card border border-gray-200 dark:border-gray-700">
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-5 w-32" />
    </div>
  );
}
