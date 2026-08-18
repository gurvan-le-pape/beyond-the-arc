// src/frontend/features/matches/utils/getTeamScore.ts
interface PlayerWithPoints {
  stats: { points: number | null } | { points: number | null }[];
}

/**
 * Totals a team's points from its players' stat lines.
 *
 * Accepts either shape of `stats` — one object or an array of them — because a
 * player carries a single line in a match context and several across a season.
 * Both are normalised here rather than at each call site.
 *
 * **A null points value counts as zero.** A team whose stats have not been
 * filled in therefore scores 0, indistinguishable from a genuine 0. This never
 * returns null, so it cannot be used to detect missing data.
 *
 * @param players - the players to total, each carrying one or many stat lines
 * @returns the summed points
 */
export function getTeamScore(players: PlayerWithPoints[]): number {
  return players.reduce((sum, player) => {
    const stats = Array.isArray(player.stats) ? player.stats : [player.stats];
    return sum + stats.reduce((s, stat) => s + (stat.points ?? 0), 0);
  }, 0);
}
