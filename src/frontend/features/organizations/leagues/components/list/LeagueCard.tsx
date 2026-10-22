// src/frontend/features/organizations/leagues/components/list/LeagueCard.tsx
import { namesMatch } from "@/features/organizations/utils";
import { Card, ImageWithFallback } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { formatLeagueName, formatNameToFileName } from "@/shared/utils";

import type { League } from "../../types";

interface LeagueCardProps {
  readonly league: League;
  readonly clubLabel: string;
}

/**
 * A league as a card: its region's name, the region code, and its club count.
 * The federation's own capitalised name is shown only where it says something
 * the region name does not ("SUD").
 *
 * `clubLabel` arrives already pluralised — the count and its noun are resolved
 * by the caller, because the plural rule belongs to the locale rather than to
 * this component.
 */
export function LeagueCard({ league, clubLabel }: LeagueCardProps) {
  const officialName = formatLeagueName(league.name);

  return (
    <Card
      padding="none"
      href={`/organizations/leagues/${league.id}`}
      className="group flex items-center gap-4 p-4 border-line-regional hover:border-solid-regional"
    >
      <ImageWithFallback
        src={`/images/leagues/${formatNameToFileName(league.name)}.webp`}
        alt=""
        fallback="/images/leagues/defaultLogo.30cc7520.svg"
        className="w-12 h-12 flex-shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
      />

      <div className="flex-1 min-w-0">
        <Text
          variant="h3"
          as="h2"
          className="leading-snug truncate text-base md:text-lg"
        >
          {league.region.name}
        </Text>
        <Text variant="caption" className="mt-0.5 truncate">
          {namesMatch(officialName, league.region.name)
            ? league.region.code
            : `${league.region.code} · ${officialName}`}
        </Text>
      </div>

      <div className="flex-shrink-0 text-right">
        <p className="text-2xl font-bold text-ink-regional leading-none">
          {league.clubCount}
        </p>
        <Text variant="caption" className="mt-0.5">
          {clubLabel}
        </Text>
      </div>
    </Card>
  );
}
