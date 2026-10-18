// src/frontend/features/charts/components/variants/TeamShotChart.tsx

import type { Shot } from "@/features/matches/types";
import { Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";

import { ChartType } from "../../constants";
import ShotChart from "../shot-chart";

interface TeamShotChartProps {
  readonly shots: Shot[];
  readonly title?: string;
  readonly description?: string;
}

/** The team detail's shot chart — pins `ShotChart` to the heatmap variant so team pages do not choose a chart type. */
export function TeamShotChart({
  shots,
  title,
  description,
}: TeamShotChartProps) {
  return (
    <Section title={title}>
      <div className="w-full max-w-3xl mx-auto">
        <ShotChart chartType={ChartType.HEATMAP} shots={shots} />
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
