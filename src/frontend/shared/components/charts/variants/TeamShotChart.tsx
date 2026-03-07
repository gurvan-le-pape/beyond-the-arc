// src/frontend/shared/components/charts/variants/TeamShotChart.tsx
import React from "react";

import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import { ShotChart } from "@/shared/components/charts";
import { ErrorMessage, LoadingSpinner, Section } from "@/shared/components/ui";
import { ChartType } from "@/shared/constants/chart-types";

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
    <Section title={title} variant="highlighted" className="mb-6">
      <div className="w-full max-w-3xl mx-auto">
        {renderChart()}
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            {description}
          </p>
        )}
      </div>
    </Section>
  );
};

export default TeamShotChart;
