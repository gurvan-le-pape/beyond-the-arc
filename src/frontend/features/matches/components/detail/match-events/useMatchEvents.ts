// src/frontend/features/matches/components/detail/match-events/useMatchEvents.ts
import { useCallback, useMemo, useState } from "react";

import { Quarter } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import type { EventCategory } from "@/shared/constants";

import {
  countCategories,
  DEFAULT_CATEGORIES,
  FILTERABLE_CATEGORIES,
  filterPlays,
  groupByPeriod,
  groupPlays,
  hasOvertime,
  type PeriodPlays,
  scoreEvents,
  scorePeriods,
} from "./matchEventsView";

/**
 * How many rows the timeline draws for the given periods.
 *
 * @param periods - the periods to draw
 * @returns the number of plays across them
 */
function countRows(periods: readonly PeriodPlays[]): number {
  return periods.reduce((sum, period) => sum + period.plays.length, 0);
}

/**
 * The timeline's filter state and the plays it selects.
 *
 * Scoring and folding into plays run once per match; filtering runs on every
 * change of filter, over the already scored plays, so the running score is
 * the match's and not the filtered subset's.
 *
 * @param events - the match's events, in order
 * @param homeTeamId - the home side's team id
 * @param awayTeamId - the away side's team id
 * @returns the plays to show, one run per period; each period's score, from
 *   the whole match; and the filter values and setters for the panel, with
 *   how many rows are shown out of how many the match has
 */
export function useMatchEvents(
  events: readonly MatchEvent[],
  homeTeamId: number,
  awayTeamId: number,
) {
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>(Quarter.ALL);
  const [latestFirst, setLatestFirst] = useState(false);
  const [selectedCategories, setSelectedCategories] =
    useState<ReadonlySet<EventCategory>>(DEFAULT_CATEGORIES);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<number>>(
    new Set(),
  );
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);

  const togglePlayer = useCallback((playerId: number) => {
    setSelectedPlayerIds((prev) => {
      const next = new Set(prev);
      if (next.has(playerId)) next.delete(playerId);
      else next.add(playerId);
      return next;
    });
  }, []);

  const toggleCategory = useCallback((category: EventCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }, []);

  const showAllCategories = useCallback(
    () => setSelectedCategories(new Set(FILTERABLE_CATEGORIES)),
    [],
  );

  const scoredEvents = useMemo(
    () => scoreEvents(events, homeTeamId, awayTeamId),
    [events, homeTeamId, awayTeamId],
  );

  const plays = useMemo(() => groupPlays(scoredEvents), [scoredEvents]);

  const shownPlays = useMemo(
    () =>
      filterPlays(plays, {
        quarter: selectedQuarter,
        categories: selectedCategories,
        playerIds: selectedPlayerIds,
        latestFirst,
      }),
    [
      plays,
      selectedQuarter,
      selectedCategories,
      selectedPlayerIds,
      latestFirst,
    ],
  );

  const periods = useMemo(() => groupByPeriod(shownPlays), [shownPlays]);
  const categoryCounts = useMemo(() => countCategories(events), [events]);
  // Counted through `groupByPeriod`, so the rows it drops (the period ends)
  // are left out of the total the same way they are left out of the list.
  const totalRows = useMemo(() => countRows(groupByPeriod(plays)), [plays]);

  const periodScores = useMemo(
    () => scorePeriods(scoredEvents),
    [scoredEvents],
  );

  return {
    periods,
    periodScores,
    filters: {
      hasOvertime: hasOvertime(events),
      selectedQuarter,
      setSelectedQuarter,
      selectedCategories,
      toggleCategory,
      showAllCategories,
      categoryCounts,
      shownRows: countRows(periods),
      totalRows,
      selectedPlayerIds,
      setSelectedPlayerIds,
      togglePlayer,
      showPlayerDropdown,
      setShowPlayerDropdown,
      latestFirst,
      setLatestFirst,
    },
  };
}
