// src/frontend/features/charts/components/variants/PlayerShotChart.tsx

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

/** The player detail's shot chart — pins `ShotChart` to the hotspots variant so player pages do not choose a chart type. */
export function PlayerShotChart({
  matchEvents,
  title,
  description,
}: PlayerShotChartProps) {
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
}

export default PlayerShotChart;
