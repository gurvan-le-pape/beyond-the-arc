// src/frontend/features/matches/components/detail/match-events/index.tsx
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

import { eventCategories, Quarter } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import {
  getEventStyle,
  getQuarterFromTimestamp,
  getTeamIdFromEvent,
  pointsForEvent,
} from "@/features/matches/utils";
import type { TeamInfoExtended } from "@/features/teams/types";
import { Section } from "@/shared/components/blocks";
import { EmptyState } from "@/shared/components/feedback";
import { EventCategory } from "@/shared/constants";

import { MatchEventsFilters } from "./filters/MatchEventsFilters";
import { MatchEventsTimeline } from "./timeline/MatchEventsTimeline";

interface MatchEventsProps {
  readonly events: MatchEvent[];
  readonly homeTeam: TeamInfoExtended;
  readonly awayTeam: TeamInfoExtended;
  readonly matchDate: Date | string;
}

/**
 * Match events component.
 * Owns all filter/sort state, computes the enriched event list in a single
 * O(n) pass, and delegates rendering to MatchEventsFilters + MatchEventsTimeline.
 */
export function MatchEvents({
  events,
  homeTeam,
  awayTeam,
  matchDate,
}: MatchEventsProps) {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");

  // ---- filter / sort state ------------------------------------------------
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>(Quarter.ALL);
  const [latestFirst, setLatestFirst] = useState(false);
  const [selectedEventCategory, setSelectedEventCategory] = useState<
    EventCategory | undefined
  >(undefined);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<number>>(
    new Set(),
  );
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);

  // ---- stable callbacks ----------------------------------------------------
  const togglePlayer = useCallback((playerId: number) => {
    setSelectedPlayerIds((prev) => {
      const next = new Set(prev);
      next.has(playerId) ? next.delete(playerId) : next.add(playerId);
      return next;
    });
  }, []);

  // ---- derived data --------------------------------------------------------

  /**
   * Single-pass O(n) scoring.
   * Each element carries the cumulative home/away score *after* that event,
   * plus the resolved teamId and quarter number.
   */
  const eventsWithScore = useMemo(() => {
    let homeScore = 0;
    let awayScore = 0;

    return events.map((event) => {
      const style = getEventStyle(event.eventType);
      const teamId = getTeamIdFromEvent(event);
      const quarter = getQuarterFromTimestamp(event.occurredAt, matchDate);

      if (style.eventCategory === EventCategory.MADE) {
        const points = pointsForEvent(event.eventType, style);
        if (teamId === homeTeam.id) homeScore += points;
        else if (teamId === awayTeam.id) awayScore += points;
      }

      return { ...event, homeScore, awayScore, teamId, quarter };
    });
  }, [events, homeTeam.id, awayTeam.id, matchDate]);

  /** Apply quarter → category → player filters, then optional sort. */
  const filteredEvents = useMemo(() => {
    let result = eventsWithScore;

    if (selectedQuarter !== Quarter.ALL) {
      const quarterNum = Number.parseInt(selectedQuarter.replace("Q", ""));
      result = result.filter((e) => e.quarter === quarterNum);
    }

    if (selectedEventCategory !== undefined) {
      const allowed = eventCategories[selectedEventCategory] || [];
      result = result.filter((e) => allowed.includes(e.eventType));
    }

    if (selectedPlayerIds.size > 0) {
      result = result.filter((e) => {
        const ids = e.players?.map((p) => p.player.id) || [];
        return ids.some((id) => selectedPlayerIds.has(id));
      });
    }

    return latestFirst ? [...result].reverse() : result;
  }, [
    eventsWithScore,
    selectedQuarter,
    selectedEventCategory,
    selectedPlayerIds,
    latestFirst,
  ]);

  // ---- early return for empty data -----------------------------------------
  if (!events || events.length === 0) {
    return (
      <Section title={tMatches("matchEvents.title")} variant="highlighted">
        <EmptyState
          title={tCommon("noData")}
          message={tMatches("matchEvents.noEvents")}
        />
      </Section>
    );
  }

  // ---- render --------------------------------------------------------------
  return (
    <Section title={tMatches("matchEvents.title")} variant="highlighted">
      <div className="mb-6">
        <MatchEventsFilters
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          selectedQuarter={selectedQuarter}
          setSelectedQuarter={setSelectedQuarter}
          selectedEventCategory={selectedEventCategory}
          setSelectedEventCategory={setSelectedEventCategory}
          selectedPlayerIds={selectedPlayerIds}
          setSelectedPlayerIds={setSelectedPlayerIds}
          togglePlayer={togglePlayer}
          showPlayerDropdown={showPlayerDropdown}
          setShowPlayerDropdown={setShowPlayerDropdown}
          latestFirst={latestFirst}
          setLatestFirst={setLatestFirst}
        />
      </div>

      <MatchEventsTimeline
        events={filteredEvents}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        getEventStyle={getEventStyle}
        matchDate={matchDate}
      />
    </Section>
  );
}

export default MatchEvents;
