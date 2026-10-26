// src/frontend/features/matches/components/detail/match-events/event-filters/index.tsx
import { useTranslations } from "next-intl";

import type { Quarter } from "@/features/matches/constants";
import type { MatchTeamWithStats } from "@/features/matches/types";
import { Button } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import type { EventCategory } from "@/shared/constants";

import { EventCategoryChips } from "./EventCategoryChips";
import { PlayerDropdownFilter } from "./PlayerDropdownFilter";
import { QuarterSelector } from "./QuarterSelector";
import { TimelineOrderToggle } from "./TimelineOrderToggle";

interface EventFiltersProps {
  readonly homeTeam: MatchTeamWithStats;
  readonly awayTeam: MatchTeamWithStats;
  /** Offers the overtime choice in the quarter selector. */
  readonly hasOvertime: boolean;
  readonly selectedQuarter: Quarter;
  readonly setSelectedQuarter: (q: Quarter) => void;
  readonly selectedCategories: ReadonlySet<EventCategory>;
  readonly toggleCategory: (category: EventCategory) => void;
  readonly showAllCategories: () => void;
  /** The match's events per filterable category. */
  readonly categoryCounts: ReadonlyMap<EventCategory, number>;
  /** Rows the timeline shows now, and rows it would show unfiltered. */
  readonly shownRows: number;
  readonly totalRows: number;
  readonly selectedPlayerIds: Set<number>;
  readonly setSelectedPlayerIds: (ids: Set<number>) => void;
  readonly togglePlayer: (id: number) => void;
  readonly showPlayerDropdown: boolean;
  readonly setShowPlayerDropdown: (show: boolean) => void;
  readonly latestFirst: boolean;
  readonly setLatestFirst: (b: boolean) => void;
}

/**
 * Filter panel for the match-events timeline: the quarter, the players and
 * the order on one row, the event-kind chips below, then how many rows are
 * shown, with a way back to every kind while any is switched off.
 */
export function EventFilters({
  homeTeam,
  awayTeam,
  hasOvertime,
  selectedQuarter,
  setSelectedQuarter,
  selectedCategories,
  toggleCategory,
  showAllCategories,
  categoryCounts,
  shownRows,
  totalRows,
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <QuarterSelector
          selected={selectedQuarter}
          onChange={setSelectedQuarter}
          hasOvertime={hasOvertime}
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

      <EventCategoryChips
        selected={selectedCategories}
        onToggle={toggleCategory}
        counts={categoryCounts}
      />

      <div className="flex flex-wrap items-center gap-x-1">
        <Text variant="caption" as="p" aria-live="polite">
          {t("matchEvents.shownRows", { shown: shownRows, total: totalRows })}
        </Text>
        {selectedCategories.size < categoryCounts.size && (
          <Button variant="link" size="sm" onClick={showAllCategories}>
            {t("matchEvents.showAllCategories")}
          </Button>
        )}
      </div>
    </div>
  );
}
