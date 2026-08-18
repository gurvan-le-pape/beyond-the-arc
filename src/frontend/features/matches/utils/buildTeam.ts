// src/frontend/features/matches/utils/buildTeam.ts
import type { MatchPlayerWithStats } from "@/features/matches/types";
import type { TeamInfoExtended, TeamStats } from "@/features/teams/types";

import type { MatchClubRef } from "../types";
import { getTeamScore } from "./getTeamScore";

/**
 * Assembles one side of a match from the flat player-stats list the API
 * returns, which carries both teams together.
 *
 * **Returns `null` when no player in the list belongs to `teamId`** — the caller
 * decides what that means. The match page treats it as a 404, since a match
 * with a side that has no players is not renderable.
 *
 * The display name is concatenated from the club name and team number, and
 * **each falls back to an empty string**, so a missing piece yields `"Club - "`
 * or `" - 3"` rather than an error. The team's own fields are taken from the
 * first matching player, which assumes every player of a team carries the same
 * team object.
 *
 * `score` is **derived** by summing the players' points, not read from the match
 * record, so it can disagree with an official scoreline that was entered
 * separately.
 *
 * @param allPlayers - every player in the match, both sides
 * @param teamId - the side to extract
 * @param club - club reference for naming and parent ids
 * @param stats - the team-level stat line, passed through untouched
 * @returns the assembled side, or `null` if it has no players
 */
export function buildTeam(
  allPlayers: MatchPlayerWithStats[],
  teamId: number,
  club: MatchClubRef,
  stats: TeamStats,
): TeamInfoExtended | null {
  const teamPlayers = allPlayers.filter((p) => p.player.team?.id === teamId);
  if (teamPlayers.length === 0) return null;

  const team = teamPlayers[0].player.team;
  return {
    id: team.id,
    name: `${club.name ?? ""} - ${team.number ?? ""}`,
    clubId: club.id,
    clubName: club.name,
    committeeId: club.committeeId,
    leagueId: club.leagueId,
    players: teamPlayers,
    score: getTeamScore(teamPlayers),
    stats,
  };
}
