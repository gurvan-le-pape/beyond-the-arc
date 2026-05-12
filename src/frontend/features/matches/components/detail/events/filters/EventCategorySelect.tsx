// src/frontend/features/matches/components/detail/events/filters/EventCategorySelect.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Select } from "@/shared/components/forms";
import { EventCategory } from "@/shared/constants/event-categories";

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
    { value: EventCategory.SCORING, label: t("matchEvents.scoring") },
    { value: EventCategory.DEFENSIVE, label: t("matchEvents.defensive") },
    { value: EventCategory.FOUL, label: t("matchEvents.fouls") },
    { value: EventCategory.TURNOVER, label: t("matchEvents.turnovers") },
    {
      value: EventCategory.SUBSTITUTION,
      label: t("matchEvents.substitutions"),
    },
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
