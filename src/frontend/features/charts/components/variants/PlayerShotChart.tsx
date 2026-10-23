// src/frontend/features/charts/components/variants/PlayerShotChart.tsx

import type { Shot } from "@/features/matches/types";
import { Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";

import { ChartType } from "../../constants";
import ShotChart from "../shot-chart";

interface PlayerShotChartProps {
  readonly shots: Shot[];
  readonly title?: string;
  readonly description?: string;
}

/** The player detail's shot chart — pins `ShotChart` to the hotspots variant so player pages do not choose a chart type. */
export function PlayerShotChart({
  shots,
  title,
  description,
}: PlayerShotChartProps) {
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

export default PlayerShotChart;
