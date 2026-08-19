// src/frontend/shared/components/domain/PerGameStatsPanel.tsx
import { useTranslations } from "next-intl";

import { InfoBox, Section } from "@/shared/components/blocks";
import type { PlayerCareerStats } from "@/shared/types";

interface PerGameStatsPanelProps {
  /** Season/career aggregate. A team's season stats are a superset of this. */
  readonly stats: PlayerCareerStats;
}

const STAT_FIELDS = [
  { key: "gamesPlayed", value: (s) => s.gamesPlayed },
  { key: "pointsPerGame", value: (s) => s.pointsPerGame.toFixed(1) },
  { key: "reboundsPerGame", value: (s) => s.reboundsPerGame.toFixed(1) },
  { key: "assistsPerGame", value: (s) => s.assistsPerGame.toFixed(1) },
  { key: "stealsPerGame", value: (s) => s.stealsPerGame.toFixed(1) },
  { key: "blocksPerGame", value: (s) => s.blocksPerGame.toFixed(1) },
  { key: "turnoversPerGame", value: (s) => s.turnoversPerGame.toFixed(1) },
  { key: "foulsPerGame", value: (s) => s.foulsPerGame.toFixed(1) },
] as const satisfies readonly {
  key: string;
  value: (s: PlayerCareerStats) => string | number;
}[];

/**
 * A season or career per-game panel: games played, then the seven per-game
 * averages.
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
    <Section title={tCommon("stats.seasonStatsTitle")} variant="highlighted">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_FIELDS.map((field) => (
          <InfoBox
            key={field.key}
            label={tCommon(`stats.${field.key}`)}
            value={field.value(stats)}
          />
        ))}
      </div>
    </Section>
  );
}

export default PerGameStatsPanel;
