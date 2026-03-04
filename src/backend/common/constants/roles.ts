// src/backend/common/constants/roles.ts
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
} as const;

export const ROLES_LIST = Object.values(Role);
export type Role = (typeof ROLES_LIST)[number];
