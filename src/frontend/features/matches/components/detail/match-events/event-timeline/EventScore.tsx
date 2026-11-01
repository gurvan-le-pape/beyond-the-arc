// src/frontend/features/matches/components/detail/match-events/event-timeline/EventScore.tsx
import { useTranslations } from "next-intl";

import { Badge } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

import type { Play } from "../plays";

interface EventScoreProps {
  readonly homeScore: number;
  readonly awayScore: number;
  /** The side whose basket this score follows; its number is set in its tone. */
  readonly scoredBy: "home" | "away";
  /** What the basket did to the lead, badged under the score. */
  readonly swing: Play["swing"];
}

/**
 * The match score right after a basket, home first, with the scoring side's
 * number in bold and in its home or away tone, so a column of scores shows
 * who scored without reading the row. A basket that took the lead or levelled
 * the score says so under it.
 */
export function EventScore({
  homeScore,
  awayScore,
  scoredBy,
  swing,
}: EventScoreProps) {
  const t = useTranslations("matches.matchEvents");

  return (
    <span className="flex flex-col items-end gap-1 pt-px">
      <span className="text-sm tabular-nums whitespace-nowrap text-text-secondary">
        <span className={cn(scoredBy === "home" && "font-bold text-ink-home")}>
          {homeScore}
        </span>
        –
        <span className={cn(scoredBy === "away" && "font-bold text-ink-away")}>
          {awayScore}
        </span>
      </span>
      {swing && (
        <Badge variant="outline" size="sm">
          {t(swing)}
        </Badge>
      )}
    </span>
  );
}
