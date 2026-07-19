// src/frontend/features/matches/components/detail/match-events/filters/MatchEventsFilters.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { Quarter } from "@/features/matches/constants";
import type { TeamInfoExtended } from "@/features/teams/types";
import type { EventCategory } from "@/shared/constants";

import { EventCategorySelect } from "./EventCategorySelect";
import { PlayerDropdownFilter } from "./PlayerDropdownFilter";
import { QuarterSelector } from "./QuarterSelector";
import { TimelineOrderToggle } from "./TimelineOrderToggle";

interface MatchEventsFiltersProps {
  homeTeam: TeamInfoExtended;
  awayTeam: TeamInfoExtended;
  selectedQuarter: Quarter;
  setSelectedQuarter: (q: Quarter) => void;
  selectedEventCategory: EventCategory | undefined;
  setSelectedEventCategory: (ec: EventCategory | undefined) => void;
  selectedPlayerIds: Set<number>;
  setSelectedPlayerIds: (ids: Set<number>) => void;
  togglePlayer: (id: number) => void;
  showPlayerDropdown: boolean;
  setShowPlayerDropdown: (show: boolean) => void;
  latestFirst: boolean;
  setLatestFirst: (b: boolean) => void;
}

/**
 * Filter bar for the match-events timeline.
 * Composes QuarterSelector, a category <Select>, PlayerFilter, and a
 * latest-first toggle into a single responsive row.
 */
export const MatchEventsFilters: React.FC<MatchEventsFiltersProps> = ({
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
}) => {
  const t = useTranslations("matches");

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Quarter pills */}
      <QuarterSelector
        selected={selectedQuarter}
        onChange={setSelectedQuarter}
      />

      {/* Category dropdown */}
      <EventCategorySelect
        value={selectedEventCategory}
        onChange={setSelectedEventCategory}
      />

      {/* Player multi-select */}
      <PlayerDropdownFilter
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        selectedPlayerIds={selectedPlayerIds}
        setSelectedPlayerIds={setSelectedPlayerIds}
        togglePlayer={togglePlayer}
        isOpen={showPlayerDropdown}
        setIsOpen={setShowPlayerDropdown}
      />

      {/* Latest-first toggle */}
      <TimelineOrderToggle
        checked={latestFirst}
        onChange={setLatestFirst}
        label={t("matchEvents.latestFirst")}
      />
    </div>
  );
};

export default MatchEventsFilters;
