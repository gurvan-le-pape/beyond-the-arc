// src/frontend/shared/components/charts/variants/TeamShotChart.tsx
import React from "react";

import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import { ShotChart } from "@/shared/components/charts";
import { Card } from "@/shared/components/ui";
import { ChartType } from "@/shared/constants/chart-types";

interface TeamShotChartProps {
  shots: MatchEvent[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: string | null;
}

export const TeamShotChart: React.FC<TeamShotChartProps> = ({
  shots,
  title,
  description,
  isLoading,
  error,
}) => (
  <Card variant="highlighted" padding="lg">
    {title && (
      <h2 className="text-subtitle font-bold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h2>
    )}

    <div className="flex flex-col items-center min-h-[300px] w-full">
      {isLoading ? (
        <div className="py-12 text-body text-gray-600 dark:text-gray-400">
          Loading...
        </div>
      ) : error ? (
        <div className="py-12 text-body text-error-DEFAULT dark:text-error-light">
          {error}
        </div>
      ) : (
        <ShotChart chartType={ChartType.HEATMAP} shots={shots} />
      )}
    </div>

    {description && (
      <p className="text-body-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
        {description}
      </p>
    )}
  </Card>
);

export default TeamShotChart;
