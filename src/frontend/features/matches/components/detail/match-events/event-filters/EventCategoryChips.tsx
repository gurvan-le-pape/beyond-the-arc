// src/frontend/features/matches/components/detail/match-events/event-filters/EventCategoryChips.tsx
import { useTranslations } from "next-intl";

import { EVENT_CATEGORY_COLOR } from "@/features/matches/constants";
import { ToggleChips } from "@/shared/components/primitives";
import { EventCategory } from "@/shared/constants";
import { cn } from "@/shared/utils";

import { FILTERABLE_CATEGORIES } from "../matchEventsView";

const LABEL_KEYS = {
  [EventCategory.MADE]: "made",
  [EventCategory.MISS]: "miss",
  [EventCategory.FOUL]: "fouls",
  [EventCategory.TURNOVER]: "turnovers",
  [EventCategory.DEFENSIVE]: "defensive",
  [EventCategory.REBOUND]: "rebounds",
  [EventCategory.SUBSTITUTION]: "substitutions",
  [EventCategory.INBOUND]: "inbounds",
} as const satisfies Record<(typeof FILTERABLE_CATEGORIES)[number], string>;

interface EventCategoryChipsProps {
  readonly selected: ReadonlySet<EventCategory>;
  readonly onToggle: (category: EventCategory) => void;
  /** The match's events per category, shown on each chip. */
  readonly counts: ReadonlyMap<EventCategory, number>;
}

/**
 * One chip per kind of event, each switching its kind on or off in the
 * timeline, with how many the match has and a dot in the kind's colour.
 *
 * The chips are `FILTERABLE_CATEGORIES`, and `LABEL_KEYS` must name each one:
 * the `satisfies` clause fails the build on a category with no label.
 */
export function EventCategoryChips({
  selected,
  onToggle,
  counts,
}: EventCategoryChipsProps) {
  const t = useTranslations("matches.matchEvents");

  return (
    <ToggleChips
      label={t("categoryLabel")}
      selected={selected}
      onToggle={onToggle}
      options={FILTERABLE_CATEGORIES.map((category) => ({
        value: category,
        label: t(LABEL_KEYS[category]),
        count: counts.get(category) ?? 0,
        marker: (
          <span
            aria-hidden="true"
            className={cn(
              "size-2 rounded-full bg-current",
              EVENT_CATEGORY_COLOR[category],
            )}
          />
        ),
      }))}
    />
  );
}
