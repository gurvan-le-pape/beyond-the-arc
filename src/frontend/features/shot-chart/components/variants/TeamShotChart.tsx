// src/frontend/features/shot-chart/components/variants/TeamShotChart.tsx

import { Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";
import type { ShotEvent } from "@/shared/types";

import { ChartType } from "../../constants";
import ShotChart from "../shot-chart";

interface TeamShotChartProps {
  readonly shots: ShotEvent[];
  readonly title?: string;
  readonly description?: string;
}

/** The team detail's shot chart — pins `ShotChart` to the hotspots variant so team pages do not choose a chart type. */
export function TeamShotChart({
  shots,
  title,
  description,
}: TeamShotChartProps) {
  return (
    <Section title={title}>
      <div className="w-full max-w-md mx-auto">
        <ShotChart chartType={ChartType.HOTSPOTS} shots={shots} />
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
