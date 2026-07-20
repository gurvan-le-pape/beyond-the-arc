// src/frontend/features/players/components/detail/PlayerCareerStats.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { PlayerCareerStats as PlayerCareerStatsData } from "@/features/players/types";
import { InfoBox, Section } from "@/shared/components/blocks";

interface StatConfig {
  key: string;
  labelKey: string;
  value: (stats: PlayerCareerStatsData) => string | number;
  highlight?: boolean;
}

interface PlayerCareerStatsProps {
  stats: PlayerCareerStatsData;
  title?: string;
  statsConfig?: StatConfig[];
  gridCols?: string;
}

// Per-game averages come precomputed from the backend (`/players/:id/matches`
// → career). We only format them for display; the backend already guards the
// zero-games case (gp || 1), so `foo.toFixed(1)` renders "0.0" there too.
const defaultStatsConfig: StatConfig[] = [
  {
    key: "gamesPlayed",
    labelKey: "stats.gamesPlayed",
    value: (stats) => stats.gamesPlayed,
    highlight: true,
  },
  {
    key: "pointsPerGame",
    labelKey: "stats.pointsPerGame",
    value: (stats) => stats.pointsPerGame.toFixed(1),
  },
  {
    key: "reboundsPerGame",
    labelKey: "stats.reboundsPerGame",
    value: (stats) => stats.reboundsPerGame.toFixed(1),
  },
  {
    key: "assistsPerGame",
    labelKey: "stats.assistsPerGame",
    value: (stats) => stats.assistsPerGame.toFixed(1),
  },
  {
    key: "stealsPerGame",
    labelKey: "stats.stealsPerGame",
    value: (stats) => stats.stealsPerGame.toFixed(1),
  },
  {
    key: "blocksPerGame",
    labelKey: "stats.blocksPerGame",
    value: (stats) => stats.blocksPerGame.toFixed(1),
  },
  {
    key: "turnoversPerGame",
    labelKey: "stats.turnoversPerGame",
    value: (stats) => stats.turnoversPerGame.toFixed(1),
  },
  {
    key: "foulsPerGame",
    labelKey: "stats.foulsPerGame",
    value: (stats) => stats.foulsPerGame.toFixed(1),
  },
];

export const PlayerCareerStats: React.FC<PlayerCareerStatsProps> = ({
  stats,
  title,
  statsConfig,
  gridCols,
}) => {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");
  const config = statsConfig || defaultStatsConfig;
  const gridClass = gridCols || "grid-cols-2 md:grid-cols-4";
  return (
    <Section
      title={title || tPlayers("playerDetail.seasonStatsTitle")}
      variant="highlighted"
    >
      <div className={`grid ${gridClass} gap-4`}>
        {config.map((stat) => (
          <InfoBox
            key={stat.key}
            label={tCommon(stat.labelKey)}
            value={stat.value(stats)}
          />
        ))}
      </div>
    </Section>
  );
};

export default PlayerCareerStats;
