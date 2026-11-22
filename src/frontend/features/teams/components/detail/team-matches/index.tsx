// src/frontend/features/teams/components/detail/team-matches/index.tsx
import type { Team } from "../../../types/Team";
import type { TeamMatchHistory } from "../../../types/TeamMatchHistory";
import { splitMatchHistory } from "../../../utils/splitMatchHistory";
import { TeamMatchHistoryTable } from "./TeamMatchHistoryTable";
import { TeamUpcomingMatchesTable } from "./TeamUpcomingMatchesTable";

interface TeamMatchesProps {
  readonly team: Team;
  /** The team's whole season, played and to come, as the API returns it. */
  readonly matches: TeamMatchHistory[];
}

/**
 * A team's season in two sections: the matches it has played, then the ones
 * still to come, soonest first. The second renders nothing once the season
 * is over.
 */
export function TeamMatches({ team, matches }: TeamMatchesProps) {
  const { past, upcoming } = splitMatchHistory(matches);

  return (
    <>
      <TeamMatchHistoryTable team={team} matches={past} />
      <TeamUpcomingMatchesTable team={team} matches={upcoming} />
    </>
  );
}
