// src/frontend/features/charts/components/variants/TeamShotChart.tsx

import type { MatchEvent } from "@/features/matches/types";
import { Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";

import { ChartType } from "../../constants";
import ShotChart from "../ShotChart";

interface TeamShotChartProps {
  readonly matchEvents: MatchEvent[];
  readonly title?: string;
  readonly description?: string;
}

/** The team detail's shot chart — pins `ShotChart` to the heatmap variant so team pages do not choose a chart type. */
export function TeamShotChart({
  matchEvents,
  title,
  description,
}: TeamShotChartProps) {
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
}

export default TeamShotChart;
