// src/backend/modules/teams/aggregate-team-season-stats.ts
import { aggregateCareerStats } from "@modules/players/aggregate-career-stats";

import type {
  TeamMatchHistoryDto,
  TeamSeasonStatsDto,
} from "./dto/teams.response.dto";

/**
 * Aggregates a team's season stats from its match history, matching the
 * frontend `aggregateTeamStats` conventions exactly: it keeps only the rows
 * belonging to the requested team (a match carries both teams' players),
 * reuses the career aggregation over those rows, and adds the count of
 * distinct players who appeared for the team.
 */
export function aggregateTeamSeasonStats(
  teamId: number,
  matches: TeamMatchHistoryDto[],
): TeamSeasonStatsDto {
  const participants = matches.flatMap((match) =>
    match.players.filter((p) => p.player.teamId === teamId),
  );

  const uniquePlayers = new Set(participants.map((p) => p.player.id));

  return {
    ...aggregateCareerStats(participants.map((p) => p.stats)),
    players: uniquePlayers.size,
  };
}
