// src/frontend/features/organizations/clubs/components/map/clubs-map/index.tsx
"use client";

import dynamic from "next/dynamic";

import type { Committee } from "@/features/organizations/committees/types";
import type { League } from "@/features/organizations/leagues/types";

import type { ClubBasic } from "../../../types/ClubBasic";
import { LoadingMap } from "./LoadingMap";

// Dynamic import with ssr: false
const MapLibreClubsMap = dynamic(
  () => import("./MapLibreClubsMap").then((mod) => mod.MapLibreClubsMap),
  {
    ssr: false,
    loading: () => <LoadingMap />,
  },
);

interface ClubsMapProps {
  readonly initialRegions: League[];
  readonly initialDepartments: Committee[];
  readonly initialClubs: ClubBasic[];
}

/**
 * The clubs map of France, behind the boundary that keeps MapLibre out of the
 * server render and out of every other route's bundle.
 *
 * `MapLibreClubsMap` is imported with **`ssr: false`**, which is not optional: MapLibre
 * needs `window` and WebGL, so rendering it on the server throws. The dynamic
 * import is also what stops the map's weight from being pulled in by anything
 * that merely imports this feature.
 *
 * The `initial*` props are server-fetched and passed straight through, so the
 * map paints from real data on first render rather than fetching after mount.
 */
export function ClubsMap(props: ClubsMapProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <MapLibreClubsMap {...props} />
    </div>
  );
}
