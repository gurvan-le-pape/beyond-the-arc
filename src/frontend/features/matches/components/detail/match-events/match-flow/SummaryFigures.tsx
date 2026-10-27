// src/frontend/features/matches/components/detail/match-events/match-flow/SummaryFigures.tsx
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { MatchTeam } from "@/features/matches/types";
import { cn } from "@/shared/utils";

import { formatClock, type MatchSummary } from "../matchEventsView";
import { usePeriodAbbr } from "./usePeriodAbbr";

const INK = {
  home: "text-ink-home",
  away: "text-ink-away",
} as const;

interface SummaryFiguresProps {
  readonly summary: MatchSummary;
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
}

interface FigureProps {
  readonly label: string;
  readonly value: ReactNode;
  readonly detail: ReactNode;
}

/**
 * One figure: its name, the number, and a line saying whose or when.
 *
 * @param props - the figure's three lines
 * @returns a group of the figures' description list
 */
function Figure({ label, value, detail }: FigureProps) {
  return (
    <div className="min-w-0 rounded-card border border-divide surface-raised px-3 py-2.5">
      <dt className="text-xs text-text-secondary">{label}</dt>
      <dd className="text-lg font-bold leading-snug text-text-heading tabular-nums">
        {value}
      </dd>
      <dd className="truncate text-xs text-text-secondary">{detail}</dd>
    </div>
  );
}

/**
 * The shape of the match in four figures: lead changes and ties, each side's
 * biggest lead, the best run, and when the winner went ahead for good. The
 * last is left out of a match that ended level.
 */
export function SummaryFigures({
  summary,
  homeTeam,
  awayTeam,
}: SummaryFiguresProps) {
  const t = useTranslations("matches.matchEvents");
  const periodAbbr = usePeriodAbbr();

  const sideOf = (teamId: number) => (teamId === homeTeam.id ? "home" : "away");
  const nameOf = (teamId: number) =>
    teamId === homeTeam.id ? homeTeam.name : awayTeam.name;

  const { leadChanges, ties, biggestLead, bestRun, decidingPlay } = summary;

  return (
    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <Figure
        label={t("leadChanges")}
        value={leadChanges}
        detail={t("ties", { count: ties })}
      />
      <Figure
        label={t("biggestLead")}
        value={
          <>
            <span className={INK.home}>+{biggestLead.home?.margin ?? 0}</span>
            {" / "}
            <span className={INK.away}>+{biggestLead.away?.margin ?? 0}</span>
          </>
        }
        detail={t("homeAway")}
      />
      <Figure
        label={t("bestRun")}
        value={bestRun ? `${bestRun.points}–0` : "—"}
        detail={
          bestRun && (
            <span className={cn("font-semibold", INK[sideOf(bestRun.teamId)])}>
              {nameOf(bestRun.teamId)}
            </span>
          )
        }
      />
      {decidingPlay?.scoringTeamId !== undefined && (
        <Figure
          label={t("ledForGood")}
          value={`${periodAbbr(decidingPlay.period)} ${formatClock(decidingPlay.lead.secondsLeft)}`}
          detail={
            <span
              className={cn(
                "font-semibold",
                INK[sideOf(decidingPlay.scoringTeamId)],
              )}
            >
              {nameOf(decidingPlay.scoringTeamId)}
            </span>
          }
        />
      )}
    </dl>
  );
}

export default SummaryFigures;
