// src/frontend/features/organizations/clubs/components/navigation/RegionsGrid.tsx
"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/navigation";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

import type { ClubStatsByRegion } from "../../types/ClubStatsByRegion";

interface RegionsGridProps {
  readonly regions: ClubStatsByRegion[];
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
          onClick={() => router.push(`/organizations/leagues/${region.id}`)}
          className="border-l-4 border-l-regional-dark dark:border-l-regional-light hover:border-l-divide-light dark:hover:!border-l-divide-dark"
        >
          <Text variant="h3" className="mb-2">
            {region.name}
          </Text>
          <p className="text-xl font-bold text-regional-dark dark:text-regional-light">
            {region.clubCount}
          </p>
          <Text variant="caption">
            {region.clubCount === 1 ? t("club") : t("clubs")}
          </Text>
        </Card>
      ))}
    </div>
  );
}
