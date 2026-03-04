// src/frontend/features/players/components/detail/PlayerCareerStats.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Section } from "@/shared/components/ui";
import { InfoBox } from "@/shared/components/ui";

interface StatConfig {
  key: string;
  labelKey: string;
  value: (stats: any) => string | number;
  highlight?: boolean;
}

interface PlayerCareerStatsProps {
  stats: any;
  title?: string;
  statsConfig?: StatConfig[];
  gridCols?: string;
}

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
    value: (stats) =>
      stats.gamesPlayed > 0
        ? (stats.points / stats.gamesPlayed).toFixed(1)
        : "0.0",
  },
  {
    key: "reboundsPerGame",
    labelKey: "stats.reboundsPerGame",
    value: (stats) =>
      stats.gamesPlayed > 0
        ? (stats.rebounds / stats.gamesPlayed).toFixed(1)
        : "0.0",
  },
  {
    key: "assistsPerGame",
    labelKey: "stats.assistsPerGame",
    value: (stats) =>
      stats.gamesPlayed > 0
        ? (stats.assists / stats.gamesPlayed).toFixed(1)
        : "0.0",
  },
  {
    key: "stealsPerGame",
    labelKey: "stats.stealsPerGame",
    value: (stats) =>
      stats.gamesPlayed > 0
        ? (stats.steals / stats.gamesPlayed).toFixed(1)
        : "0.0",
  },
  {
    key: "blocksPerGame",
    labelKey: "stats.blocksPerGame",
    value: (stats) =>
      stats.gamesPlayed > 0
        ? (stats.blocks / stats.gamesPlayed).toFixed(1)
        : "0.0",
  },
  {
    key: "turnoversPerGame",
    labelKey: "stats.turnoversPerGame",
    value: (stats) =>
      stats.gamesPlayed > 0
        ? (stats.turnovers / stats.gamesPlayed).toFixed(1)
        : "0.0",
  },
  {
    key: "foulsPerGame",
    labelKey: "stats.foulsPerGame",
    value: (stats) =>
      stats.gamesPlayed > 0
        ? (stats.fouls / stats.gamesPlayed).toFixed(1)
        : "0.0",
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
      className="mb-8"
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
