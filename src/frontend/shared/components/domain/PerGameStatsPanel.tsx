// src/frontend/shared/components/domain/PerGameStatsPanel.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { PlayerCareerStats } from "@/features/players/types";
import { InfoBox, Section } from "@/shared/components/blocks";

interface PerGameStatsPanelProps {
  /** Season/career aggregate. A team's season stats are a superset of this. */
  readonly stats: PlayerCareerStats;
}

/**
 * Renders a season/career per-game stat panel: games played followed by the
 * seven per-game averages. Shared verbatim by the player detail (career) and
 * team detail (season) pages — both consume the same PlayerCareerStatsDto shape,
 * so there is one panel, one field list, and one heading.
 *
 * Per-game values come precomputed and zero-guarded from the backend (gp || 1),
 * so `toFixed(1)` renders "0.0" for a player/team with no games.
 */
const STAT_FIELDS: { key: string; value: (s: PlayerCareerStats) => string | number }[] = [
  { key: "gamesPlayed", value: (s) => s.gamesPlayed },
  { key: "pointsPerGame", value: (s) => s.pointsPerGame.toFixed(1) },
  { key: "reboundsPerGame", value: (s) => s.reboundsPerGame.toFixed(1) },
  { key: "assistsPerGame", value: (s) => s.assistsPerGame.toFixed(1) },
  { key: "stealsPerGame", value: (s) => s.stealsPerGame.toFixed(1) },
  { key: "blocksPerGame", value: (s) => s.blocksPerGame.toFixed(1) },
  { key: "turnoversPerGame", value: (s) => s.turnoversPerGame.toFixed(1) },
  { key: "foulsPerGame", value: (s) => s.foulsPerGame.toFixed(1) },
];

export const PerGameStatsPanel: React.FC<PerGameStatsPanelProps> = ({
  stats,
}) => {
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
};

export default PerGameStatsPanel;
