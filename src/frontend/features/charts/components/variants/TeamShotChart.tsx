// src/frontend/features/charts/components/variants/TeamShotChart.tsx
import React from "react";

import type { MatchEvent } from "@/features/matches/types";
import { Section } from "@/shared/components/blocks";
import { ErrorMessage, LoadingSpinner } from "@/shared/components/feedback";
import { Text } from "@/shared/components/typography";

import { ChartType } from "../../constants";
import ShotChart from "../ShotChart";

interface TeamShotChartProps {
  matchEvents: MatchEvent[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: string | null;
}

export const TeamShotChart: React.FC<TeamShotChartProps> = ({
  matchEvents,
  title,
  description,
  isLoading,
  error,
}) => {
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="py-8 flex justify-center">
          <LoadingSpinner />
        </div>
      );
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }
    return (
      <ShotChart chartType={ChartType.HEATMAP} matchEvents={matchEvents} />
    );
  };

  return (
    <Section title={title} variant="highlighted">
      <div className="w-full max-w-3xl mx-auto">
        {renderChart()}
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
