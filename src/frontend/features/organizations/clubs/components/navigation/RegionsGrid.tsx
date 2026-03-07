// src/frontend/features/organizations/clubs/components/navigation/RegionsGrid.tsx
"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/navigation";
import { Card } from "@/shared/components/ui";

import type { ClubStatsByRegion } from "../../types/ClubStatsByRegion";

interface RegionsGridProps {
  regions: ClubStatsByRegion[];
}

/**
 * RegionsGrid
 *
 * Displays a grid of region cards with club counts.
 * Each card is clickable and navigates to the departments for that region.
 */
export function RegionsGrid({ regions }: RegionsGridProps) {
  const t = useTranslations("clubs");
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {regions.map((region) => (
        <Card
          key={region.id}
          variant="default"
          padding="md"
          clickable
          onClick={() => router.push(`/clubs/league/${region.id}`)}
          className="border-l-4 border-l-regional-dark dark:border-l-regional-light hover:border-l-gray-300 dark:hover:!border-l-gray-600"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {region.name}
          </h3>
          <p className="text-xl font-bold text-regional-dark dark:text-regional-light">
            {region.clubCount}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {region.clubCount === 1 ? t("club") : t("clubs")}
          </p>
        </Card>
      ))}
    </div>
  );
}
