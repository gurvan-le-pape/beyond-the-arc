// src/frontend/features/matches/components/detail/events/filters/EventCategorySelect.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Select } from "@/shared/components/ui";
import { EventCategory } from "@/shared/constants/event-categories";

interface EventCategorySelectProps {
  value: EventCategory;
  onChange: (value: EventCategory) => void;
  className?: string;
}

export const EventCategorySelect: React.FC<EventCategorySelectProps> = ({
  value,
  onChange,
  className,
}) => {
  const t = useTranslations("matches");
  return (
    <Select
      id="category-filter"
      value={value}
      onChange={(e) => onChange(e.target.value as EventCategory)}
      className={className || "w-auto min-w-[160px]"}
    >
      <option value={EventCategory.ALL}>{t("matchEvents.allEvents")}</option>
      <option value={EventCategory.SCORING}>{t("matchEvents.scoring")}</option>
      <option value={EventCategory.DEFENSIVE}>
        {t("matchEvents.defensive")}
      </option>
      <option value={EventCategory.FOUL}>{t("matchEvents.fouls")}</option>
      <option value={EventCategory.TURNOVER}>
        {t("matchEvents.turnovers")}
      </option>
      <option value={EventCategory.SUBSTITUTION}>
        {t("matchEvents.substitutions")}
      </option>
    </Select>
  );
};

export default EventCategorySelect;
