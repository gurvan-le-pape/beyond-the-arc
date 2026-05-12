// src/frontend/features/matches/components/detail/TeamStatsComparison.tsx
"use client";

import type { TeamStats } from "@/features/teams/types/TeamInfo";
import { Section } from "@/shared/components/blocks";
import { StatComparison } from "@/shared/components/blocks/StatComparison";

interface StatCategory {
  key: string;
  label: string;
}

interface TeamStatsComparisonProps {
  readonly homeStats: TeamStats;
  readonly awayStats: TeamStats;
  readonly categories: StatCategory[];
  readonly title?: string;
}

const PERCENTAGE_MAP: Record<string, string> = {
  fieldGoals: "fieldGoalPercentage",
  threePointers: "threePointPercentage",
  freeThrows: "freeThrowPercentage",
};

export function TeamStatsComparison({
  homeStats,
  awayStats,
  categories,
  title,
}: TeamStatsComparisonProps) {
  return (
    <Section variant="highlighted" title={title} className="text-center">
      <StatComparison
        variant="dual"
        sideA={homeStats}
        sideB={awayStats}
        labelA="Home"
        labelB="Away"
        config={categories}
        percentageMap={PERCENTAGE_MAP}
      />
    </Section>
  );
}

export default TeamStatsComparison;
