// src/frontend/features/matches/components/detail/match-events/useMatchEvents.ts
import { useCallback, useEffect, useMemo, useState } from "react";

import { Quarter } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import type { EventCategory } from "@/shared/constants";

import { hasOvertime } from "./gameClock";
import { groupPlays, type Play, scoreEvents } from "./plays";
import {
  categoryOf,
  countCategories,
  DEFAULT_CATEGORIES,
  FILTERABLE_CATEGORIES,
  filterPlays,
  groupByPeriod,
  type PeriodPlays,
  playRowId,
  scorePeriods,
} from "./timeline";

// How long a play the reader jumped to stays highlighted.
const HIGHLIGHT_MS = 2000;

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
 * `revealPlay` jumps to a play from outside the list, such as the flow chart:
 * it widens the filters to show the play if they hide it, then scrolls the
 * play's row into view, moves focus to it and highlights it for a moment.
 *
 * @param events - the match's events, in order
 * @param homeTeamId - the home side's team id
 * @param awayTeamId - the away side's team id
 * @returns every play of the match, for the flow above the timeline; the
 *   plays to show, one run per period; each period's score, from the whole
 *   match; the play to highlight and how to reveal one; and the filter values
 *   and setters for the panel, with how many rows are shown out of how many
 *   the match has
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

  const periods = useMemo(() => groupByPeriod(shownPlays), [shownPlays]);
  const categoryCounts = useMemo(() => countCategories(events), [events]);
  // Counted through `groupByPeriod`, so the rows it drops (the period ends)
  // are left out of the total the same way they are left out of the list.
  const totalRows = useMemo(() => countRows(groupByPeriod(plays)), [plays]);

  const periodScores = useMemo(
    () => scorePeriods(scoredEvents),
    [scoredEvents],
  );

  const [revealedPlayId, setRevealedPlayId] = useState<number | null>(null);

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
      setRevealedPlayId(play.lead.id);
    },
    [shownPlays],
  );

  // Runs after the render that shows the play, so its row exists by then.
  useEffect(() => {
    if (revealedPlayId === null) return;
    const row = document.getElementById(playRowId(revealedPlayId));
    const reduceMotion = globalThis.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    row?.scrollIntoView({
      block: "center",
      behavior: reduceMotion ? "auto" : "smooth",
    });
    row?.focus({ preventScroll: true });
    const timer = setTimeout(() => setRevealedPlayId(null), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [revealedPlayId]);

  return {
    plays,
    periods,
    periodScores,
    revealedPlayId,
    revealPlay,
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
      latestFirst,
      setLatestFirst,
    },
  };
}
