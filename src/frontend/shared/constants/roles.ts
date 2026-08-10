// src/frontend/shared/constants/roles.ts
export const Role = {
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

export const ROLE_LIST = Object.values(Role);
export type Role = (typeof ROLE_LIST)[number];
