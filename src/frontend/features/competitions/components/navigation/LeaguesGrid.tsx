// src/frontend/features/competitions/components/navigation/LeaguesGrid.tsx
"use client";

import { useRouter } from "@/navigation";
import { Card } from "@/shared/components/ui";
import { ImageWithFallback } from "@/shared/components/ui/primitives";
import { CompetitionLevel } from "@/shared/constants/competition-levels";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

import type { League } from "../../../organizations/leagues/types/League";

interface LeaguesGridProps {
  readonly leagues: League[];
}

/**
 * LeaguesGrid
 *
 * Displays a grid of regional league cards with logos.
 * Each card is clickable and navigates to the championships for that league.
 */
export function LeaguesGrid({ leagues }: LeaguesGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {leagues.map((league) => (
        <Card
          key={league.id}
          variant="default"
          padding="md"
          clickable
          onClick={() =>
            router.push(
              `/competitions/${CompetitionLevel.REGIONAL}/${league.id}`,
            )
          }
          className="border-l-4 border-l-regional-dark dark:border-l-regional-light hover:border-l-divide-light dark:hover:!border-l-divide-dark flex flex-col items-center text-center"
        >
          {/* Logo placeholder */}
          <div className="mb-3 w-16 h-16 flex items-center justify-center rounded-xl bg-surface-raised dark:bg-surface-raised-dark">
            <ImageWithFallback
              src={`/images/leagues/${formatNameToFileName(league.name)}.webp`}
              alt={league.name}
              fallback="/images/leagues/defaultLogo.30cc7520.svg"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h3 className="text-sm font-semibold text-text-heading dark:text-text-heading-dark leading-snug">
            {league.name}
          </h3>
        </Card>
      ))}
    </div>
  );
}

export default LeaguesGrid;
