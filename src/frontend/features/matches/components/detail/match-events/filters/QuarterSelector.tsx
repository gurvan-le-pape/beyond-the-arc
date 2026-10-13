// src/frontend/features/matches/components/detail/match-events/filters/QuarterSelector.tsx
import { useTranslations } from "next-intl";

import { Quarter, QUARTER_LIST } from "@/features/matches/constants";
import { SegmentedControl } from "@/shared/components/primitives";

interface QuarterSelectorProps {
  readonly selected: Quarter;
  readonly onChange: (q: Quarter) => void;
}

/** The quarter the timeline shows, or all of them. */
export function QuarterSelector({ selected, onChange }: QuarterSelectorProps) {
  const t = useTranslations("matches");

  return (
    <SegmentedControl
      label={t("matchEvents.quarter")}
      value={selected}
      onChange={onChange}
      options={QUARTER_LIST.map((quarter) => ({
        value: quarter,
        label: quarter === Quarter.ALL ? t("matchEvents.allQuarters") : quarter,
      }))}
    />
  );
}

export default QuarterSelector;
