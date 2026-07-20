// src/frontend/features/teams/components/detail/TeamInfo.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { TeamSeasonStats } from "@/features/teams/types";
import { InfoBox, Section } from "@/shared/components/blocks";

interface StatConfig {
  key: string;
  labelKey: string;
  value: (stats: TeamSeasonStats) => string | number;
  highlight?: boolean;
}

interface TeamInfoProps {
  stats: TeamSeasonStats;
  title?: string;
  statsConfig?: StatConfig[];
  gridCols?: string;
}

const defaultTeamStatsConfig: StatConfig[] = [
  {
    key: "players",
    labelKey: "teamDetail.players",
    value: (stats) => stats.players ?? "N/A",
    highlight: true,
  },
  {
    key: "pointsPerGame",
    labelKey: "teamDetail.pointsPerGame",
    value: (stats) =>
      stats.gamesPlayed > 0 ? stats.pointsPerGame.toFixed(1) : "0.0",
  },
  {
    key: "reboundsPerGame",
    labelKey: "teamDetail.reboundsPerGame",
    value: (stats) =>
      stats.gamesPlayed > 0 ? stats.reboundsPerGame.toFixed(1) : "0.0",
  },
  {
    key: "assistsPerGame",
    labelKey: "teamDetail.assistsPerGame",
    value: (stats) =>
      stats.gamesPlayed > 0 ? stats.assistsPerGame.toFixed(1) : "0.0",
  },
  {
    key: "stealsPerGame",
    labelKey: "teamDetail.stealsPerGame",
    value: (stats) =>
      stats.gamesPlayed > 0 ? stats.stealsPerGame.toFixed(1) : "0.0",
  },
  {
    key: "blocksPerGame",
    labelKey: "teamDetail.blocksPerGame",
    value: (stats) =>
      stats.gamesPlayed > 0 ? stats.blocksPerGame.toFixed(1) : "0.0",
  },
];

export const TeamInfo: React.FC<TeamInfoProps> = ({
  stats,
  title,
  statsConfig,
  gridCols,
}) => {
  const t = useTranslations("teams");
  const config = statsConfig || defaultTeamStatsConfig;
  const gridClass = gridCols || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <Section
      title={title || t("teamDetail.teamStatsTitle")}
      variant="highlighted"
    >
      <div className={`grid ${gridClass} gap-4`}>
        {config.map((stat) => (
          <InfoBox
            key={stat.key}
            label={t(stat.labelKey)}
            value={stat.value(stats)}
          />
        ))}
      </div>
    </Section>
  );
};

export default TeamInfo;
