// src/frontend/features/charts/components/variants/TeamShotChart.tsx
import React from "react";

import type { MatchEvent } from "@/features/matches/types";
import { Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";

import { ChartType } from "../../constants";
import ShotChart from "../ShotChart";

interface TeamShotChartProps {
  matchEvents: MatchEvent[];
  title?: string;
  description?: string;
}

/** The team detail's shot chart — pins `ShotChart` to the heatmap variant so team pages do not choose a chart type. */
export const TeamShotChart: React.FC<TeamShotChartProps> = ({
  matchEvents,
  title,
  description,
}) => {
  return (
    <Section title={title} variant="highlighted">
      <div className="w-full max-w-3xl mx-auto">
        <ShotChart chartType={ChartType.HEATMAP} matchEvents={matchEvents} />
        {description && (
          <Text variant="caption" className="mt-4 text-center">
            {description}
          </Text>
        )}
      </div>
    </Section>
  );
};

export default TeamShotChart;
