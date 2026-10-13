// src/frontend/features/competitions/championships/components/detail/championship-matches/match-card/TeamDisplay.tsx
import type { Match } from "@/features/matches/types";
import { ClubMark } from "@/shared/components/domain";

interface TeamDisplayProps {
  readonly team: Match["homeTeam"] | Match["awayTeam"];
  readonly isWinner: boolean;
}

/**
 * One side of a fixture: club crest, name, and team number.
 *
 * The crest is resolved from the club **name** through `formatNameToFileName`,
 * so a renamed club silently falls back to the default badge. Only leagues and
 * committees ship real logos; club crests are the fallback in practice.
 *
 * `isWinner` is supplied, not derived — this compares no scores and only styles
 * what it is told.
 */
export function TeamDisplay({ team, isWinner }: TeamDisplayProps) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      <span className="mb-1">
        <ClubMark clubName={team.club.name} size="sm" />
      </span>
      <div
        className={`text-sm text-center w-full ${
          isWinner
            ? "font-bold text-text-heading"
            : "font-normal text-text-body"
        }`}
        title={`${team.club.name} - ${team.number}`}
      >
        <div className="truncate">{team.club.name}</div>
        <div className="text-xs text-text-secondary">{team.number}</div>
      </div>
    </div>
  );
}
