// src/frontend/features/stats/components/PerGameStatsPanel.tsx
import { useFormatter, useTranslations } from "next-intl";

import type { PlayerCareerStats } from "@/features/stats/types";
import { Section, StatGroup } from "@/shared/components/blocks";
import { Card } from "@/shared/components/primitives";
import { createStatFormat, type StatFormat } from "@/shared/utils";

const STAT_FIELDS = [
  {
    abbr: "gamesPlayedShort",
    full: "gamesPlayed",
    value: (s) => String(s.gamesPlayed),
  },
  {
    abbr: "points.abbr",
    full: "pointsPerGame",
    value: (s, { perGame }) => perGame(s.pointsPerGame),
  },
  {
    abbr: "rebounds.abbr",
    full: "reboundsPerGame",
    value: (s, { perGame }) => perGame(s.reboundsPerGame),
  },
  {
    abbr: "assists.abbr",
    full: "assistsPerGame",
    value: (s, { perGame }) => perGame(s.assistsPerGame),
  },
  {
    abbr: "steals.abbr",
    full: "stealsPerGame",
    value: (s, { perGame }) => perGame(s.stealsPerGame),
  },
  {
    abbr: "blocks.abbr",
    full: "blocksPerGame",
    value: (s, { perGame }) => perGame(s.blocksPerGame),
  },
  {
    abbr: "turnovers.abbr",
    full: "turnoversPerGame",
    value: (s, { perGame }) => perGame(s.turnoversPerGame),
  },
  {
    abbr: "fouls.abbr",
    full: "foulsPerGame",
    value: (s, { perGame }) => perGame(s.foulsPerGame),
  },
] as const satisfies readonly {
  abbr: string;
  full: string;
  value: (s: PlayerCareerStats, format: StatFormat) => string;
}[];

interface PerGameStatsPanelProps {
  /** Season/career aggregate. A team's season stats are a superset of this. */
  readonly stats: PlayerCareerStats;
}

/**
 * A season or career per-game panel: games played, then the seven per-game
 * averages, as one strip of numbers under abbreviated labels. Each
 * abbreviation carries its full label as its title.
 *
 * Shared verbatim by player detail (career) and team detail (season) — both
 * consume the same aggregate shape, so there is one panel, one field list and
 * one heading rather than a copy per feature.
 *
 * **The averages arrive precomputed and zero-guarded from the backend**, which
 * divides by `gamesPlayed || 1`. Nothing is divided here, so a player or team
 * with no games renders `0.0` (`0,0` in French) rather than `NaN`.
 */
export function PerGameStatsPanel({ stats }: PerGameStatsPanelProps) {
  const tCommon = useTranslations("common");
  const statFormat = createStatFormat(useFormatter());

  return (
    <Section title={tCommon("stats.seasonStatsTitle")}>
      <Card padding="none">
        <StatGroup
          columns={{ base: 4, lg: 8 }}
          stats={STAT_FIELDS.map((field) => ({
            label: tCommon(`stats.${field.abbr}`),
            fullLabel: tCommon(`stats.${field.full}`),
            value: field.value(stats, statFormat),
          }))}
        />
      </Card>
    </Section>
  );
}

export default PerGameStatsPanel;
