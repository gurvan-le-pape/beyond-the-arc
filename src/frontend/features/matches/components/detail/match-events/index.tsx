// src/frontend/features/matches/components/detail/match-events/index.tsx
"use client";

import { useTranslations } from "next-intl";

import type { MatchEvent, MatchTeamWithStats } from "@/features/matches/types";
import { getEventStyle } from "@/features/matches/utils";
import { Section } from "@/shared/components/blocks";
import { EmptyState } from "@/shared/components/feedback";

import { EventFilters } from "./event-filters";
import { EventTimeline } from "./event-timeline";
import { MatchFlow } from "./match-flow";
import { useMatchEvents } from "./useMatchEvents";

interface MatchEventsProps {
  readonly events: MatchEvent[];
  readonly homeTeam: MatchTeamWithStats;
  readonly awayTeam: MatchTeamWithStats;
  readonly matchDate: Date | string;
}

/**
 * The match's play-by-play: the match's shape (figures and the score-margin
 * chart), then filters over a timeline. The state and the event list live in
 * `useMatchEvents`; this lays out the three parts.
 */
export function MatchEvents({
  events,
  homeTeam,
  awayTeam,
  matchDate,
}: MatchEventsProps) {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");

  const { plays, shownPlays, revealedPlayId, revealPlay, filters } =
    useMatchEvents(events, homeTeam.id, awayTeam.id);

  if (!events || events.length === 0) {
    return (
      <Section title={tMatches("matchEvents.title")}>
        <EmptyState
          title={tCommon("noData")}
          message={tMatches("matchEvents.noEvents")}
        />
      </Section>
    );
  }

  return (
    <Section title={tMatches("matchEvents.title")}>
      <div className="mb-6">
        <MatchFlow
          plays={plays}
          events={events}
          tipOff={matchDate}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          onGoToPlay={revealPlay}
        />
      </div>

      <div className="mb-6">
        <EventFilters homeTeam={homeTeam} awayTeam={awayTeam} {...filters} />
      </div>

      <EventTimeline
        plays={plays}
        shownPlays={shownPlays}
        latestFirst={filters.latestFirst}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        getEventStyle={getEventStyle}
        highlightedPlayId={revealedPlayId}
      />
    </Section>
  );
}
