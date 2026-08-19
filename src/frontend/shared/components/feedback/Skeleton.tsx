// src/frontend/shared/components/feedback/Skeleton.tsx
import { type HTMLAttributes } from "react";

import { cn } from "@/shared/utils";

/**
 * A pulsing placeholder block. Shape and size come entirely from `className` —
 * this contributes only the animation, the radius and the fill, and forwards
 * every other div prop.
 *
 * Its fill is `surface-inset`, which resolves against the nearest surface
 * ancestor, so a skeleton placed directly on the page background renders
 * invisible. Put it inside the same surface the real content will occupy.
 */
export function Skeleton({
  className,
  ...props
}: Readonly<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-inset", className)}
      {...props}
    />
  );
}

/**
 * The placeholder for a card: a title line, a subtitle, and a content block,
 * on the same surface and border a real card uses.
 *
 * **Its dimensions mirror the component it stands in for.** Change the card and
 * this drifts silently — the swap from skeleton to content will jump, and
 * nothing fails.
 */
export function SkeletonCard() {
  return (
    <div className="surface-subtle p-6 rounded-card border border-divide">
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

/**
 * The placeholder for an `InfoBox`: a short label line above a value line, on
 * the same surface and border.
 *
 * **Its dimensions mirror `InfoBox`.** Change that component's padding or type
 * scale and this drifts silently, so the swap from skeleton to content jumps.
 */
export function SkeletonInfoBox() {
  return (
    <div className="surface-subtle p-4 rounded-card border border-divide">
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-5 w-32" />
    </div>
  );
}
