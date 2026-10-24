// src/frontend/features/matches/utils/matchupSide.ts
import type { MatchTeam } from "@/features/matches/types";
import type { MatchupSide } from "@/shared/components/domain";
import { formatTeamName } from "@/shared/utils";

import type { MatchTeamRef } from "../types";

/**
 * One side of a match record, as `Matchup` draws it.
 *
 * @param team - the side as the match record references it
 * @param score - its final score, `null` until the match is played
 * @returns the side for `Matchup`
 */
export function matchupSide(
  team: MatchTeamRef,
  score: number | null,
): MatchupSide {
  return {
    teamId: team.id,
    teamName: formatTeamName(team.club.name, team.number),
    clubId: team.club.id,
    clubName: team.club.name,
    score,
  };
}

/**
 * One side of a match already assembled by `buildMatchTeam`, as `Matchup` draws it.
 *
 * @param team - the assembled side, whose `name` is already the team's name
 * @returns the side for `Matchup`
 */
export function matchTeamMatchupSide(team: MatchTeam): MatchupSide {
  return {
    teamId: team.id,
    teamName: team.name,
    clubId: team.clubId,
    clubName: team.clubName,
    score: team.score,
  };
}
