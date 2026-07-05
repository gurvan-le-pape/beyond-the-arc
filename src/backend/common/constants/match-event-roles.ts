// src/backend/common/constants/match-event-roles.ts
export const MatchEventRole = {
  SHOOTER: "shooter",
  FOULER: "fouler",
  STEALER: "stealer",
  VICTIM: "victim",
  REBOUNDER: "rebounder",
  ASSISTER: "assister",
  BLOCKER: "blocker",
  BLOCKED: "blocked",
  WINNER: "winner",
  EXITING_PLAYER: "exiting_player",
  ENTERING_PLAYER: "entering_player",
  STARTER: "starter",
} as const;

export const MATCH_EVENT_ROLES_LIST = Object.values(MatchEventRole);
export type MatchEventRole = (typeof MATCH_EVENT_ROLES_LIST)[number];
