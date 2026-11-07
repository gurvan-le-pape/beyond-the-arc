// src/frontend/features/matches/components/detail/match-events/useMatchEvents.ts
import { useCallback, useEffect, useMemo, useState } from "react";

import { Quarter } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import type { EventCategory } from "@/shared/constants";

import {
  categoryOf,
  countCategories,
  countRows,
  DEFAULT_CATEGORIES,
  FILTERABLE_CATEGORIES,
  filterPlays,
} from "./playFilters";
import {
  groupPlays,
  hasOvertime,
  type Play,
  type PlayReveal,
  scoreEvents,
} from "./plays";

// How long a play the reader jumped to stays highlighted.
const HIGHLIGHT_MS = 2000;

/**
 * The timeline's filter state and the plays it selects.
 *
 * Scoring and folding into plays run once per match; filtering runs on every
 * change of filter, over the already scored plays, so the running score is
 * the match's and not the filtered subset's.
 *
 * `revealPlay` jumps to a play from outside the list, such as the flow chart:
 * it widens the filters to show the play if they hide it and highlights it
 * for a moment; the play's row brings itself into view on each reveal.
 *
 * @param events - the match's events, in order
 * @param homeTeamId - the home side's team id
 * @param awayTeamId - the away side's team id
 * @returns every play of the match, in match order; the plays to show, in
 *   display order; the current reveal and how to start one; and the
 *   filter values and setters for the panel, with how many rows are shown out
 *   of how many the match has
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

  const categoryCounts = useMemo(() => countCategories(events), [events]);
  const totalRows = useMemo(() => countRows(plays), [plays]);

  const [reveal, setReveal] = useState<PlayReveal | null>(null);

  const revealPlay = useCallback(
    (play: Play) => {
      if (!shownPlays.includes(play)) {
        setSelectedQuarter(Quarter.ALL);
        setSelectedPlayerIds(new Set());
        // The lead's category is enough: a play shows when any event matches.
        setSelectedCategories((prev) =>
          new Set(prev).add(categoryOf(play.lead)),
        );
      }
      setReveal({ playId: play.lead.id });
    },
    [shownPlays],
  );

  useEffect(() => {
    if (reveal === null) return;
    const timer = setTimeout(() => setReveal(null), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [reveal]);

  return {
    plays,
    shownPlays,
    reveal,
    revealPlay,
    filters: {
      hasOvertime: hasOvertime(events),
      selectedQuarter,
      setSelectedQuarter,
      selectedCategories,
      toggleCategory,
      showAllCategories,
      categoryCounts,
      shownRows: shownPlays.length,
      totalRows,
      selectedPlayerIds,
      setSelectedPlayerIds,
      togglePlayer,
      latestFirst,
      setLatestFirst,
    },
  };
}
