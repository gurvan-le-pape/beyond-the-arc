// src/frontend/features/matches/components/detail/match-events/index.tsx
"use client";

import { useTranslations } from "next-intl";

import type { MatchEvent } from "@/features/matches/types";
import { getEventStyle } from "@/features/matches/utils";
import type { TeamInfoExtended } from "@/features/teams/types";
import { Section } from "@/shared/components/blocks";
import { EmptyState } from "@/shared/components/feedback";

import { MatchEventsFilters } from "./filters/MatchEventsFilters";
import { MatchEventsTimeline } from "./timeline/MatchEventsTimeline";
import { useMatchEvents } from "./useMatchEvents";

interface MatchEventsProps {
  readonly events: MatchEvent[];
  readonly homeTeam: TeamInfoExtended;
  readonly awayTeam: TeamInfoExtended;
  readonly matchDate: Date | string;
}

/**
 * The match's play-by-play: filters over a timeline. The state and the event
 * list live in `useMatchEvents`; this lays out the two halves.
 */
export function MatchEvents({
  events,
  homeTeam,
  awayTeam,
  matchDate,
}: MatchEventsProps) {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");

  const { filteredEvents, filters } = useMatchEvents(
    events,
    homeTeam.id,
    awayTeam.id,
    matchDate,
  );

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

  return (
    <Section title={tMatches("matchEvents.title")} variant="highlighted">
      <div className="mb-6">
        <MatchEventsFilters
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          {...filters}
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
