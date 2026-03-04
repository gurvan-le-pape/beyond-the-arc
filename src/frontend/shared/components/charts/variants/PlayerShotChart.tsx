// src/frontend/shared/components/charts/variants/PlayerShotChart.tsx
import React from "react";

import { ShotChart } from "@/shared/components/charts";
import { Section } from "@/shared/components/ui";
import { ChartType } from "@/shared/constants/chart-types";

interface PlayerShotChartProps {
  shots: any[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: string | null;
}

export const PlayerShotChart: React.FC<PlayerShotChartProps> = ({
  shots,
  title,
  description,
  isLoading,
  error,
}) => (
  <Section title={title} className="mb-6">
    <div className="flex flex-col items-center min-h-[300px] w-full">
      {isLoading ? (
        <div className="py-8">Loading...</div>
      ) : error ? (
        <div className="text-red-600 py-8">{error}</div>
      ) : (
        <ShotChart chartType={ChartType.HOTSPOTS} shots={shots} />
      )}
      {description && (
        <p className="text-gray-500 text-sm mt-2">{description}</p>
      )}
    </div>
  </Section>
);

export default PlayerShotChart;
