// src/frontend/features/matches/components/detail/match-events/filters/EventCategorySelect.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Select } from "@/shared/components/forms";
import { EventCategory } from "@/shared/constants";

interface EventCategorySelectProps {
  value: EventCategory | undefined;
  onChange: (value: EventCategory | undefined) => void;
}

export const EventCategorySelect: React.FC<EventCategorySelectProps> = ({
  value,
  onChange,
}) => {
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
};

export default EventCategorySelect;
