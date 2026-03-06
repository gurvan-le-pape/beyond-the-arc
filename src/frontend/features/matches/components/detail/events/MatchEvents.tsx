// src/frontend/features/matches/components/detail/events/MatchEvents.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useCallback, useMemo, useState } from "react";

import { Quarter } from "@/features/matches/constants";
import { eventCategories } from "@/features/matches/constants/eventCategories";
import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import {
  getEventStyle,
  getQuarterFromTimestamp,
  getTeamIdFromEvent,
  makeDescriptionClickable,
  pointsForEvent,
} from "@/features/matches/utils/eventHelpers";
import type { TeamInfoExtended } from "@/features/teams/types/TeamInfo";
import { EmptyState } from "@/shared/components/ui";
import { Section } from "@/shared/components/ui";
import { EventCategory } from "@/shared/constants/event-categories";

import { MatchEventsFilters } from "./filters/MatchEventsFilters";
import { MatchEventsTimeline } from "./timeline/MatchEventsTimeline";

interface MatchEventsProps {
  events: MatchEvent[];
  homeTeam: TeamInfoExtended;
  awayTeam: TeamInfoExtended;
}

/**
 * Match events component.
 * Owns all filter/sort state, computes the enriched event list in a single
 * O(n) pass, and delegates rendering to MatchEventsFilters + MatchEventsTimeline.
 */
export const MatchEvents: React.FC<MatchEventsProps> = ({
  events,
  homeTeam,
  awayTeam,
}) => {
  const t = useTranslations("matches");

  // ---- filter / sort state ------------------------------------------------
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>(Quarter.ALL);
  const [latestFirst, setLatestFirst] = useState(false);
  const [selectedEventCategory, setSelectedEventCategory] =
    useState<EventCategory>(EventCategory.ALL);
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

  // First event timestamp is the match start anchor.
  const matchStartTime = events[0]?.timestamp;

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
      const quarter = getQuarterFromTimestamp(
        event.timestamp.toString(),
        matchStartTime.toString(),
      );

      if (style.eventCategory === EventCategory.SCORING) {
        const points = pointsForEvent(event.eventType, style);
        if (teamId === homeTeam.id) homeScore += points;
        else if (teamId === awayTeam.id) awayScore += points;
      }

      return { ...event, homeScore, awayScore, teamId, quarter };
    });
  }, [events, homeTeam.id, awayTeam.id, matchStartTime]);

  /** Apply quarter → category → player filters, then optional sort. */
  const filteredEvents = useMemo(() => {
    let result = eventsWithScore;

    if (selectedQuarter !== Quarter.ALL) {
      const quarterNum = Number.parseInt(selectedQuarter.replace("Q", ""));
      result = result.filter((e) => e.quarter === quarterNum);
    }

    if (selectedEventCategory !== EventCategory.ALL) {
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
      <Section title={t("matchEvents.title")}>
        <EmptyState message={t("matchEvents.noEvents")} />
      </Section>
    );
  }

  // ---- render --------------------------------------------------------------
  return (
    <Section
      title={
        <span className="text-primary-600 dark:text-primary-400">
          {t("matchEvents.title")}
        </span>
      }
      className="mt-6"
    >
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
        makeDescriptionClickable={makeDescriptionClickable}
      />
    </Section>
  );
};

export default MatchEvents;
