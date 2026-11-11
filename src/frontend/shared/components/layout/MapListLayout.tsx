// src/frontend/shared/components/layout/MapListLayout.tsx
import type { ReactNode } from "react";

import { cn } from "@/shared/utils";

interface MapListLayoutProps {
  /** The map column: the map and whatever sits with it (search, caption). */
  readonly map: ReactNode;
  /** The list the map indexes. */
  readonly children: ReactNode;
  /**
   * Drop the map column below `lg`, for a map that is unusable at phone
   * width and whose list already does the whole job there.
   */
  readonly hideMapBelowLg?: boolean;
}

/**
 * A map beside the list it indexes: one column under `lg`, then the map on the
 * left at two fifths of the width, staying in view while the list scrolls.
 *
 * Every page that pairs a map with a list uses this, so they share one split,
 * one gap and one sticky offset. The map column is capped at `max-w-md` so a
 * map never outgrows what it can draw legibly.
 */
export function MapListLayout({
  map,
  children,
  hideMapBelowLg = false,
}: MapListLayoutProps) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-8">
      <div
        className={cn(
          "mx-auto w-full max-w-md lg:sticky lg:top-24",
          hideMapBelowLg && "hidden lg:block",
        )}
      >
        {map}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
