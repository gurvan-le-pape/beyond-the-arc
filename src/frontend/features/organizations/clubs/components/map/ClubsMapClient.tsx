// src/frontend/features/organizations/clubs/components/map/ClubsMapClient.tsx
"use client";

import dynamic from "next/dynamic";

import type { ClubStatsByRegion } from "../../types/ClubStatsByRegion";

interface ClubsMapClientProps {
  initialRegions: ClubStatsByRegion[];
}

// Dynamic import with ssr: false
const ClubsMap = dynamic(
  () => import("./ClubsMap").then((mod) => mod.ClubsMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-sm font-medium text-gray-700">
            Chargement de la carte...
          </p>
        </div>
      </div>
    ),
  },
);

export function ClubsMapClient(props: ClubsMapClientProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <ClubsMap {...props} />
    </div>
  );
}
