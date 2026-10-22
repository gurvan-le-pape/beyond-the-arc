// src/frontend/shared/components/domain/PerGameStatsPanel.tsx
import { useTranslations } from "next-intl";

import { Section } from "@/shared/components/blocks";
import { Card } from "@/shared/components/primitives";
import { StatCell } from "@/shared/components/stats";
import type { PlayerCareerStats } from "@/shared/types";

interface PerGameStatsPanelProps {
  /** Season/career aggregate. A team's season stats are a superset of this. */
  readonly stats: PlayerCareerStats;
}

const STAT_FIELDS = [
  {
    abbr: "gamesPlayedShort",
    full: "gamesPlayed",
    value: (s) => String(s.gamesPlayed),
  },
  {
    abbr: "points.abbr",
    full: "pointsPerGame",
    value: (s) => s.pointsPerGame.toFixed(1),
  },
  {
    abbr: "rebounds.abbr",
    full: "reboundsPerGame",
    value: (s) => s.reboundsPerGame.toFixed(1),
  },
  {
    abbr: "assists.abbr",
    full: "assistsPerGame",
    value: (s) => s.assistsPerGame.toFixed(1),
  },
  {
    abbr: "steals.abbr",
    full: "stealsPerGame",
    value: (s) => s.stealsPerGame.toFixed(1),
  },
  {
    abbr: "blocks.abbr",
    full: "blocksPerGame",
    value: (s) => s.blocksPerGame.toFixed(1),
  },
  {
    abbr: "turnovers.abbr",
    full: "turnoversPerGame",
    value: (s) => s.turnoversPerGame.toFixed(1),
  },
  {
    abbr: "fouls.abbr",
    full: "foulsPerGame",
    value: (s) => s.foulsPerGame.toFixed(1),
  },
] as const satisfies readonly {
  abbr: string;
  full: string;
  value: (s: PlayerCareerStats) => string;
}[];

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
 * with no games renders `0.0` rather than `NaN`.
 */
export function PerGameStatsPanel({ stats }: PerGameStatsPanelProps) {
  const tCommon = useTranslations("common");

  return (
    <Section title={tCommon("stats.seasonStatsTitle")}>
      <Card padding="none" className="grid grid-cols-4 lg:grid-cols-8">
        {STAT_FIELDS.map((field) => (
          <StatCell
            key={field.full}
            label={tCommon(`stats.${field.abbr}`)}
            fullLabel={tCommon(`stats.${field.full}`)}
            value={field.value(stats)}
          />
        ))}
      </Card>
    </Section>
  );
}

export default PerGameStatsPanel;
