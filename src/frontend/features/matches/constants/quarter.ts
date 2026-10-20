// src/frontend/features/matches/constants/quarter.ts
export const Quarter = {
  Q1: "Q1",
  Q2: "Q2",
  Q3: "Q3",
  Q4: "Q4",
  /** Every overtime period together. */
  OT: "OT",
  ALL: "ALL",
} as const;

export const QUARTER_LIST = Object.values(Quarter);
export type Quarter = (typeof QUARTER_LIST)[number];
