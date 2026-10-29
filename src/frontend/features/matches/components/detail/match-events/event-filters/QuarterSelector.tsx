// src/frontend/features/matches/components/detail/match-events/event-filters/QuarterSelector.tsx
import { useTranslations } from "next-intl";

import { Quarter, QUARTER_LIST } from "@/features/matches/constants";
import { SegmentedControl } from "@/shared/components/primitives";

interface QuarterSelectorProps {
  readonly selected: Quarter;
  readonly onChange: (q: Quarter) => void;
  /** Shows the overtime choice; a match decided in regulation has none. */
  readonly hasOvertime: boolean;
}

/**
 * The quarter the timeline shows, or all of them. Overtime is one choice
 * however many overtime periods were played.
 */
export function QuarterSelector({
  selected,
  onChange,
  hasOvertime,
}: QuarterSelectorProps) {
  const t = useTranslations("matches");

  const label = (quarter: Quarter) => {
    if (quarter === Quarter.ALL) return t("matchEvents.allQuarters");
    if (quarter === Quarter.OT) return t("overtimeShort");
    return quarter;
  };

  return (
    <SegmentedControl
      label={t("matchEvents.quarter")}
      value={selected}
      onChange={onChange}
      options={QUARTER_LIST.filter(
        (quarter) => hasOvertime || quarter !== Quarter.OT,
      ).map((quarter) => ({ value: quarter, label: label(quarter) }))}
    />
  );
}
