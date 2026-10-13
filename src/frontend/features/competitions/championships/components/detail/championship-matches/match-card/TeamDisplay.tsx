// src/frontend/features/competitions/championships/components/detail/championship-matches/match-card/TeamDisplay.tsx
import type { Match } from "@/features/matches/types";
import { ClubMark } from "@/shared/components/domain";
import { formatTeamName } from "@/shared/utils";

interface TeamDisplayProps {
  readonly team: Match["homeTeam"] | Match["awayTeam"];
  readonly isWinner: boolean;
}

/**
 * One side of a fixture: club mark, club name, and team number below it, with
 * the full team name on hover since the club's name may be truncated.
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
        title={formatTeamName(team.club.name, team.number)}
      >
        <div className="truncate">{team.club.name}</div>
        <div className="text-xs text-text-secondary">{team.number}</div>
      </div>
    </div>
  );
}
