// src/frontend/features/matches/utils/buildTeam.ts
import type { MatchPlayerWithStats } from "@/features/matches/types/MatchPlayerStats";
import type { TeamInfoExtended } from "@/features/teams/types/TeamInfo";
import { NA } from "@/shared/constants";

import { getTeamScore } from "./getTeamScore";

function calculateTeamMatchStats(players: MatchPlayerWithStats[]) {
  const allStats = players.flatMap((player) => player.stats);

  const totalFieldGoals = allStats.reduce(
    (sum, stat) =>
      sum +
      (stat.threePointsMade ?? 0) +
      (stat.twoPointsIntMade ?? 0) +
      (stat.twoPointsExtMade ?? 0),
    0,
  );
  const totalFieldGoalAttempts = allStats.reduce(
    (sum, stat) =>
      sum +
      (stat.threePointsAttempted ?? 0) +
      (stat.twoPointsIntAttempted ?? 0) +
      (stat.twoPointsExtAttempted ?? 0),
    0,
  );
  const totalThreePointers = allStats.reduce(
    (sum, stat) => sum + (stat.threePointsMade ?? 0),
    0,
  );
  const totalThreePointAttempts = allStats.reduce(
    (sum, stat) => sum + (stat.threePointsAttempted ?? 0),
    0,
  );
  const totalFreeThrows = allStats.reduce(
    (sum, stat) => sum + (stat.freeThrowsMade ?? 0),
    0,
  );
  const totalFreeThrowAttempts = allStats.reduce(
    (sum, stat) => sum + (stat.freeThrowsAttempted ?? 0),
    0,
  );
  const totalReboundsOffensive = allStats.reduce(
    (sum, stat) => sum + (stat.rebounds.offensive ?? 0),
    0,
  );
  const totalReboundsDefensive = allStats.reduce(
    (sum, stat) => sum + (stat.rebounds.defensive ?? 0),
    0,
  );
  const totalAssists = allStats.reduce(
    (sum, stat) => sum + (stat.assists ?? 0),
    0,
  );
  const totalSteals = allStats.reduce(
    (sum, stat) => sum + (stat.steals ?? 0),
    0,
  );
  const totalBlocks = allStats.reduce(
    (sum, stat) => sum + (stat.blocks ?? 0),
    0,
  );
  const totalTurnovers = allStats.reduce(
    (sum, stat) => sum + (stat.turnovers ?? 0),
    0,
  );
  const totalFouls = allStats.reduce((sum, stat) => sum + (stat.fouls ?? 0), 0);
  const totalPointsInPaint = allStats.reduce(
    (sum, stat) => sum + (stat.twoPointsIntMade ?? 0) * 2,
    0,
  );

  return {
    fieldGoals: `${totalFieldGoals}/${totalFieldGoalAttempts}`,
    fieldGoalPercentage: totalFieldGoalAttempts
      ? `${Math.round((totalFieldGoals / totalFieldGoalAttempts) * 100)}%`
      : NA,
    threePointers: `${totalThreePointers}/${totalThreePointAttempts}`,
    threePointPercentage: totalThreePointAttempts
      ? `${Math.round((totalThreePointers / totalThreePointAttempts) * 100)}%`
      : NA,
    freeThrows: `${totalFreeThrows}/${totalFreeThrowAttempts}`,
    freeThrowPercentage: totalFreeThrowAttempts
      ? `${Math.round((totalFreeThrows / totalFreeThrowAttempts) * 100)}%`
      : NA,
    reboundsTotal: totalReboundsOffensive + totalReboundsDefensive,
    reboundsOffensive: totalReboundsOffensive,
    reboundsDefensive: totalReboundsDefensive,
    assists: totalAssists,
    steals: totalSteals,
    blocks: totalBlocks,
    turnovers: totalTurnovers,
    fouls: totalFouls,
    pointsInPaint: totalPointsInPaint,
  };
}

export function buildTeam(
  allPlayers: MatchPlayerWithStats[],
  teamId: number,
): TeamInfoExtended | null {
  const teamPlayers = allPlayers.filter((p) => p.player.team?.id === teamId);
  if (teamPlayers.length === 0) return null;

  const team = teamPlayers[0].player.team!;
  return {
    id: team.id,
    name: `${team.club?.name ?? ""} - ${team.number ?? ""}`,
    clubId: team.club?.id ?? null,
    clubName: team.club?.name ?? null,
    players: teamPlayers,
    score: getTeamScore(teamPlayers),
    stats: calculateTeamMatchStats(teamPlayers),
  };
}
