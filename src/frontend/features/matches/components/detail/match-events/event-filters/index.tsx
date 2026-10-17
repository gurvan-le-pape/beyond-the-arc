// src/frontend/features/matches/components/detail/match-events/event-filters/index.tsx
import { useTranslations } from "next-intl";

import type { Quarter } from "@/features/matches/constants";
import type { TeamInfoExtended } from "@/features/teams/types";
import type { EventCategory } from "@/shared/constants";

import { EventCategorySelect } from "./EventCategorySelect";
import { PlayerDropdownFilter } from "./PlayerDropdownFilter";
import { QuarterSelector } from "./QuarterSelector";
import { TimelineOrderToggle } from "./TimelineOrderToggle";

interface EventFiltersProps {
  readonly homeTeam: TeamInfoExtended;
  readonly awayTeam: TeamInfoExtended;
  readonly selectedQuarter: Quarter;
  readonly setSelectedQuarter: (q: Quarter) => void;
  readonly selectedEventCategory: EventCategory | undefined;
  readonly setSelectedEventCategory: (ec: EventCategory | undefined) => void;
  readonly selectedPlayerIds: Set<number>;
  readonly setSelectedPlayerIds: (ids: Set<number>) => void;
  readonly togglePlayer: (id: number) => void;
  readonly showPlayerDropdown: boolean;
  readonly setShowPlayerDropdown: (show: boolean) => void;
  readonly latestFirst: boolean;
  readonly setLatestFirst: (b: boolean) => void;
}

/**
 * Filter bar for the match-events timeline.
 * Composes QuarterSelector, a category <Select>, PlayerFilter, and a
 * latest-first toggle into a single responsive row.
 */
export function EventFilters({
  homeTeam,
  awayTeam,
  selectedQuarter,
  setSelectedQuarter,
  selectedEventCategory,
  setSelectedEventCategory,
  selectedPlayerIds,
  setSelectedPlayerIds,
  togglePlayer,
  showPlayerDropdown,
  setShowPlayerDropdown,
  latestFirst,
  setLatestFirst,
}: EventFiltersProps) {
  const t = useTranslations("matches");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QuarterSelector
        selected={selectedQuarter}
        onChange={setSelectedQuarter}
      />

      <EventCategorySelect
        value={selectedEventCategory}
        onChange={setSelectedEventCategory}
      />

      <PlayerDropdownFilter
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        selectedPlayerIds={selectedPlayerIds}
        setSelectedPlayerIds={setSelectedPlayerIds}
        togglePlayer={togglePlayer}
        isOpen={showPlayerDropdown}
        setIsOpen={setShowPlayerDropdown}
      />

      <TimelineOrderToggle
        checked={latestFirst}
        onChange={setLatestFirst}
        label={t("matchEvents.latestFirst")}
      />
    </div>
  );
}
