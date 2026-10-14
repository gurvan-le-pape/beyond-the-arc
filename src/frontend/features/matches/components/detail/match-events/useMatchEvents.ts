// src/frontend/features/matches/components/detail/match-events/useMatchEvents.ts
import { useCallback, useMemo, useState } from "react";

import { Quarter } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import type { EventCategory } from "@/shared/constants";

import { filterEvents, scoreEvents } from "./matchEventsView";

/**
 * The timeline's filter state and the events it selects.
 *
 * Scoring runs once per match; filtering runs on every change of filter, over
 * the already scored list, so the running score is the match's and not the
 * filtered subset's.
 *
 * @param events - the match's events, in order
 * @param homeTeamId - the home side's team id
 * @param awayTeamId - the away side's team id
 * @param matchDate - tip-off, from which each event's quarter is derived
 * @returns the events to show, and the filter values and setters for the panel
 */
export function useMatchEvents(
  events: readonly MatchEvent[],
  homeTeamId: number,
  awayTeamId: number,
  matchDate: Date | string,
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
    () => scoreEvents(events, homeTeamId, awayTeamId, matchDate),
    [events, homeTeamId, awayTeamId, matchDate],
  );

  const filteredEvents = useMemo(
    () =>
      filterEvents(scoredEvents, {
        quarter: selectedQuarter,
        category: selectedEventCategory,
        playerIds: selectedPlayerIds,
        latestFirst,
      }),
    [
      scoredEvents,
      selectedQuarter,
      selectedEventCategory,
      selectedPlayerIds,
      latestFirst,
    ],
  );

  return {
    filteredEvents,
    filters: {
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
