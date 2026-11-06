// src/backend/common/constants/match-statuses.ts
/**
 * Where a match is in the scheduler's lifecycle. The `matches_status_check`
 * constraint holds the column to these values.
 */
export const MatchStatus = {
  SCHEDULED: "scheduled",
  GENERATING: "generating",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const MATCH_STATUS_LIST = Object.values(MatchStatus);
export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus];
