// src/frontend/features/organizations/leagues/components/list/LeaguesGrid.tsx
"use client";

import { useTranslations } from "next-intl";

import type { League } from "../../types";
import { LeagueCard } from "./LeagueCard";

interface LeaguesGridProps {
  readonly leagues: League[];
}

/**
 * The leagues listing as a responsive grid.
 *
 * Renders whatever it is given and nothing else — the empty state and the
 * fetching both belong to the page above it.
 */
export function LeaguesGrid({ leagues }: LeaguesGridProps) {
  const t = useTranslations("clubs");

  const sorted = [...leagues].sort((a, b) =>
    a.region.name.localeCompare(b.region.name),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sorted.map((league) => (
        <LeagueCard
          key={league.id}
          league={league}
          clubLabel={league.clubCount === 1 ? t("club") : t("clubs")}
        />
      ))}
    </div>
  );
}
