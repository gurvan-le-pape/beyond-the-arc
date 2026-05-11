// src/frontend/features/organizations/clubs/components/map/ClubsMapClient.tsx
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

export function ClubsMapClient(props: ClubsMapClientProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <ClubsMap {...props} />
    </div>
  );
}
