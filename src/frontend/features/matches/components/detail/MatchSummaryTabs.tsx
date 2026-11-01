// src/frontend/features/matches/components/detail/MatchSummaryTabs.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import type {
  MatchEvent,
  MatchTeamWithStats,
  Shot,
} from "@/features/matches/types";
import { Tab, TabList, TabPanel, Tabs } from "@/shared/components/primitives";

import { MatchEvents } from "./match-events";
import { PlayerMatchStats } from "./player-match-stats";
import { TeamStatsComparison } from "./TeamStatsComparison";

interface MatchSummaryTabsProps {
  readonly homeTeam: MatchTeamWithStats;
  readonly awayTeam: MatchTeamWithStats;
  readonly matchEvents: MatchEvent[];
  readonly matchDate: Date | string;
  readonly playerShots: Record<number, Shot[]>;
}

/**
 * The tabbed body of the match summary page: team stats comparison, each
 * team's player stats, and the match event timeline. Owns its own tab state
 * and translations so the page stays pure composition.
 */
export function MatchSummaryTabs({
  homeTeam,
  awayTeam,
  matchEvents,
  matchDate,
  playerShots,
}: MatchSummaryTabsProps) {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");
  const [tab, setTab] = useState("stats");

  const statCategories = [
    { key: "fieldGoals", label: tCommon("stats.fieldGoals") },
    { key: "threePointers", label: tCommon("stats.threePointers") },
    { key: "freeThrows", label: tCommon("stats.freeThrows.full") },
    { key: "reboundsTotal", label: tCommon("stats.reboundsTotal") },
    { key: "reboundsOffensive", label: tCommon("stats.reboundsOffensive") },
    { key: "reboundsDefensive", label: tCommon("stats.reboundsDefensive") },
    { key: "assists", label: tCommon("stats.assists.full") },
    { key: "blocks", label: tCommon("stats.blocks.full") },
    { key: "steals", label: tCommon("stats.steals.full") },
    {
      key: "turnovers",
      label: tCommon("stats.turnovers.full"),
      lowerIsBetter: true,
    },
    { key: "pointsInPaint", label: tCommon("stats.pointsInPaint") },
    {
      key: "fouls",
      label: tCommon("stats.fouls.full"),
      lowerIsBetter: true,
    },
  ];

  return (
    <Tabs selectedKey={tab} onSelectionChange={setTab}>
      <TabList>
        <Tab id="stats">{tMatches("matchSummary.tabs.teamStats")}</Tab>
        <Tab id="home">{tMatches("matchSummary.tabs.homeTeam")}</Tab>
        <Tab id="away">{tMatches("matchSummary.tabs.awayTeam")}</Tab>
        <Tab id="events">{tMatches("matchSummary.tabs.matchEvents")}</Tab>
      </TabList>

      <TabPanel id="stats">
        <TeamStatsComparison
          homeStats={homeTeam.stats}
          awayStats={awayTeam.stats}
          categories={statCategories}
        />
      </TabPanel>

      <TabPanel id="home">
        <PlayerMatchStats
          team={homeTeam}
          isHomeTeam={true}
          opponent={awayTeam}
          playerShots={playerShots}
        />
      </TabPanel>

      <TabPanel id="away">
        <PlayerMatchStats
          team={awayTeam}
          isHomeTeam={false}
          opponent={homeTeam}
          playerShots={playerShots}
        />
      </TabPanel>

      <TabPanel id="events">
        <MatchEvents
          events={matchEvents}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          matchDate={matchDate}
        />
      </TabPanel>
    </Tabs>
  );
}
