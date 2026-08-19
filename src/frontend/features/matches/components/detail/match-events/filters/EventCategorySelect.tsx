// src/frontend/features/matches/components/detail/match-events/filters/EventCategorySelect.tsx
import { useTranslations } from "next-intl";

import { Select } from "@/shared/components/forms";
import { EventCategory } from "@/shared/constants";

interface EventCategorySelectProps {
  readonly value: EventCategory | undefined;
  readonly onChange: (value: EventCategory | undefined) => void;
}

/**
 * Single-select for narrowing the match event timeline to one category.
 *
 * `undefined` is "all events" and is what the empty option maps to — the empty
 * string is an internal `Select` value and never reaches `onChange`.
 *
 * The option list is **hand-maintained against `EventCategory`** rather than
 * derived from it, so a category added to the constant does not appear here
 * until it is added below as well. The omission is silent: filtering simply
 * never offers it.
 */
export function EventCategorySelect({
  value,
  onChange,
}: EventCategorySelectProps) {
  const t = useTranslations("matches");

  const options = [
    { value: "", label: t("matchEvents.allEvents") },
    { value: EventCategory.MADE, label: t("matchEvents.made") },
    { value: EventCategory.MISS, label: t("matchEvents.miss") },
    { value: EventCategory.DEFENSIVE, label: t("matchEvents.defensive") },
    { value: EventCategory.FOUL, label: t("matchEvents.fouls") },
    { value: EventCategory.TURNOVER, label: t("matchEvents.turnovers") },
    {
      value: EventCategory.SUBSTITUTION,
      label: t("matchEvents.substitutions"),
    },
    { value: EventCategory.REBOUND, label: t("matchEvents.rebounds") },
  ];

  return (
    <Select
      value={value ?? ""}
      onChange={(val) => onChange((val as EventCategory) || undefined)}
      options={options}
      className="w-fit"
    />
  );
}

export default EventCategorySelect;
