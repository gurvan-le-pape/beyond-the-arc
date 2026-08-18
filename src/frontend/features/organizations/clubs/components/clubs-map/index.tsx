// src/frontend/features/organizations/clubs/components/clubs-map/index.tsx
"use client";

import dynamic from "next/dynamic";

import type { ClubBasic } from "../../types/ClubBasic";
import type { ClubStatsByDepartment } from "../../types/ClubStatsByDepartment";
import type { ClubStatsByRegion } from "../../types/ClubStatsByRegion";
import { LoadingMap } from "./LoadingMap";

interface ClubsMapClientProps {
  readonly initialRegions: ClubStatsByRegion[];
  readonly initialDepartments: ClubStatsByDepartment[];
  readonly initialClubs: ClubBasic[];
}

// Dynamic import with ssr: false
const ClubsMap = dynamic(
  () => import("./ClubsMap").then((mod) => mod.ClubsMap),
  {
    ssr: false,
    loading: () => <LoadingMap />,
  },
);

/**
 * The boundary that keeps MapLibre out of the server render and out of every
 * other route's bundle.
 *
 * `ClubsMap` is imported with **`ssr: false`**, which is not optional: MapLibre
 * needs `window` and WebGL, so rendering it on the server throws. The dynamic
 * import is also what stops the map's weight from being pulled in by anything
 * that merely imports this feature.
 *
 * The `initial*` props are server-fetched and passed straight through, so the
 * map paints from real data on first render rather than fetching after mount.
 */
export function ClubsMapClient(props: ClubsMapClientProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <ClubsMap {...props} />
    </div>
  );
}
