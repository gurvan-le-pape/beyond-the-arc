// src/frontend/features/matches/utils/getTeamScore.ts
interface PlayerWithPoints {
  stats: { points: number | null } | { points: number | null }[];
}

export function getTeamScore(players: PlayerWithPoints[]): number {
  return players.reduce((sum, player) => {
    const stats = Array.isArray(player.stats) ? player.stats : [player.stats];
    return sum + stats.reduce((s, stat) => s + (stat.points ?? 0), 0);
  }, 0);
}
