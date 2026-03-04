// src/frontend/features/teams/components/detail/TeamInfo.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Card, InfoBox } from "@/shared/components/ui";

interface StatConfig {
  key: string;
  labelKey: string;
  value: (stats: any) => string | number;
  highlight?: boolean;
}

interface TeamInfoProps {
  stats: any;
  title?: string;
  statsConfig?: StatConfig[];
  gridCols?: string;
}

const defaultTeamStatsConfig: StatConfig[] = [
  {
    key: "players",
    labelKey: "teamDetail.players",
    value: (stats) => stats.players,
    highlight: true,
  },
  {
    key: "pointsPerGame",
    labelKey: "teamDetail.pointsPerGame",
    value: (stats) =>
      stats.totalGames > 0
        ? (stats.points / stats.totalGames).toFixed(1)
        : "0.0",
  },
  {
    key: "reboundsPerGame",
    labelKey: "teamDetail.reboundsPerGame",
    value: (stats) =>
      stats.totalGames > 0
        ? (stats.rebounds / stats.totalGames).toFixed(1)
        : "0.0",
  },
  {
    key: "assistsPerGame",
    labelKey: "teamDetail.assistsPerGame",
    value: (stats) =>
      stats.totalGames > 0
        ? (stats.assists / stats.totalGames).toFixed(1)
        : "0.0",
  },
  {
    key: "stealsPerGame",
    labelKey: "teamDetail.stealsPerGame",
    value: (stats) =>
      stats.totalGames > 0
        ? (stats.steals / stats.totalGames).toFixed(1)
        : "0.0",
  },
  {
    key: "blocksPerGame",
    labelKey: "teamDetail.blocksPerGame",
    value: (stats) =>
      stats.totalGames > 0
        ? (stats.blocks / stats.totalGames).toFixed(1)
        : "0.0",
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
    <Card variant="highlighted" padding="lg">
      {title && (
        <h2 className="text-subtitle font-bold text-gray-900 dark:text-gray-100 mb-4">
          {title || t("teamDetail.teamStatsTitle")}
        </h2>
      )}
      <div className={`grid ${gridClass} gap-4`}>
        {config.map((stat) => (
          <InfoBox
            key={stat.key}
            label={t(stat.labelKey)}
            value={stat.value(stats)}
          />
        ))}
      </div>
    </Card>
  );
};

export default TeamInfo;
