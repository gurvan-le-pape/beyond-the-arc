// src/backend/modules/teams/aggregate-team-season-stats.ts
import type { PlayerSummaryDto } from "@common/dto";
import { aggregateCareerStats } from "@common/utils";
import type { PlayerMatchStatsDto } from "@modules/players/dto";

import type { TeamSeasonStatsDto } from "./dto/teams.response.dto";

/**
 * The box-score rows of one match, as the aggregation reads them.
 */
export interface MatchParticipants {
  readonly players: readonly {
    readonly player: PlayerSummaryDto;
    readonly stats: PlayerMatchStatsDto;
  }[];
}

/**
 * Aggregates a team's season stats from its matches' box scores. It keeps only
 * the rows belonging to the requested team (a match may carry both teams' players),
 * sums the season totals, and counts the distinct players who appeared.
 *
 * Per-game averages divide by the number of games the team played — the
 * distinct matches it fielded players in — not by player-appearances, so
 * `pointsPerGame` is the team's points per match (~80), not per player.
 */
export function aggregateTeamSeasonStats(
  teamId: number,
  matches: readonly MatchParticipants[],
): TeamSeasonStatsDto {
  const teamMatches = matches.filter((match) =>
    match.players.some((p) => p.player.teamId === teamId),
  );
  const participants = teamMatches.flatMap((match) =>
    match.players.filter((p) => p.player.teamId === teamId),
  );

  const totals = aggregateCareerStats(participants.map((p) => p.stats));
  const uniquePlayers = new Set(participants.map((p) => p.player.id));

  const gamesPlayed = teamMatches.length;
  const gp = gamesPlayed || 1;
  const perGame = (n: number) => Number((n / gp).toFixed(1));

  return {
    ...totals,
    gamesPlayed,
    pointsPerGame: perGame(totals.points),
    reboundsPerGame: perGame(totals.rebounds),
    assistsPerGame: perGame(totals.assists),
    stealsPerGame: perGame(totals.steals),
    blocksPerGame: perGame(totals.blocks),
    turnoversPerGame: perGame(totals.turnovers),
    foulsPerGame: perGame(totals.fouls),
    players: uniquePlayers.size,
  };
}
