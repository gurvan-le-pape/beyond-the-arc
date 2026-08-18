// src/frontend/features/charts/components/headers/ScatterHeader.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Text } from "@/shared/components/typography";

/**
 * The scatter chart's legend. The glyphs must stay in sync with
 * `ScatterOverlay`'s — circle for a made shot, cross for a miss.
 */
export const ScatterHeader: React.FC = () => {
  const t = useTranslations("common");

  return (
    <div className="flex items-center gap-8 mb-2 ml-2">
      <span className="flex items-center gap-1.5">
        <svg width={22} height={22} aria-hidden="true">
          <circle
            cx={11}
            cy={11}
            r={8}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            className="text-success"
          />
        </svg>
        <Text variant="caption" as="span" className="text-text-heading">
          {t("shotChart.madeLabel")}
        </Text>
      </span>

      <span className="flex items-center gap-1.5">
        <svg width={22} height={22} aria-hidden="true">
          <line
            x1={4}
            y1={4}
            x2={18}
            y2={18}
            stroke="currentColor"
            strokeWidth={3}
            className="text-error"
          />
          <line
            x1={4}
            y1={18}
            x2={18}
            y2={4}
            stroke="currentColor"
            strokeWidth={3}
            className="text-error"
          />
        </svg>
        <Text variant="caption" as="span" className="text-text-heading">
          {t("shotChart.missedLabel")}
        </Text>
      </span>
    </div>
  );
};

export default ScatterHeader;
