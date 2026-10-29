// src/frontend/features/matches/components/detail/TeamStatsComparison.tsx
"use client";

import { useTranslations } from "next-intl";

import type { MatchTeamStats } from "@/features/matches/types";
import { Section, StatComparison } from "@/shared/components/blocks";

interface StatCategory {
  key: string;
  label: string;
}

const PERCENTAGE_MAP: Record<string, string> = {
  fieldGoals: "fieldGoalPercentage",
  threePointers: "threePointPercentage",
  freeThrows: "freeThrowPercentage",
};

interface TeamStatsComparisonProps {
  readonly homeStats: MatchTeamStats;
  readonly awayStats: MatchTeamStats;
  readonly categories: StatCategory[];
}

/**
 * The two teams' stat lines side by side, one row per category the caller asks
 * for.
 *
 * Which stats appear is entirely `categories`; this component adds only the
 * percentage pairing. `PERCENTAGE_MAP` covers **field goals, three-pointers and
 * free throws**: those rows show made/attempted with the percentage beside it,
 * and the two teams are compared on that percentage. A category outside that
 * set renders its raw totals with no percentage, silently, because there is no
 * field to read one from.
 */
export function TeamStatsComparison({
  homeStats,
  awayStats,
  categories,
}: TeamStatsComparisonProps) {
  const tMatches = useTranslations("matches");

  return (
    <Section>
      <StatComparison
        variant="dual"
        sideA={homeStats}
        sideB={awayStats}
        labelA={tMatches("playerMatchStats.home")}
        labelB={tMatches("playerMatchStats.away")}
        config={categories}
        percentageMap={PERCENTAGE_MAP}
      />
    </Section>
  );
}

export default TeamStatsComparison;
