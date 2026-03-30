// src/frontend/shared/components/charts/variants/PlayerShotChart.tsx
import React from "react";

import type { MatchEvent } from "@/features/matches/types";
import { ShotChart } from "@/shared/components/charts";
import { ChartType } from "@/shared/constants/chart-types";

import { Section } from "../../blocks";
import { ErrorMessage, LoadingSpinner } from "../../feedback";

interface PlayerShotChartProps {
  matchEvents: MatchEvent[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: string | null;
}

export const PlayerShotChart: React.FC<PlayerShotChartProps> = ({
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
      <ShotChart chartType={ChartType.HOTSPOTS} matchEvents={matchEvents} />
    );
  };

  return (
    <Section title={title} variant="highlighted">
      <div className="w-full max-w-3xl mx-auto">
        {renderChart()}
        {description && (
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-4 text-center">
            {description}
          </p>
        )}
      </div>
    </Section>
  );
};

export default PlayerShotChart;
