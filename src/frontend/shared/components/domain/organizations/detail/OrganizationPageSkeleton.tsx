// src/frontend/shared/components/domain/organizations/detail/OrganizationPageSkeleton.tsx

import { Skeleton } from "@/shared/components/feedback";

const carouselKeys = Array.from({ length: 2 }, () => crypto.randomUUID());
const pillKeys = Array.from({ length: 8 }, () => crypto.randomUUID());
const cardKeys = Array.from({ length: 6 }, () => crypto.randomUUID());
const groupKeys = Array.from({ length: 2 }, () => crypto.randomUUID());
const rowKeys = Array.from({ length: 3 }, () => crypto.randomUUID());

export function OrganizationPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header bar */}
      <Skeleton className="h-14 w-72 rounded-lg" />

      {/* Carousel skeletons × 2 */}
      {carouselKeys.map((key) => (
        <div
          key={key}
          className="rounded-card border border-divide-light dark:border-divide-dark bg-surface-subtle dark:bg-surface-subtle-dark p-5 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-48 rounded-lg" />
          </div>
          <div className="flex gap-1.5">
            {pillKeys.map((j) => (
              <Skeleton key={j} className="w-7 h-7 rounded-full" />
            ))}
          </div>
          <div className="flex gap-3 overflow-hidden">
            {cardKeys.map((j) => (
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
        {groupKeys.map((key) => (
          <div key={key} className="flex flex-col gap-2">
            <Skeleton className="h-7 w-28 rounded-full" />
            {rowKeys.map((j) => (
              <Skeleton key={j} className="h-9 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
