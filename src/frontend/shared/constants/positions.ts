// src/frontend/shared/constants/positions.ts
export const Position = {
  PG: "PG", // Point Guard
  SG: "SG", // Shooting Guard
  SF: "SF", // Small Forward
  PF: "PF", // Power Forward
  C: "C", // Center
} as const;

export const POSITION_LIST = Object.values(Position);
export type Position = (typeof Position)[keyof typeof Position];
