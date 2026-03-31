// src/frontend/features/matches/components/detail/TeamStatsComparison.tsx
"use client";

import React, { useEffect, useState } from "react";

import type { TeamStats } from "@/features/teams/types/TeamInfo";
import { Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";
import { NA } from "@/shared/constants";
import { cn } from "@/shared/utils/cn";

interface StatCategory {
  key: string;
  label: string;
}

interface TeamStatsComparisonProps {
  homeStats: TeamStats;
  awayStats: TeamStats;
  categories: StatCategory[];
  title?: string;
}

const PERCENTAGE_MAP: Record<string, string> = {
  fieldGoals: "fieldGoalPercentage",
  threePointers: "threePointPercentage",
  freeThrows: "freeThrowPercentage",
};

function getStatDisplay(stats: TeamStats, key: string): string | number {
  const pctKey = PERCENTAGE_MAP[key];
  if (pctKey && stats[pctKey] !== null) {
    return `${stats[key]} (${stats[pctKey]})`;
  }
  return stats[key] ?? NA;
}

export const TeamStatsComparison: React.FC<TeamStatsComparisonProps> = ({
  homeStats,
  awayStats,
  categories,
  title,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Section variant="highlighted" title={title}>
      <div className="space-y-6">
        {categories.map(({ key, label }, index) => {
          const homeNum = Number(homeStats[key]) || 0;
          const awayNum = Number(awayStats[key]) || 0;
          const total = homeNum + awayNum;

          const homePct = total > 0 ? (homeNum / total) * 100 : 50;
          const awayPct = total > 0 ? (awayNum / total) * 100 : 50;

          let leader: "home" | "away" | "tie";
          if (homeNum > awayNum) {
            leader = "home";
          } else if (awayNum > homeNum) {
            leader = "away";
          } else {
            leader = "tie";
          }

          const homeDisplay =
            key in homeStats ? getStatDisplay(homeStats, key) : NA;
          const awayDisplay =
            key in awayStats ? getStatDisplay(awayStats, key) : NA;

          const delayMs = Math.min(index * 60, 400);

          return (
            <div key={key}>
              {/* Label */}
              <Text variant="overline" className="mb-2">
                {label}
              </Text>

              {/* Value | Bar | Value */}
              <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center">
                {/* Home value */}
                <div className="text-right">
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums text-text-heading dark:text-text-heading-dark",
                      leader === "home" &&
                        "border-b-2 border-primary-500 dark:border-primary-400 pb-0.5",
                    )}
                  >
                    {homeDisplay}
                  </span>
                </div>

                {/* Dual-segment bar */}
                <div className="h-2.5 w-full bg-surface-subtle dark:bg-surface-subtle-dark rounded-button overflow-hidden flex">
                  {/* Home segment */}
                  <div
                    className="h-full bg-primary-500 dark:bg-primary-400 rounded-l-button transition-all ease-out"
                    style={{
                      width: mounted ? `${homePct}%` : "0%",
                      transitionDuration: "600ms",
                      transitionDelay: `${delayMs}ms`,
                    }}
                  />
                  {/* Away segment */}
                  <div
                    className="h-full bg-secondary-600 dark:bg-secondary-400 rounded-r-button transition-all ease-out"
                    style={{
                      width: mounted ? `${awayPct}%` : "0%",
                      transitionDuration: "600ms",
                      transitionDelay: `${delayMs}ms`,
                    }}
                  />
                </div>

                {/* Away value */}
                <div className="text-left">
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums text-text-heading dark:text-text-heading-dark",
                      leader === "away" &&
                        "border-b-2 border-secondary-600 dark:border-secondary-400 pb-0.5",
                    )}
                  >
                    {awayDisplay}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default TeamStatsComparison;
