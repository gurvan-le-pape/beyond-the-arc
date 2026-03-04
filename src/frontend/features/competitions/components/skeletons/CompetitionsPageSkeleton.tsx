// src/frontend/features/competitions/components/skeletons/CompetitionsPageSkeleton.tsx
import { Skeleton } from "@/shared/components/ui";

export function CompetitionsPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header bar */}
      <Skeleton className="h-14 w-72 rounded-lg" />

      {/* Carousel skeletons × 2 */}
      {[0, 1].map((i) => (
        <div
          key={i}
          className="rounded-card border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-48 rounded-lg" />
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 8 }).map((_, j) => (
              <Skeleton key={j} className="w-7 h-7 rounded-full" />
            ))}
          </div>
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, j) => (
              <Skeleton
                key={j}
                className="flex-shrink-0 w-32 h-36 rounded-card"
              />
            ))}
          </div>
        </div>
      ))}

      {/* Championship list skeleton */}
      <div className="flex flex-col gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-7 w-28 rounded-full" />
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-9 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
