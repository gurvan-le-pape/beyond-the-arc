// src/frontend/features/charts/components/variants/PlayerShotChart.tsx
import React from "react";

import type { MatchEvent } from "@/features/matches/types";
import { Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";

import { ChartType } from "../../constants";
import ShotChart from "../ShotChart";

interface PlayerShotChartProps {
  matchEvents: MatchEvent[];
  title?: string;
  description?: string;
}

export const PlayerShotChart: React.FC<PlayerShotChartProps> = ({
  matchEvents,
  title,
  description,
}) => {
  return (
    <Section title={title} variant="highlighted">
      <div className="w-full max-w-3xl mx-auto">
        <ShotChart chartType={ChartType.HOTSPOTS} matchEvents={matchEvents} />
        {description && (
          <Text variant="caption" className="mt-4 text-center">
            {description}
          </Text>
        )}
      </div>
    </Section>
  );
};

export default PlayerShotChart;
