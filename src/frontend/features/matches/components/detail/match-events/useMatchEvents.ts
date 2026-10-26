// src/frontend/features/matches/components/detail/match-events/useMatchEvents.ts
import { useCallback, useMemo, useState } from "react";

import { Quarter } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import type { EventCategory } from "@/shared/constants";

import {
  filterPlays,
  groupByPeriod,
  groupPlays,
  hasOvertime,
  scoreEvents,
  scorePeriods,
} from "./matchEventsView";

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
 *   the whole match; and the filter values and setters for the panel
 */
export function useMatchEvents(
  events: readonly MatchEvent[],
  homeTeamId: number,
  awayTeamId: number,
) {
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>(Quarter.ALL);
  const [latestFirst, setLatestFirst] = useState(false);
  const [selectedEventCategory, setSelectedEventCategory] = useState<
    EventCategory | undefined
  >(undefined);
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

  const scoredEvents = useMemo(
    () => scoreEvents(events, homeTeamId, awayTeamId),
    [events, homeTeamId, awayTeamId],
  );

  const plays = useMemo(() => groupPlays(scoredEvents), [scoredEvents]);

  const shownPlays = useMemo(
    () =>
      filterPlays(plays, {
        quarter: selectedQuarter,
        category: selectedEventCategory,
        playerIds: selectedPlayerIds,
        latestFirst,
      }),
    [
      plays,
      selectedQuarter,
      selectedEventCategory,
      selectedPlayerIds,
      latestFirst,
    ],
  );

  const periods = useMemo(() => groupByPeriod(shownPlays), [shownPlays]);
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
      selectedEventCategory,
      setSelectedEventCategory,
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
