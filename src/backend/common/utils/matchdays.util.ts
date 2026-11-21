// src/backend/common/utils/matchdays.util.ts

/**
 * Counts a pool's matchdays from its number of teams. The scheduler plays
 * every pool as a double round robin (`build_round_robin_schedule` in
 * `db/python/utils/schedule_utils.py`): each team meets every other once at
 * home and once away, and with an odd number of teams one team sits out each
 * round. `tests/test_schedule.py` holds the generator to the same numbers, so
 * a change to the schedule format fails there.
 *
 * Counting the pool's matches instead reads its rows from the matches table,
 * which is too large to stay in memory and made a cold championships list take
 * up to a second.
 *
 * @param teamCount - the number of teams in the pool
 * @returns 2 × (teams − 1) for an even number of teams, 2 × teams for an odd
 *   one, and 0 for a pool of fewer than two, which has no match to play
 */
export function countMatchdays(teamCount: number): number {
  if (teamCount < 2) return 0;
  return teamCount % 2 === 0 ? 2 * (teamCount - 1) : 2 * teamCount;
}
