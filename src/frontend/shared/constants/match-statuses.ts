// src/frontend/shared/constants/match-statuses.ts
export const MatchStatus = {
  SCHEDULED: "scheduled",
  GENERATING: "generating",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const MATCH_STATUS_LIST = Object.values(MatchStatus);
export type MatchStatus = (typeof MATCH_STATUS_LIST)[number];
